import { Button, message, Modal, Select } from "antd";
import React, { useEffect, useState } from "react";
const { Option } = Select;

const AssignUserModal = ({ visible, onCancel, userId }) => {
  const [suppliers, setsuppliers] = useState([]);
  const [selectedSup, setSelectedSup] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      fetchSuppliers();
    }
  }, [visible]);

  const fetchSuppliers = async () => {
    try {
      const response = await getAllSuppliers(1, 1000);
      if (response.isSuccess) {
        setSuppliers(response.result?.items);
      }
    } catch (error) {
      message.error("Failed to fetch suppliers");
    }
  };

  const handleSupChange = (value) => {
    setSelectedSup(value);
  };

  const handleAssign = async () => {
    if (!selectedSup) {
      message.warning("Please select an suppliers");
      return;
    }

    setLoading(true);
    try {
      const data = await assignUserIntoSupplier(userId, selectedSup);
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
      title="Assign User to Supplier"
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
        placeholder="Select an Supplier"
        onChange={handleSupChange}
        value={selectedSup}
      >
        {suppliers?.map((sup) => (
          <Option key={sup.id} value={sup.id}>
            {sup.name}
          </Option>
        ))}
      </Select>
    </Modal>
  );
};

export default AssignUserModal;
