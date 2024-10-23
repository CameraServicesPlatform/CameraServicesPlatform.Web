import { Button, DatePicker, Form, Input, message, Select } from "antd";
import React from "react";
import { createPolicy } from "../../../api/policyApi";

const { Option } = Select;

const CreatePolicy = ({ onClose, fetchPolicies }) => {
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    const response = await createPolicy(values);
    if (response) {
      message.success("Policy created successfully!");
      form.resetFields();
      fetchPolicies(); // Fetch updated policies
      onClose(); // Close the modal after creating
    } else {
      message.error("Error creating policy.");
    }
  };

  return (
    <Form form={form} onFinish={handleSubmit} layout="vertical">
      <Form.Item
        name="policyType"
        label="Policy Type"
        rules={[{ required: true, message: "Please select a policy type!" }]}
      >
        <Select placeholder="Select a policy type">
          <Option value={1}>System</Option>
          <Option value={2}>Supplier</Option>
        </Select>
      </Form.Item>
      <Form.Item
        name="policyContent"
        label="Policy Content"
        rules={[{ required: true, message: "Please input policy content!" }]}
      >
        <Input.TextArea />
      </Form.Item>
      <Form.Item
        name="applicableObject"
        label="Applicable Object"
        rules={[{ required: true, message: "Please input applicable object!" }]}
      >
        <Select placeholder="Select a Applicable Object">
          <Option value={0}>System</Option>
          <Option value={1}>Member</Option>
          <Option value={2}>Supplier</Option>
        </Select>
      </Form.Item>
      <Form.Item
        name="effectiveDate"
        label="Effective Date"
        rules={[{ required: true, message: "Please select effective date!" }]}
      >
        <DatePicker showTime />
      </Form.Item>
      <Form.Item
        name="value"
        label="Value"
        rules={[{ required: true, message: "Please input value!" }]}
      >
        <DatePicker showTime />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Create Policy
        </Button>
        <Button style={{ marginLeft: "10px" }} onClick={onClose}>
          Cancel
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreatePolicy;
