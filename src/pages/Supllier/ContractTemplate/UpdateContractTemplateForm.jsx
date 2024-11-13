import { Button, Form, Input, Modal } from "antd";
import React, { useEffect, useState } from "react";
import {
  getContractTemplateById,
  updateContractTemplateById,
} from "../../../api/contractTemplateApi";

const UpdateContractTemplateForm = ({
  visible,
  onClose,
  contractTemplateId,
  onUpdateSuccess,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTemplateData = async () => {
      if (contractTemplateId) {
        try {
          const data = await getContractTemplateById(contractTemplateId);
          form.setFieldsValue(data.result);
        } catch (error) {
          console.error("Error fetching contract template data:", error);
        }
      }
    };

    fetchTemplateData();
  }, [contractTemplateId, form]);

  const handleUpdate = async (values) => {
    setLoading(true);
    try {
      await updateContractTemplateById(contractTemplateId, values);
      onUpdateSuccess();
      onClose();
    } catch (error) {
      console.error("Error updating contract template:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      title="Update Contract Template"
      onCancel={onClose}
      footer={null}
    >
      <Form form={form} onFinish={handleUpdate} layout="vertical">
        <Form.Item
          name="templateName"
          label="Template Name"
          rules={[
            { required: true, message: "Please input the template name!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="contractTerms"
          label="Contract Terms"
          rules={[
            { required: true, message: "Please input the contract terms!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="templateDetails"
          label="Template Details"
          rules={[
            { required: true, message: "Please input the template details!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="penaltyPolicy"
          label="Penalty Policy"
          rules={[
            { required: true, message: "Please input the penalty policy!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="accountID"
          label="Account ID"
          rules={[{ required: true, message: "Please input the account ID!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="productID"
          label="Product ID"
          rules={[{ required: true, message: "Please input the product ID!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Update
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateContractTemplateForm;
