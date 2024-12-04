import React from "react";
import { Modal, Form, Input, Button } from "antd";

const ContractModal = ({
  isContractModalVisible,
  setIsContractModalVisible,
  handleCreateContractTemplate,
}) => {
  return (
    <Modal
      title="Tạo Mẫu Hợp Đồng"
      visible={isContractModalVisible}
      onCancel={() => setIsContractModalVisible(false)}
      footer={null}
    >
      <Form onFinish={handleCreateContractTemplate}>
        <Form.Item
          name="templateName"
          label="Tên Mẫu"
          rules={[{ required: true, message: "Vui lòng nhập tên mẫu!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="contractTerms"
          label="Điều Khoản Hợp Đồng"
          rules={[
            { required: true, message: "Vui lòng nhập điều khoản hợp đồng!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="templateDetails"
          label="Chi Tiết Mẫu"
          rules={[{ required: true, message: "Vui lòng nhập chi tiết mẫu!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="penaltyPolicy"
          label="Chính Sách Phạt"
          rules={[
            { required: true, message: "Vui lòng nhập chính sách phạt!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Tạo Mẫu
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ContractModal;