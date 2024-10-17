import { PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, message, Modal, Upload } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { registerSupplier } from "../../api/accountApi";

const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const RegisterSupplier = () => {
  const [loading, setLoading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileListFront, setFileListFront] = useState([]);
  const [fileListBack, setFileListBack] = useState([]);
  const navigate = useNavigate(); // Initialize navigate

  const handleCancel = () => setPreviewVisible(false);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  const handleChange =
    (fileType) =>
    ({ fileList }) => {
      if (fileType === "front") {
        setFileListFront(fileList);
      } else {
        setFileListBack(fileList);
      }
    };

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
      bankName,
      accountNumber,
      accountHolder,
    } = values;

    // Access the files from fileList
    const frontFile =
      fileListFront.length > 0 ? fileListFront[0].originFileObj : null;
    const backFile =
      fileListBack.length > 0 ? fileListBack[0].originFileObj : null;

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
        phoneNumber,
        frontFile,
        backFile,
        bankName,
        accountNumber,
        accountHolder
      );

      if (response) {
        message.success(
          "Supplier registered successfully! Vui lòng quay về trang Đăng nhập"
        );
        navigate("/"); // Redirect to home page after success
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
          bankName: "",
          accountNumber: "",
          accountHolder: "",
        }}
      >
        {/* Existing fields */}
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

        {/* New fields */}
        <Form.Item
          label="Bank Name"
          name="bankName"
          rules={[{ required: true, message: "Please input the bank name!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Account Number"
          name="accountNumber"
          rules={[
            { required: true, message: "Please input the account number!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Account Holder"
          name="accountHolder"
          rules={[
            {
              required: true,
              message: "Please input the account holder name!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        {/* File Uploads */}
        <Form.Item label="Front of Citizen Identification Card">
          <Upload
            accept=".jpg,.jpeg,.png"
            listType="picture-card"
            fileList={fileListFront}
            onPreview={handlePreview}
            onChange={handleChange("front")}
            beforeUpload={() => false} // Disable automatic upload
          >
            {fileListFront.length >= 1 ? null : <PlusOutlined />}
          </Upload>
        </Form.Item>

        <Form.Item label="Back of Citizen Identification Card">
          <Upload
            accept=".jpg,.jpeg,.png"
            listType="picture-card"
            fileList={fileListBack}
            onPreview={handlePreview}
            onChange={handleChange("back")}
            beforeUpload={() => false} // Disable automatic upload
          >
            {fileListBack.length >= 1 ? null : <PlusOutlined />}
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Register Supplier
          </Button>
        </Form.Item>
      </Form>

      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img alt="example" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </div>
  );
};

export default RegisterSupplier;
