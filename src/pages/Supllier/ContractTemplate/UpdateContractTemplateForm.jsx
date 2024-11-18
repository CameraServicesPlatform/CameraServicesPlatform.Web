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
      title="Cập nhật mẫu hợp đồng"
      onCancel={onClose}
      footer={null}
    >
      <Form form={form} onFinish={handleUpdate} layout="vertical">
        <Form.Item
          name="templateName"
          label="Tên mẫu hợp đồng"
          rules={[
            { required: true, message: "Vui lòng nhập tên mẫu hợp đồng!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="contractTerms"
          label="Điều khoản hợp đồng"
          rules={[
            { required: true, message: "Vui lòng nhập điều khoản hợp đồng!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="templateDetails"
          label="Chi tiết mẫu hợp đồng"
          rules={[
            { required: true, message: "Vui lòng nhập chi tiết mẫu hợp đồng!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="penaltyPolicy"
          label="Chính sách phạt"
          rules={[
            { required: true, message: "Vui lòng nhập chính sách phạt!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="accountID"
          label="ID tài khoản"
          rules={[{ required: true, message: "Vui lòng nhập ID tài khoản!" }]}
        >
          <Input disabled />
        </Form.Item>
        <Form.Item
          name="productID"
          label="ID sản phẩm"
          rules={[{ required: true, message: "Vui lòng nhập ID sản phẩm!" }]}
        >
          <Input disabled />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Cập nhật
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateContractTemplateForm;
