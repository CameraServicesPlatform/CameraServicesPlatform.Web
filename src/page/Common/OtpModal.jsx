import React, { useState, useRef, useEffect } from "react";
import { Modal, Input, Button } from "antd";
import { sendOTP } from "../../api/AccountApi";
import { toast } from "react-toastify";

const OtpModal = ({ visible, onCancel, onOtpSubmit, email }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpInputs = useRef([]);
  const [countdown, setCountdown] = useState(null);
  const countdownInterval = useRef(null);

  useEffect(() => {
    return () => {
      if (countdownInterval.current) {
        clearInterval(countdownInterval.current);
      }
    };
  }, []);
  const handleOtpChange = (e, index) => {
    const newOtp = [...otp];
    newOtp[index] = e.target.value;
    setOtp(newOtp);

    if (index < 5 && e.target.value !== "") {
      otpInputs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && index > 0 && !otp[index]) {
      e.preventDefault();
      otpInputs.current[index - 1].focus();
    }
  };

  const handleOtpSubmit = () => {
    onOtpSubmit(otp.join(""));
    setOtp(["", "", "", "", "", ""]);
  };

  const handleResendOtp = async () => {
    if (countdown !== null) {
      return;
    }

    const result = await sendOTP(email);
    if (result.isSuccess) {
      toast.success("Resend OTP successfully");
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
    }
  };

  return (
    <Modal
      title="Enter OTP"
      visible={visible}
      onCancel={onCancel}
      footer={null}
      centered
    >
      <div className="flex justify-center">
        {otp.map((digit, index) => (
          <Input
            key={index}
            className="w-12 h-12 mx-2 text-center rounded-full border border-gray-300"
            value={digit}
            onChange={(e) => handleOtpChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            maxLength={1}
            ref={(input) => (otpInputs.current[index] = input)}
          />
        ))}
      </div>
      <div className="mt-4 flex justify-between items-center">
        <Button onClick={handleResendOtp} type="link">
          Resend OTP {countdown !== null && `(${countdown}s)`}
        </Button>
        <div>
          <Button onClick={onCancel} style={{ marginRight: "10px" }}>
            Cancel
          </Button>
          <Button type="primary" onClick={handleOtpSubmit}>
            Submit
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default OtpModal;
