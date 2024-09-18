import React, { useEffect, useRef, useState } from "react";
import { Modal, Input, Button, Form } from "antd";
import { sendResetPassOTP } from "../../api/AccountApi";
import { toast } from "react-toastify";

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
      toast.success("OTP has just been sent to your email");
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
          ? "Step 1: Enter Email"
          : step === 2
            ? "Step 2: Enter Verification Code"
            : "Step 3: Enter new password"
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
                message: "Please input your email!",
              },
              {
                type: "email",
                message: "The input is not a valid email!",
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
            Next
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
                message: "Please input the verification code!",
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
            Next
          </Button>
          <span
            style={{ position: "absolute", bottom: "2.2rem", right: "1rem" }}
            onClick={handleEmailSubmit}
          >
            <Button type="link">
              {" "}
              Resend OTP Code {countdown !== null && `(${countdown}s)`}
            </Button>
          </span>
        </Form>
      )}
      {step === 3 && (
        <Form onFinish={handleVerificationSubmit}>
          <Form.Item
            label="New Password"
            name="newPassword"
            rules={[
              {
                required: true,
                message: "Please input your new password!",
              },
              {
                min: 8,
                message: "Password must be at least 8 characters!",
              },
              {
                pattern: /[A-Z]/,
                message: "Password must contain at least one uppercase letter!",
              },
              {
                pattern: /[!@#$%^&*(),.?":{}|<>]/,
                message:
                  'Password must contain at least one special character (!@#$%^&*(),.?":{}|<>)!',
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
            Submit
          </Button>
        </Form>
      )}
    </Modal>
  );
};

export default ForgotPasswordModal;
