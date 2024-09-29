import { LockOutlined, MailOutlined } from "@ant-design/icons";
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
import { author, login } from "../../redux/features/authSlice";
import { decode } from "../../utils/jwtUtil";
import ForgotPasswordModal from "./Account/ForgotPasswordModal";
import OtpModal from "./Account/OtpModal";
const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
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
    .min(8, "Password must be at least 8 characters")
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
    .required("Phone number is requried"),
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
      message.success("Verify successfully");
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
      message.success("Reset password successfully");
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
  const showOtpModal = () => {
    setIsModalVisible(true);
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    const userCred = await signInWithPopup(auth, googleProvider);
    console.log("userCred: ", userCred);

    if (userCred) {
      const accessToken = userCred._tokenResponse.idToken;
      console.log("Google Access Token: ", accessToken);
      var result = await googleCallback(accessToken);
      if (result.isSuccess) {
        console.log("callback: ", result);
        localStorage.setItem("accessToken", result?.result?.token);
        localStorage.setItem("refreshToken", result?.result?.refreshToken);
        var fetchAccount = await getAccountById(
          decode(localStorage.getItem("accessToken")).accountId,
          localStorage.getItem("accessToken")
        );
        dispatch(author(result.result.mainRole));
        if (fetchAccount.isSuccess) {
          const userAccount = fetchAccount.result;
          dispatch(login(userAccount));
          message.success("Đăng nhập thành công");
          navigate("/");
        }
      }
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
                onSubmit={async (values, { setSubmitting }) => {
                  try {
                    setIsLoading(true);
                    const data = await loginWithEmailPass(
                      values.email,
                      values.password
                    );
                    if (data.isSuccess) {
                      localStorage.setItem("accessToken", data.result.token);
                      localStorage.setItem(
                        "refreshToken",
                        data.result.refreshToken
                      );
                      var fetchAccount = await getAccountById(
                        decode(localStorage.getItem("accessToken")).accountId,
                        localStorage.getItem("accessToken")
                      );
                      dispatch(author(data?.result?.mainRole));
                      if (fetchAccount.isSuccess) {
                        const userAccount = fetchAccount.result;
                        dispatch(login(userAccount));
                        message.success("Đăng nhập thành công");
                        navigate("/");
                      }
                    } else {
                      for (var i = 0; i < data.messages.length; i++) {
                        message.error(data.messages[i]);
                        if (
                          data.messages[i] ==
                          "Tài khoản này chưa được xác thực !"
                        ) {
                          setEmail(values.email);
                          setIsModalVisible(true);
                        }
                      }
                    }
                  } catch (err) {
                    console.error(err);
                  } finally {
                    setIsLoading(false);
                  }
                }}
              >
                {({ isSubmitting, errors, touched }) => (
                  <Form>
                    <div className="py-4">
                      <span className="mb-2 text-md">Email</span>
                      <Field
                        className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
                        type="email"
                        name="email"
                        prefix={<MailOutlined />}
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
                        prefix={<LockOutlined />}
                        placeholder="Mật khẩu của bạn"
                      />
                      {errors.password && touched.password && (
                        <div
                          className="text-red-500"
                          style={{ fontSize: "0.75rem", marginTop: "0.25rem" }}
                        >
                          {errors.password}
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between w-full py-4  mr-24">
                      <span
                        style={{ cursor: "pointer" }}
                        onClick={() => setIsModalForgotPasswordVisible(true)}
                        className=" text-md w-full block text-baseGreen italic"
                      >
                        Quên mật khẩu?
                      </span>
                    </div>

                    <button
                      type="submit"
                      className="w-full mb-6 inline-block  px-4 py-2  text-xs text-center font-semibold leading-6 text-white bg-primary rounded-lg transition duration-200"
                      disabled={isSubmitting}
                    >
                      {" "}
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
                        {" "}
                        Đăng kí ở đây
                      </a>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
            <div className="relative">
              <img
                src="data:image/png;base64,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"
                alt="img"
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
        <>
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
                      try {
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
                          message.error(
                            "Registration failed. Please try again."
                          );
                        }
                        setIsLoading(false);
                      } catch (error) {
                        console.error("Error signing up:", error);
                        message.error(
                          "An error occurred. Please try again later."
                        );
                      }
                    } catch (err) {
                      console.error(err);
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
                          prefix={<MailOutlined />}
                          placeholder="Nhập email của bạn"
                        />
                        {errors.email && touched.email && (
                          <div className="text-red-500">{errors.email}</div>
                        )}
                      </div>

                      <div className="py-2 flex justify-start">
                        <div className="flex flex-col justify-between  mr-5">
                          <span className="mb-2 text-md mr-6">Tên</span>
                          <Field
                            className="w-full mr-2 p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
                            name="firstName"
                            placeholder=" Tên của bạn"
                          />
                          {errors.firstName && (
                            <div className="text-red-500">
                              {errors.firstName}
                            </div>
                          )}
                          {touched.firstName && (
                            <div className="text-red-500">
                              {touched.firstName}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col justify-between ">
                          <span className="mb-2 text-md mr-6">
                            Họ và tên đệm
                          </span>
                          <Field
                            className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
                            name="lastName"
                            placeholder="Họ và tên đệm"
                          />
                          {errors.lastName && (
                            <div className="text-red-500">
                              {errors.lastName}
                            </div>
                          )}
                          {touched.lastName && (
                            <div className="text-red-500">
                              {touched.lastName}
                            </div>
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
                          <div className="text-red-500">
                            {errors.phoneNumber}
                          </div>
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
                          prefix={<LockOutlined />}
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
                          prefix={<LockOutlined />}
                          placeholder="Nhập lại mật khẩu"
                        />
                        {errors.repassword && (
                          <div className="text-red-500">
                            {errors.repassword}
                          </div>
                        )}
                        {touched.repassword && (
                          <div className="text-red-500">
                            {touched.repassword}
                          </div>
                        )}
                      </div>
                      <button
                        htmlType="submit"
                        className="w-full mb-3 inline-block  px-4 py-2 text-xs text-center font-semibold leading-6 text-white  bg-primary hover:bg-base4 rounded-lg transition duration-200"
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
                          {" "}
                          Đăng nhập ngay
                        </a>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
              <div className="relative">
                <img
                  src="src\images\login.jpg"
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
        </>
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
