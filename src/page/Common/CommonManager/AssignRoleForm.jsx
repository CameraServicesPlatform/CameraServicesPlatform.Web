import { Button, Form, message, Modal, Select, Spin } from "antd";
import React, { useState } from "react";
import { assignRoleToUser } from "../../api/accountApi"; // Ensure the import path is correct

const { Option } = Select;

const AssignRoleForm = ({
  visible,
  onClose,
  userId,
  fetchData,
  currentPage,
}) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  const roles = [
    { value: "customer" || "CUSTOMER", displayName: "Khách hàng" },
    { value: "admin" || "ADMIN", displayName: "Quản trị viên" },
    { value: "organizer" || "ORGANIZER", displayName: "Nhà tổ chức" },
    { value: "sponsor" || "SPONSOR", displayName: "Nhà tài trợ" },
    { value: "pm" || "PM", displayName: "Quản lý dự án" },
  ];

  const onFinish = async (values) => {
    setIsLoading(true);
    try {
      const data = await assignRoleToUser(userId, values.roleName);
      if (data.isSuccess) {
        message.success("Cập nhật vai trò thành công");
        fetchData(currentPage); // Refresh data if needed
      } else {
        message.error("Failed to assign role.");
      }
      onClose(); // Close modal after success
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title="Chọn vai trò"
      visible={visible}
      onCancel={onClose}
      footer={null}
    >
      {isLoading ? (
        <Spin size="large" />
      ) : (
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ roleName: "" }}
        >
          <Form.Item
            name="roleName"
            label="Role"
            rules={[{ required: true, message: "Please select a role!" }]}
          >
            <Select placeholder="Select a role">
              {roles.map((role) => (
                <Option key={role.value} value={role.value}>
                  {role.displayName}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Assign Role
            </Button>
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};

export default AssignRoleForm;
