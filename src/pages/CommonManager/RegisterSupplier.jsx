import { Button, Form, Input, message } from "antd";
import React, { useState } from "react";
import { registerSupplier } from "../../api/accountApi";

const RegisterSupplier = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    const {
      email,
      password,
      firstName,
      lastName,
      supplierName,
      supplierDescription,
      supplierAddress,
      contactNumber,
      phoneNumber,
    } = values;

    try {
      const response = await registerSupplier(
        email,
        password,
        firstName,
        lastName,
        supplierName,
        supplierDescription,
        supplierAddress,
        contactNumber,
        phoneNumber
      );

      if (response) {
        message.success(
          "Supplier registered successfully! Vui lòng quay về trang Đăng nhập"
        );
      } else {
        message.error("Failed to register supplier.");
      }
    } catch (error) {
      message.error("An error occurred while registering the supplier.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "50px" }}>
      <h1>Register Supplier</h1>
      <Form
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          email: "",
          password: "",
          firstName: "",
          lastName: "",
          supplierName: "",
          supplierDescription: "",
          supplierAddress: "",
          contactNumber: "",
          phoneNumber: "",
        }}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="First Name"
          name="firstName"
          rules={[{ required: true, message: "Please input your first name!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Last Name"
          name="lastName"
          rules={[{ required: true, message: "Please input your last name!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Supplier Name"
          name="supplierName"
          rules={[
            { required: true, message: "Please input the supplier name!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Supplier Description"
          name="supplierDescription"
          rules={[
            {
              required: true,
              message: "Please input the supplier description!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Supplier Address"
          name="supplierAddress"
          rules={[
            { required: true, message: "Please input the supplier address!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Contact Number"
          name="contactNumber"
          rules={[
            { required: true, message: "Please input the contact number!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Phone Number"
          name="phoneNumber"
          rules={[
            { required: true, message: "Please input the phone number!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Register Supplier
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default RegisterSupplier;
