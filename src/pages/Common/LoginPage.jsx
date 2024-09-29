import { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase/firebase.config";
import {
  activeAccount,
  createAccount,
  getAccountById,
  googleCallback,
  loginWithEmailPass,
  submitOTPResetPass,
} from "../../api/accountApi";
import { toast } from "react-toastify";
import { decode } from "../../utils/jwtUtil";
import { author, login } from "../../redux/features/authSlice";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
import OtpModal from "./Account/OtpModal";
import ForgotPasswordModal from "./Account/ForgotPasswordModal";
const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Email không hợp lệ").required("Bắt buộc nhập email"),
  password: Yup.string()
    .required("Bắt buộc nhập password")
    .min(8, "Password phải có ít nhất 8 ký tự")
    .matches(/[A-Z]/, "Password phải có ít nhất 1 chữ cái viết hoa")
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      'Password phải chứa ít nhất 1 ký tự đặc biệt (!@#$%^&*(),.?":{}|<>)'
    ),
});
const SignUpSchema = Yup.object().shape({
  email: Yup.string().email("Email không hợp lệ").required("Bắt buộc nhập email"),
  password: Yup.string()
    .required("Bắt buộc nhập password")
    .min(8, "Password phải có ít nhất 8 ký tự")
    .matches(/[A-Z]/, "Password phải có ít nhất 1 chữ cái viết hoa")
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      'Password phải chứa ít nhất 1 ký tự đặc biệt (!@#$%^&*(),.?":{}|<>)'
    ),
  firstName: Yup.string().required("Bắt buộc nhập tên"),
  lastName: Yup.string().required("Bắt buộc nhập họ và tên đệm"),
  repassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Bắt buộc nhập confirm password"),
  phoneNumber: Yup.number()
    .min(10, "Phải lớn hơn 10 ký tự")
    .required("Bắt buộc nhập số điện thoại"),
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
      toast.success("Verify successfully");
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
      toast.success("Reset password successfully");
    } else {
      for (var i = 0; i < result.messages.length; i++) {
        toast.error(result.messages[i]);
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
        dispatch(author(decode(localStorage.getItem("accessToken")).role));
        if (fetchAccount.isSuccess) {
          const userAccount = fetchAccount.result;
          dispatch(login(userAccount));
          toast.success("Đăng nhập thành công");
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
              <span className="mb-3 text-4xl font-bold">Camera Services Platform</span>
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
                      dispatch(
                        author(decode(localStorage.getItem("accessToken")).role)
                      );
                      if (fetchAccount.isSuccess) {
                        const userAccount = fetchAccount.result;
                        dispatch(login(userAccount));
                        toast.success("Đăng nhập thành công");
                        navigate("/");
                      }
                    } else {
                      for (var i = 0; i < data.messages.length; i++) {
                        toast.error(data.messages[i]);
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
                src="/src/images/login_register.jpg"
                alt="img"
                className="w-[400px] h-full hidden rounded-r-2xl md:block object-cover"
              />
              <div className="absolute hidden bottom-10 right-6 p-6 bg-white bg-opacity-40 backdrop-blur-sm rounded drop-shadow-lg md:block">
                <span className="text-black italic text-xl">
                Camera-Services.com
                  <br />
                  Đem lại cho bạn trải nghiệm vô cùng tiện lợi.
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
                Chào mừng bạn!
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
                          toast.success(
                            "Registration successful! Please verify email."
                          );
                        } else {
                          console.error(
                            "Registration failed:",
                            result ? result.message : "Unknown error"
                          );
                          toast.error("Registration failed. Please try again.");
                        }
                        setIsLoading(false);
                      } catch (error) {
                        console.error("Error signing up:", error);
                        toast.error(
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
                  src="/src/images/login_register.jpg"
                  alt="img"
                  className="w-[400px] h-full hidden rounded-r-2xl md:block object-cover"
                />
                <div className="absolute hidden bottom-10 right-6 p-6 bg-white bg-opacity-20 backdrop-blur-sm rounded drop-shadow-lg md:block">
                  <span className="text-black italic text-xl">
                    Camera-Services.com
                    <br />
                    Cung cấp các dịch vụ <br />
                    về máy ảnh và phụ kiện máy ảnh.
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
