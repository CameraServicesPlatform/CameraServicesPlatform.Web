import { Button, Form, Input, Modal } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { sendResetPassOTP } from "../../../api/accountApi";

const ForgotPasswordModal = ({ visible, onCancel, onSubmit }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [recoveryCode, setRecoveryCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const countdownInterval = useRef(null);

  useEffect(() => {
    return () => {
      if (countdownInterval.current) {
        clearInterval(countdownInterval.current);
      }
    };
  }, []);
  const handleEmailSubmit = async () => {
    setIsLoading(true);
    const result = await sendResetPassOTP(email);
    if (result.isSuccess) {
      toast.success("Mã OTP sẽ được gửi đến email của bạn");
      setIsLoading(false);
      setStep(2);
      setCountdown(30); // start countdown from 30 seconds
      countdownInterval.current = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown <= 1) {
            clearInterval(countdownInterval.current);
            return null;
          }
          return prevCountdown - 1;
        });
      }, 1000);
    } else {
      for (var i = 0; i < result.messages.length; i++) {
        toast.error(result.messages[i]);
        setIsLoading(false);
      }
    }
  };
  const handleCodeSubmit = () => {
    setStep(3);
  };
  const handleVerificationSubmit = () => {
    setIsLoading(true);
    onSubmit({ email, recoveryCode, newPassword });
    setIsLoading(false);
    setEmail("");
    setRecoveryCode("");
    setNewPassword("");

    setStep(1); // Reset to step 1 after submission
  };

  return (
    <Modal
      title={
        step === 1
          ? "Bước 1: Nhập Email"
          : step === 2
          ? "Bước 2: Nhập Verification Code"
          : "Bước 3: Nhập password mới"
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
      centered
    >
      {step === 1 && (
        <Form onFinish={handleEmailSubmit}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Nhập email của bạn!",
              },
              {
                type: "email",
                message: "Email không hợp lệ!",
              },
            ]}
          >
            <Input value={email} onChange={(e) => setEmail(e.target.value)} />
          </Form.Item>
          <Button
            loading={isLoading}
            type="primary"
            htmlType="submit"
            className=" inline-block  px-4  text-xs text-center font-semibold leading-6 text-white bg-baseGreen hover:bg-green-600 rounded-lg transition duration-200"
          >
            Tiếp
          </Button>
        </Form>
      )}

      {step === 2 && (
        <Form onFinish={handleCodeSubmit}>
          <Form.Item
            label="Verification Code"
            name="verificationCode"
            rules={[
              {
                required: true,
                message: "Nhập verification code!",
              },
            ]}
          >
            <Input
              value={recoveryCode}
              onChange={(e) => setRecoveryCode(e.target.value)}
            />
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className=" inline-block  px-4  text-xs text-center font-semibold leading-6 text-white bg-baseGreen hover:bg-green-600 rounded-lg transition duration-200"
          >
            Tiếp
          </Button>
          <span
            style={{ position: "absolute", bottom: "2.2rem", right: "1rem" }}
            onClick={handleEmailSubmit}
          >
            <Button type="link">
              Gửi lại mã OTP {countdown !== null && `(${countdown}s)`}
            </Button>
          </span>
        </Form>
      )}
      {step === 3 && (
        <Form onFinish={handleVerificationSubmit}>
          <Form.Item
            label="Password mới"
            name="newPassword"
            rules={[
              {
                required: true,
                message: "Nhập password mới!",
              },
              {
                min: 6,
                message: "Password phải có ít nhất 6 ký tự!",
              },
              {
                pattern: /[A-Z]/,
                message: "Password phải chứa ít nhất 1 chữ cái viết hoa!",
              },
              {
                pattern: /[!@#$%^&*(),.?":{}|<>]/,
                message:
                  'Password phải có ít nhất 1 ký tự đặc biệt (!@#$%^&*(),.?":{}|<>)!',
              },
            ]}
          >
            <Input
              type="password"
              value={recoveryCode}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </Form.Item>
          <Button
            loading={isLoading}
            type="primary"
            htmlType="submit"
            className=" inline-block  px-4  text-xs text-center font-semibold leading-6 text-white bg-baseGreen hover:bg-green-600 rounded-lg transition duration-200"
          >
            Gửi
          </Button>
        </Form>
      )}
    </Modal>
  );
};

export default ForgotPasswordModal;
