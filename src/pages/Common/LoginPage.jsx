import { message } from "antd";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { Field, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import {
  activeAccount,
  createAccount,
  getAccountById,
  googleCallback,
  loginWithEmailPass,
  submitOTPResetPass,
} from "../../api/accountApi";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
import { auth } from "../../firebase/firebase.config";
import loginImage from "../../images/login.jpg";
import { author, login } from "../../redux/features/authSlice";
import { decode } from "../../utils/jwtUtil";
import ForgotPasswordModal from "./Account/ForgotPasswordModal";
import OtpModal from "./Account/OtpModal";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      'Password must contain at least one special character (!@#$%^&*(),.?":{}|<>)'
    ),
});

const SignUpSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      'Password must contain at least one special character (!@#$%^&*(),.?":{}|<>)'
    ),
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  repassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
  phoneNumber: Yup.number()
    .min(10, "Must be more than 10 characters")
    .required("Phone number is required"),
});

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [isModalForgotPasswordVisible, setIsModalForgotPasswordVisible] =
    useState(false);
  const { user } = useSelector((state) => state.user || {});
  const dispatch = useDispatch();
  const googleProvider = new GoogleAuthProvider();
  const navigate = useNavigate();

  const handleOtpSubmit = async (otp) => {
    console.log("Submitted OTP:", otp);
    const result = await activeAccount(email, otp);
    if (result.isSuccess) {
      message.success("Xác minh thành công!");
      setIsModalVisible(false);
      setIsSignUp(false);
    }
  };

  const handleForgotSubmit = async (data) => {
    console.log(data);
    const result = await submitOTPResetPass(
      data.email,
      data.recoveryCode,
      data.newPassword
    );
    if (result.isSuccess) {
      message.success("Đặt lại mật khẩu thành công!");
    } else {
      for (var i = 0; i < result.messages.length; i++) {
        message.error(result.messages[i]);
      }
    }
    setIsModalForgotPasswordVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleForgotCancel = () => {
    setIsModalForgotPasswordVisible(false);
  };

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      setIsLoading(true);
      const data = await loginWithEmailPass(values.email, values.password);

      if (data && data.isSuccess) {
        const token = data.result.token;
        const refreshToken = data.result.refreshToken;

        localStorage.setItem("token", token);
        localStorage.setItem("refreshToken", refreshToken);

        if (token && token.split(".").length === 3) {
          const decodedToken = decode(token);
          const fetchAccount = await getAccountById(
            decodedToken.accountId,
            token
          );
          dispatch(author(data.result.mainRole));

          if (fetchAccount.isSuccess) {
            const userAccount = fetchAccount.result;
            dispatch(login(userAccount));
            message.success("Đăng nhập thành công");
            navigate("/");
          }
        } else {
          throw new Error("Token format không hợp lệ");
        }
      } else {
        // Adjust error handling here
        if (data && data.messages) {
          for (let messageText of data.messages) {
            message.error(messageText);
            if (messageText === "Tài khoản này chưa được xác minh!") {
              setEmail(values.email);
              setIsModalVisible(true);
            }
          }
        } else {
          message.error("Đăng nhập không thành công. Vui lòng thử lại.");
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      message.error("Đăng nhập không thành công. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const userCred = await signInWithPopup(auth, googleProvider);
      console.log("userCred: ", userCred);

      if (userCred) {
        const token = userCred._tokenResponse.idToken;
        console.log("Google Access Token: ", token);

        if (token && token.split(".").length === 3) {
          var result = await googleCallback(token);
          if (result.isSuccess) {
            localStorage.setItem("token", result?.result?.token);
            localStorage.setItem("refreshToken", result?.result?.refreshToken);

            const token = localStorage.getItem("token");
            if (token && token.split(".").length === 3) {
              const decodedToken = decode(token);

              if (decodedToken && decodedToken.accountId) {
                const fetchAccount = await getAccountById(
                  decodedToken.accountId,
                  token
                );
                dispatch(author(result.result.mainRole));
                if (fetchAccount.isSuccess) {
                  const userAccount = fetchAccount.result;
                  dispatch(login(userAccount));
                  message.success("Đăng nhập thành công");
                  navigate("/");
                }
              } else {
                message.error("Invalid token sInvalid token structure.");
              }
            } else {
              message.error("Invalid token structure.");
            }
          }
        } else {
          message.error("Invalid token received from Google");
        }
      }
    } catch (error) {
      console.error("Error during Google SignIn:", error);
      message.error("An error occurred during sign-in.");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user]);

  return (
    <>
      <LoadingComponent isLoading={isLoading} />
      {!isSignUp ? (
        <div className="flex items-center justify-center min-h-screen bg-base2">
          <div className="relative flex flex-col m-6 space-y-8 shadow-2xl rounded-2xl md:flex-row md:space-y-0">
            <div className="flex flex-col justify-center p-8 md:p-14">
              <span className="mb-3 text-4xl font-bold">
                Camera Service Platform
              </span>
              <span className="font-light text-gray-400 mb-8">
                Bạn vui lòng nhập các thông tin chi tiết để đăng nhập
              </span>
              <Formik
                initialValues={{ email: "", password: "" }}
                validationSchema={LoginSchema}
                onSubmit={onSubmit}
              >
                {({ isSubmitting, errors, touched }) => (
                  <Form>
                    <div className="py-4">
                      <span className="mb-2 text-md">Email</span>
                      <Field
                        className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
                        type="email"
                        name="email"
                        placeholder="Email của bạn"
                      />
                      {errors.email && touched.email && (
                        <div className="text-red-500">{errors.email}</div>
                      )}
                    </div>
                    <div className="py-4">
                      <span className="mb-2 text-md">Mật khẩu</span>
                      <Field
                        className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
                        type="password"
                        name="password"
                        placeholder="Mật khẩu của bạn"
                      />
                      {errors.password && touched.password && (
                        <div className="text-red-500">{errors.password}</div>
                      )}
                    </div>
                    <div className="flex justify-between w-full py-4 mr-24">
                      <span
                        style={{ cursor: "pointer" }}
                        onClick={() => setIsModalForgotPasswordVisible(true)}
                        className="text-md w-full block text-baseGreen italic"
                      >
                        Quên mật khẩu?
                      </span>
                    </div>
                    <button
                      type="submit"
                      className="w-full mb-6 inline-block px-4 py-2 text-xs text-center font-semibold leading-6 text-white bg-primary rounded-lg transition duration-200"
                      disabled={isSubmitting}
                    >
                      Đăng nhập
                    </button>
                    <button
                      className="w-full mb-6 text-black py-2 bg-base-300 rounded-md"
                      onClick={handleGoogleSignIn}
                    >
                      <i className="fa-brands fa-google mx-2"></i> Đăng nhập với
                      Google
                    </button>
                    <div className="text-center text-gray-400">
                      Bạn chưa có tài khoản?
                      <a
                        style={{ cursor: "pointer" }}
                        className="font-bold text-black hover:text-baseGreen"
                        onClick={() => setIsSignUp(true)}
                      >
                        Đăng kí ở đây
                      </a>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
            <div className="relative">
              <img
                src={loginImage}
                alt="camera"
                className="w-[400px] h-full hidden rounded-r-2xl md:block object-cover"
              />
              <div className="absolute hidden bottom-10 right-6 p-6 bg-white bg-opacity-40 backdrop-blur-sm rounded drop-shadow-lg md:block">
                <span className="text-black italic text-xl">
                  Camera Service Platform
                  <br />
                  Đem lại cho bạn trải nghiệm sản phẩm vô cùng tiện lợi.
                  <br />
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-screen bg-base2">
          <div className="relative flex flex-col m-6 space-y-8 bg-white shadow-2xl rounded-2xl md:flex-row md:space-y-0">
            <div className="flex flex-col justify-center px-8 md:p-14">
              <span className="mb-3 text-4xl font-bold">
                Chào mừng bạn trở lại
              </span>
              <span className="font-light text-gray-400 mb-2">
                Vui lòng nhập thông tin để đăng ký tài khoản
              </span>
              <Formik
                initialValues={{
                  email: "",
                  password: "",
                  firstName: "",
                  lastName: "",
                  repassword: "",
                  phoneNumber: "",
                }}
                validationSchema={SignUpSchema}
                onSubmit={async (values, { setSubmitting }) => {
                  try {
                    setIsLoading(true);
                    const result = await createAccount(
                      values.email,
                      values.firstName,
                      values.lastName,
                      values.password,
                      true,
                      values.phoneNumber,
                      "Customer"
                    );
                    console.log("Register result: ", result);
                    if (result.isSuccess === true) {
                      setEmail(values.email);
                      setIsModalVisible(true);
                      message.success(
                        "Registration successful! Please verify email."
                      );
                    } else {
                      console.error(
                        "Registration failed:",
                        result ? result.message : "Unknown error"
                      );
                      message.error("Registration failed. Please try again.");
                    }
                  } catch (error) {
                    console.error("Error signing up:", error);
                    message.error("An error occurred. Please try again later.");
                  } finally {
                    setIsLoading(false);
                  }
                }}
              >
                {({ isSubmitting, errors, touched }) => (
                  <Form>
                    <div className="py-2">
                      <span className="mb-2 text-md">Email</span>
                      <Field
                        className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
                        type="email"
                        name="email"
                        placeholder="Nhập email của bạn"
                      />
                      {errors.email && touched.email && (
                        <div className="text-red-500">{errors.email}</div>
                      )}
                    </div>
                    <div className="py-2 flex justify-start">
                      <div className="flex flex-col justify-between mr-5">
                        <span className="mb-2 text-md mr-6">Tên</span>
                        <Field
                          className="w-full mr-2 p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
                          name="firstName"
                          placeholder="Tên của bạn"
                        />
                        {errors.firstName && (
                          <div className="text-red-500">{errors.firstName}</div>
                        )}
                        {touched.firstName && (
                          <div className="text-red-500">
                            {touched.firstName}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col justify-between">
                        <span className="mb-2 text-md mr-6">Họ và tên đệm</span>
                        <Field
                          className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
                          name="lastName"
                          placeholder="Họ và tên đệm"
                        />
                        {errors.lastName && (
                          <div className="text-red-500">{errors.lastName}</div>
                        )}
                        {touched.lastName && (
                          <div className="text-red-500">{touched.lastName}</div>
                        )}
                      </div>
                    </div>
                    <div className="py-2">
                      <span className="mb-2 text-md">Số điện thoại</span>
                      <Field
                        className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
                        name="phoneNumber"
                        placeholder="Nhập số điện thoại của bạn"
                      />
                      {errors.phoneNumber && (
                        <div className="text-red-500">{errors.phoneNumber}</div>
                      )}
                      {touched.phoneNumber && (
                        <div className="text-red-500">
                          {touched.phoneNumber}
                        </div>
                      )}
                    </div>
                    <div className="py-2">
                      <span className="mb-2 text-md">Mật khẩu</span>
                      <Field
                        className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
                        type="password"
                        name="password"
                        placeholder="Mật khẩu của bạn"
                      />
                      {errors.password && (
                        <div className="text-red-500">{errors.password}</div>
                      )}
                      {touched.password && (
                        <div className="text-red-500">{touched.password}</div>
                      )}
                    </div>
                    <div className="py-2">
                      <span className="mb-2 text-md">Nhập lại mật khẩu</span>
                      <Field
                        className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
                        type="password"
                        name="repassword"
                        placeholder="Nhập lại mật khẩu"
                      />
                      {errors.repassword && (
                        <div className="text-red-500">{errors.repassword}</div>
                      )}
                      {touched.repassword && (
                        <div className="text-red-500">{touched.repassword}</div>
                      )}
                    </div>
                    <button
                      htmlType="submit"
                      className="w-full mb-3 inline-block px-4 py-2 text-xs text-center font-semibold leading-6 text-white bg-primary hover:bg-base4 rounded-lg transition duration-200"
                      disabled={isSubmitting}
                      loading={isLoading}
                    >
                      Đăng ký tài khoản
                    </button>
                    <div className="text-center text-gray-400">
                      Tôi đã có tài khoản ?
                      <a
                        style={{ cursor: "pointer" }}
                        onClick={() => setIsSignUp(false)}
                        className="font-bold text-black hover:text-baseGreen"
                      >
                        Đăng nhập ngay
                      </a>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
            <div className="relative">
              <img
                src={loginImage}
                alt="img"
                className="w-[400px] h-full hidden rounded-r-2xl md:block object-cover"
              />
              <div className="absolute hidden bottom-10 right-6 p-6 bg-white bg-opacity-20 backdrop-blur-sm rounded drop-shadow-lg md:block">
                <span className="text-black italic text-xl">
                  We've been using Untitle to kick
                  <br />
                  start every new project and can't <br />
                  imagine working without it.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
      <OtpModal
        visible={isModalVisible}
        onCancel={handleCancel}
        onOtpSubmit={handleOtpSubmit}
        email={email}
      />
      <ForgotPasswordModal
        visible={isModalForgotPasswordVisible}
        onCancel={handleForgotCancel}
        onSubmit={handleForgotSubmit}
      />
    </>
  );
};

export default LoginPage;
