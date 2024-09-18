import { Button, Form, Input, message, Select } from "antd";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { MainLogo } from "../../components";

import LoadingOverlay from "../../components/Loading/LoadingOverlay";
import OtpModal from "../OtpModal";

const RegistrationContainer = styled.div`
  width: 600px;
  border-radius: 0.75rem;
  padding: 50px 100px 50px 100px;
  background-color: rgb(241 245 249 / 64%);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const RegistrationForm = styled(Form)`
  .ant-form-item {
    margin-bottom: 40px;
  }
`;

const RegistrationButton = styled(Button)`
  background-color: rgb(13 148 136);
`;

function RegistrationPage() {
  const [form] = Form.useForm();
  const [isPhoneValidated, setIsPhoneValidated] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState("");
  const [isOtpCorrect, setIsOtpCorrect] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [email, setEmail] = useState("");
  const handleOtpSubmit = async (otp) => {
    console.log("Submitted OTP:", otp);
    const result = await activeAccount(email, otp);
    if (result.isSuccess) {
      message.success("Verify successfully");
      setIsModalVisible(false);
    }
  };
  const validatePhoneNumber = async () => {
    // Add your phone number validation logic here
    // If the phone number is valid, set isPhoneValidated to true
    setIsLoading(true);
    const phoneNumber = form.getFieldValue("phoneNumber");
    // debugger;
    if (
      phoneNumber === undefined ||
      phoneNumber == null ||
      phoneNumber.length < 9 ||
      phoneNumber.length > 10
    ) {
      message.error("Số điện thoại không hợp lệ");
      setIsLoading(false);
      return;
    }
    const data = await generateOTP(phoneNumber);
    // debugger;
    if (!data.isSuccess) {
      data.messages.forEach((mess) => {
        message.error(mess);
      });
    } else {
      message.success("OTP đã được gửi đến số điện thoại của bạn");
      setOtpSent(data.result);
    }

    setIsPhoneValidated(true);
    setIsButtonDisabled(true);
    setRemainingTime(30);
    setIsLoading(false);
  };
  const validateOtp = () => {
    // Add your OTP validation logic here
    // If the OTP is correct, set isOtpCorrect to true
    if (otp === otpSent) {
      message.success("OTP chính xác");
      setIsOtpCorrect(true);
    } else {
      message.error("OTP không chính xác, vui lòng thử lại");
    }
  };
  useEffect(() => {
    let intervalId;
    if (isButtonDisabled && remainingTime > 0) {
      intervalId = setInterval(() => {
        setRemainingTime(remainingTime - 1);
      }, 1000);
    } else if (!remainingTime) {
      setIsButtonDisabled(false);
    }
    return () => clearInterval(intervalId); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  }, [isButtonDisabled, remainingTime]);
  const onFinish = async (values) => {
    setIsLoading(true);
    console.log("Received values of form: ", values);
    const value = {
      email: values.email,
      firstName: values.firstName,
      gender: values.gender,
      lastName: values.lastName,
      password: values.password,
      phoneNumber: values.phoneNumber,
    };
    const data = await createAccount(value);
    if (!data.isSuccess) {
      data.messages.forEach((mess) => {
        message.error(mess);
      });
      setIsLoading(false);
    } else {
      setEmail(values.email);
      setIsModalVisible(true);
      message.success(
        "Đăng kí thành công, hay kiểm tra email để xác thực tài khoản!"
      );
    }
    setIsLoading(false);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const showOtpModal = () => {
    setIsModalVisible(true);
  };

  return (
    <div className="flex h-full bg-[url('https://media1.thrillophilia.com/filestore/e0sv7qhxf4fg3gd33dfe1liycj4h_shutterstock_2178792551.jpg?dpr=1.75&w=1463')] bg-cover bg-center">
      <LoadingOverlay isLoading={isLoading} />
      <div className="flex flex-col justify-center items-center w-1/2">
        <RegistrationContainer>
          <h1 className="scale-150 w-20 ml-5 mb-10">
            <MainLogo />
          </h1>
          <h2 className="font-semibold text-5xl mb-3">Đăng ký</h2>
          <p className="font-medium text-2xl text-slate-500">
            Vui lòng nhập thông tin để đăng kí tài khoản
          </p>

          <RegistrationForm className="mt-10" form={form} onFinish={onFinish}>
            <Form.Item
              name="email"
              rules={[
                {
                  type: "email",
                  message: "The input is not valid E-mail!",
                },
                {
                  required: true,
                  message: "Please input your E-mail!",
                },
              ]}
            >
              <Input className="h-10" placeholder="Email" />
            </Form.Item>
            <Form.Item
              name="phoneNumber"
              rules={[
                {
                  required: true,
                  message: "Please input your phone number!",
                },
              ]}
            >
              <Input
                className="h-10"
                addonBefore="+84"
                style={{ width: "100%" }}
                placeholder="Phone Number"
              />
            </Form.Item>
            {!isOtpCorrect && (
              <>
                <Button
                  className="bg-primary text-white my-4"
                  onClick={validatePhoneNumber}
                  disabled={isButtonDisabled}
                >
                  Xác thực số điện thoại{" "}
                  {isButtonDisabled ? `(${remainingTime}s)` : ""}
                </Button>
                {isPhoneValidated && (
                  <Input
                    className="h-10"
                    placeholder="OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                )}
                {isPhoneValidated && (
                  <Button
                    className="bg-primary text-white my-4"
                    onClick={validateOtp}
                  >
                    Xác thực OTP
                  </Button>
                )}
              </>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2">
              <Form.Item
                name="firstName"
                rules={[
                  {
                    required: true,
                    message: "Please input your first name!",
                  },
                ]}
              >
                <Input
                  className="h-10"
                  placeholder="Tên của bạn"
                  disabled={!isOtpCorrect}
                />
              </Form.Item>

              <Form.Item
                name="lastName"
                rules={[
                  {
                    required: true,
                    message: "Please input your last name!",
                  },
                ]}
                className="md:mx-2"
              >
                <Input
                  className="h-10"
                  placeholder="Họ của bạn"
                  disabled={!isOtpCorrect}
                />
              </Form.Item>
            </div>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
            >
              <Input.Password
                className="h-10"
                placeholder="Mật khẩu"
                disabled={!isOtpCorrect}
              />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              dependencies={["password"]}
              rules={[
                {
                  required: true,
                  message: "Please input your confirm password!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        "The two passwords that you entered do not match!"
                      )
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                className="h-10"
                placeholder="Nhập lại mật khẩu"
                disabled={!isOtpCorrect}
              />
            </Form.Item>
            <Form.Item name="gender" required>
              <Select placeholder="Chọn giới tính" disabled={!isOtpCorrect}>
                <Select.Option value={true}>Nam</Select.Option>
                <Select.Option value={false}>Nữ</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item>
              <RegistrationButton
                type="primary"
                htmlType="submit"
                className="login-form-button w-full text-base h-10 font-semibold"
              >
                Đăng ký
              </RegistrationButton>
            </Form.Item>

            <Form.Item>
              <p className="text-base text-center font-semibold">
                Tôi đã có tài khoản ?
                <Link to="/sign-in" className="ml-2 font-bold text-cyan-700">
                  Đăng nhập
                </Link>
              </p>
            </Form.Item>
          </RegistrationForm>
        </RegistrationContainer>
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

export default RegistrationPage;
