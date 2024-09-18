import React, { useState, useEffect } from "react";
import { Modal, Select, Button, message } from "antd";
import axios from "axios";
import { assignUserIntoOrganization } from "../../api/accountApi";
import { getAllOrganizations } from "../../api/organizationApi";

const { Option } = Select;

const AssignUserModal = ({ visible, onCancel, userId }) => {
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch organizations when the modal becomes visible
    if (visible) {
      fetchOrganizations();
    }
  }, [visible]);

  const fetchOrganizations = async () => {
    try {
      const response = await getAllOrganizations(1, 1000);
      if (response.isSuccess) {
        setOrganizations(response.result?.items);
      }
    } catch (error) {
      message.error("Failed to fetch organizations");
    }
  };

  const handleOrgChange = (value) => {
    setSelectedOrg(value);
  };

  const handleAssign = async () => {
    if (!selectedOrg) {
      message.warning("Please select an organization");
      return;
    }

    setLoading(true);
    try {
      const data = await assignUserIntoOrganization(userId, selectedOrg);
      if (data.isSuccess) {
        message.success("User assigned successfully");
      } else {
        message.error("Failed to assign user");
      }
      onCancel();
    } catch (error) {
      console.error("Error assigning user:", error);
      message.error("Failed to assign user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Assign User to Organization"
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          key="assign"
          type="primary"
          loading={loading}
          onClick={handleAssign}
        >
          Assign
        </Button>,
      ]}
    >
      <Select
        style={{ width: "100%" }}
        placeholder="Select an organization"
        onChange={handleOrgChange}
        value={selectedOrg}
      >
        {organizations?.map((org) => (
          <Option key={org.id} value={org.id}>
            {org.name}
          </Option>
        ))}
      </Select>
    </Modal>
  );
};

export default AssignUserModal;
