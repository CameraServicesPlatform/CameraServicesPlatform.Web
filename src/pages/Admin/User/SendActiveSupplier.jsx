import { Button, Form, Input, message, Typography } from "antd";
import React, { useState } from "react";
import { sendOTP } from "../../../api/accountApi";

const { Title } = Typography;

const SendActivationCode = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendActivation = async () => {
    if (!email) {
      message.error("Please enter the supplier's email");
      return;
    }

    setLoading(true); // Set loading state
    console.log("Sending email to:", email);

    const result = await sendOTP(email);
    if (result) {
      message.success("Activation code sent successfully!");
    } else {
      message.error("Failed to send activation code");
    }

    setLoading(false); // Reset loading state after API call
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "20px" }}>
      <Title level={3} style={{ textAlign: "center" }}>
        Send Activation Code
      </Title>
      <Form layout="vertical">
        <Form.Item label="Supplier's Email">
          <Input
            type="email"
            placeholder="Enter supplier's email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading} // Disable input while loading
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            block
            onClick={handleSendActivation}
            loading={loading} // Show loading spinner on the button
          >
            Send Activation Code
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SendActivationCode;
