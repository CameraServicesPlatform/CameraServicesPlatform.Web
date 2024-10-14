import { Button, Form, Input, Modal, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { getAccountById, updateAccount } from "../../../api/accountApi"; // Ensure these API functions are implemented

const GetInformationAccount = ({ accountId, visible, onCancel }) => {
  const [accountData, setAccountData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchAccountData = async () => {
      if (accountId) {
        setLoading(true);
        const data = await getAccountById(accountId);
        if (data.isSuccess) {
          setAccountData(data.result);
          form.setFieldsValue(data.result); // Set form fields with the account data
        } else {
          // Handle error
        }
        setLoading(false);
      }
    };
    fetchAccountData();
  }, [accountId, form]);

  const handleFormSubmit = async (values) => {
    setLoading(true);
    const response = await updateAccount(accountId, values); // Assume you have this API function
    if (response.isSuccess) {
      // Notify user of success, perhaps refresh the account list
      onCancel(); // Close the modal after successful submission
    } else {
      // Handle error
    }
    setLoading(false);
  };

  return (
    <Modal
      title="Account Information"
      visible={visible}
      onCancel={onCancel}
      footer={null}
    >
      {loading ? (
        <Spin />
      ) : (
        <Form form={form} onFinish={handleFormSubmit} layout="vertical">
          <Form.Item
            name="firstName"
            label="First Name"
            rules={[
              { required: true, message: "Please input the first name!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="lastName"
            label="Last Name"
            rules={[{ required: true, message: "Please input the last name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ type: "email", message: "Please input a valid email!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phoneNumber"
            label="Phone Number"
            rules={[
              { required: true, message: "Please input the phone number!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};

export default GetInformationAccount;
