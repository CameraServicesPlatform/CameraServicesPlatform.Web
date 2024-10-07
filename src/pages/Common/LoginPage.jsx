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
    try {
      const result = await activeAccount(email, otp);
      console.log("Result from activeAccount:", result);
      if (result && result.isSuccess) {
        message.success("Verify successfully");
        setIsModalVisible(false);
        setIsSignUp(false);
      } else {
        message.error(
          result.error || "Verification failed. Please check your OTP."
        );
      }
    } catch (error) {
      console.error("Error during OTP submission:", error);
      message.error("An error occurred during verification.");
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
                CAMERA SERVICE PLATFORM
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
                src={loginImage}
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
                  src="https://media.istockphoto.com/id/1151606826/vi/anh/n%E1%BB%99i-th%E1%BA%A5t-c%E1%BB%A7a-c%E1%BB%ADa-h%C3%A0ng-qu%E1%BA%A7n-%C3%A1o-th%E1%BB%9Di-trang-v%E1%BB%9Bi-qu%E1%BA%A7n-%C3%A1o-ph%E1%BB%A5-n%E1%BB%AF-kh%C3%A1c-nhau-tr%C3%AAn-m%C3%B3c-%C3%A1o-v%E1%BB%9Bi-nhi%E1%BB%81u-m%C3%A0u.jpg?s=170667a&w=0&k=20&c=8Otm5d6hO00u1ZcTjxeeiMwRwQYpHjwCcgvDvrUipQc="
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
