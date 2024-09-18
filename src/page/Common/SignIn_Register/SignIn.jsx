import { Button, Checkbox, Form, Input, message } from "antd";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { auth } from "../../../config/firebase";
import { decode } from "../../../utils/JwtUtil";
import {
  activeAccount,
  getAccountById,
  googleCallback,
  loginWithEmailPass,
} from "../../api/AccountApi";
import { MainLogo } from "../../components";
import LoadingOverlay from "../../components/Loading/LoadingOverlay";
import { author, login } from "../../redux/features/authSlice";
import { FORGET_PASSWORD_PAGE } from "../../settings/constant";
import OtpModal from "../OtpModal";
const SignInContainer = styled.div`
    width: 600px;
    border-radius: 0.75rem;
    padding: 50px 100px 50px 100px;
    background-color: rgb(241 245 249 / 64%););
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    `;

const SignInForm = styled(Form)`
  .ant-form-item {
    margin-bottom: 40px;
  }
`;

const ButtonSignIn = styled(Button)`
  background-color: rgb(13 148 136);
`;

const StyledButton = styled(Button)`
  background-color: ${(props) =>
    props.isLoginButton ? "rgb(13 148 136)" : "default"};
`;

const SocialLoginButton = styled(Button)`
  width: 100%;
  margin-bottom: 10px;
`;

const SocialLoginContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;

  & > * {
    margin-right: 10px; // Spacing between buttons
  }

  & > *:last-child {
    margin-right: 0;
  }
`;
function SignInPage() {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [isModalForgotPasswordVisible, setIsModalForgotPasswordVisible] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const user = useSelector((state) => state.user.user || {});
  const dispatch = useDispatch();
  const googleProvider = new GoogleAuthProvider();

  const navigate = useNavigate();
  const onFinish = async (values) => {
    try {
      // debugger;
      setIsLoading(true);
      const data = await loginWithEmailPass({
        email: values.username,
        password: values.password,
      });
      if (data.isSuccess) {
        localStorage.setItem("accessToken", data.result.token);
        localStorage.setItem("refreshToken", data.result.refreshToken);
        var fetchAccount = await getAccountById(
          decode(localStorage.getItem("accessToken")).accountId,
          localStorage.getItem("accessToken")
        );
        // debugger;
        dispatch(author(decode(localStorage.getItem("accessToken")).role));
        if (fetchAccount.isSuccess) {
          dispatch(login(fetchAccount.result));
          message.success("Đăng nhập thành công");
          navigate("/");
        }
      } else {
        for (var i = 0; i < data.messages.length; i++) {
          message.error(data.messages[i]);
          if (data.messages[i] == "Tài khoản này chưa được xác thực !") {
            setEmail(values.username);
            // debugger;
            setIsModalVisible(true);
          }
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
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
          dispatch(login(fetchAccount.result));
          message.success("Đăng nhập thành công");
          navigate("/");
        }
      }
    }
    setIsLoading(false);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const showOtpModal = () => {
    setIsModalVisible(true);
  };
  const handleOtpSubmit = async (otp) => {
    console.log("Submitted OTP:", otp);
    const result = await activeAccount(email, otp);
    if (result.isSuccess) {
      message.success("Verify successfully");
      setIsModalVisible(false);
    }
  };
  return (
    <div className="flex h-screen bg-[url('https://media1.thrillophilia.com/filestore/e0sv7qhxf4fg3gd33dfe1liycj4h_shutterstock_2178792551.jpg?dpr=1.75&w=1463')] bg-cover bg-center">
      <LoadingOverlay
        isLoading={isLoading}
        title={"đang tiến hành đăng nhập"}
      />
      <div className=" flex flex-col justify-center items-center w-1/2 ">
        <SignInContainer>
          <h1 className="scale-150 w-20 ml-5 mb-10">
            <MainLogo />
          </h1>
          <h2 className="font-semibold text-3xl mb-3">
            Chào mừng bạn đến với Cóc Travel
          </h2>
          <p className="font-medium text-2xl text-slate-500">
            Vui lòng nhập thông tin để đăng nhập
          </p>

          <SignInForm
            className="mt-10"
            name="normal_login"
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
          >
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập email!",
                },
              ]}
            >
              <Input className="h-10" placeholder="Tên đăng nhập" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập mật khẩu",
                },
              ]}
            >
              <Input.Password className="h-10" placeholder="Password" />
            </Form.Item>

            <Form.Item className="flex justify-between items-center">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox className="text-base font-semibold">
                  Nhớ mật khẩu
                </Checkbox>
              </Form.Item>
              <Link
                to={FORGET_PASSWORD_PAGE}
                className="text-base font-semibold text-cyan-700"
              >
                Quên mật khẩu ?
              </Link>
            </Form.Item>

            <Form.Item>
              <ButtonSignIn
                type="primary"
                htmlType="submit"
                className="login-form-button w-full text-base h-10 font-semibold"
              >
                Đăng nhập
              </ButtonSignIn>
            </Form.Item>

            <Form.Item>
              <SocialLoginContainer>
                <SocialLoginButton
                  type="primary"
                  className="bg-red-500 flex-grow text-base h-10 font-semibold"
                  onClick={handleGoogleSignIn}
                >
                  Google+
                </SocialLoginButton>
              </SocialLoginContainer>
            </Form.Item>

            <Form.Item>
              <p className="text-base text-center font-semibold">
                Tôi chưa có tài khoản ?
                <NavLink
                  to={`/sign-up`}
                  className="ml-2 font-bold text-cyan-700"
                >
                  Đăng ký
                </NavLink>
              </p>
            </Form.Item>
          </SignInForm>
        </SignInContainer>
      </div>
      <OtpModal
        visible={isModalVisible}
        onCancel={handleCancel}
        onOtpSubmit={handleOtpSubmit}
        email={email}
      />
    </div>
  );
}

export default SignInPage;
