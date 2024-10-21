import { UploadOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  Input,
  Upload,
  message,
} from "antd";
import React, { useState } from "react";
import { createStaff } from "../../../api/accountApi";

const CreateStaffForm = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  const handleFileChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const handleSubmit = async (values) => {
    const formData = new FormData();
    formData.append("FirstName", values.FirstName);
    formData.append("LastName", values.LastName);
    formData.append("Email", values.Email);
    formData.append("PhoneNumber", values.PhoneNumber);
    formData.append("JobTitle", values.JobTitle);
    formData.append("Department", values.Department);
    formData.append("StaffStatus", values.StaffStatus);
    formData.append("HireDate", values.HireDate.format()); // Format as ISO string
    formData.append("IsAdmin", values.IsAdmin);

    if (fileList.length > 0) {
      formData.append("Img", fileList[0].originFileObj);
    }

    const result = await createStaff(formData);
    if (result) {
      message.success("Staff created successfully!");
      form.resetFields();
      setFileList([]); // Clear file input
    } else {
      message.error("Failed to create staff");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-4">Create Staff</h2>
      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        initialValues={{
          IsAdmin: false,
        }}
      >
        <Form.Item
          label="First Name"
          name="FirstName"
          rules={[{ required: true, message: "Please input your first name!" }]}
        >
          <Input placeholder="Enter First Name" />
        </Form.Item>

        <Form.Item
          label="Last Name"
          name="LastName"
          rules={[{ required: true, message: "Please input your last name!" }]}
        >
          <Input placeholder="Enter Last Name" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="Email"
          rules={[
            {
              required: true,
              type: "email",
              message: "Please input a valid email!",
            },
          ]}
        >
          <Input placeholder="Enter Email" />
        </Form.Item>

        <Form.Item
          label="Phone Number"
          name="PhoneNumber"
          rules={[
            { required: true, message: "Please input your phone number!" },
          ]}
        >
          <Input placeholder="Enter Phone Number" />
        </Form.Item>

        <Form.Item
          label="Job Title"
          name="JobTitle"
          rules={[{ required: true, message: "Please input your job title!" }]}
        >
          <Input placeholder="Enter Job Title" />
        </Form.Item>

        <Form.Item
          label="Department"
          name="Department"
          rules={[{ required: true, message: "Please input your department!" }]}
        >
          <Input placeholder="Enter Department" />
        </Form.Item>

        <Form.Item
          label="Staff Status"
          name="StaffStatus"
          rules={[{ required: true, message: "Please input staff status!" }]}
        >
          <Input placeholder="Enter Staff Status" />
        </Form.Item>

        <Form.Item
          label="Hire Date"
          name="HireDate"
          rules={[{ required: true, message: "Please select hire date!" }]}
        >
          <DatePicker showTime placeholder="Select Hire Date" />
        </Form.Item>

        <Form.Item name="IsAdmin" valuePropName="checked">
          <Checkbox>Is Admin</Checkbox>
        </Form.Item>

        <Form.Item
          label="Upload Image"
          valuePropName="fileList"
          getValueFromEvent={handleFileChange}
        >
          <Upload
            beforeUpload={() => false} // Prevent automatic upload
            onChange={handleFileChange}
            fileList={fileList}
          >
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full">
            Create Staff
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateStaffForm;
