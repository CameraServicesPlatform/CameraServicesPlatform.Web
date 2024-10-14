import { Button, Divider, message, Modal, Table } from "antd";
import React, { useEffect, useState } from "react";
import { deletePolicyById, getAllPolicies } from "../../../api/policyApi";
import CreatePolicy from "./CreatePolicy";

const ManagePolicy = () => {
  const [policies, setPolicies] = useState([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(10);
  const [isCreating, setIsCreating] = useState(false); // State to control visibility of CreatePolicy modal

  const fetchPolicies = async () => {
    const response = await getAllPolicies(pageIndex, pageSize);
    if (response) {
      setPolicies(response.result.items);
    } else {
      message.error("Error fetching policies.");
    }
  };

  const handleDelete = async (policyID) => {
    const response = await deletePolicyById(policyID);
    if (response) {
      message.success("Policy deleted successfully!");
      fetchPolicies();
    } else {
      message.error("Error deleting policy.");
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, [pageIndex]);

  const handleCreatePolicy = async () => {
    setIsCreating(true); // Open the modal
  };

  const handleModalClose = () => {
    setIsCreating(false); // Close the modal
  };

  const columns = [
    {
      title: "Policy ID",
      dataIndex: "policyID",
      key: "policyID",
    },
    {
      title: "Policy Content",
      dataIndex: "policyContent",
      key: "policyContent",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button type="link" onClick={() => handleDelete(record.policyID)}>
          Delete
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h2>Manage Policies</h2>
      <Button
        type="primary"
        onClick={handleCreatePolicy}
        style={{ marginBottom: "20px" }}
      >
        Create Policy
      </Button>
      <Divider />
      <Table
        dataSource={policies}
        columns={columns}
        rowKey="policyID"
        pagination={{
          current: pageIndex,
          pageSize,
          onChange: (page) => setPageIndex(page),
        }}
      />

      <Modal
        title="Create Policy"
        visible={isCreating}
        onCancel={handleModalClose}
        footer={null} // We will handle the footer in the CreatePolicy component
      >
        <CreatePolicy
          onClose={handleModalClose}
          fetchPolicies={fetchPolicies}
        />
      </Modal>
    </div>
  );
};

export default ManagePolicy;
