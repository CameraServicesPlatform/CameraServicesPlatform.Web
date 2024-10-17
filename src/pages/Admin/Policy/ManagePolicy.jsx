import {
  Button,
  DatePicker,
  Divider,
  Input,
  message,
  Modal,
  Table,
} from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  deletePolicyById,
  getAllPolicies,
  getPolicyById,
  updatePolicyById,
} from "../../../api/policyApi"; // Ensure correct import path
import CreatePolicy from "./CreatePolicy"; // Ensure you have this component

const ManagePolicy = () => {
  const [policies, setPolicies] = useState([]);
  const [filteredPolicies, setFilteredPolicies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(10);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isViewingDetail, setIsViewingDetail] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);

  // Fetch policies from API
  const fetchPolicies = async () => {
    try {
      const response = await getAllPolicies(pageIndex, pageSize);
      if (response && response.isSuccess) {
        setPolicies(response.result || []);
        setFilteredPolicies(response.result || []); // Initialize filtered policies
      } else {
        message.error("Error fetching policies.");
      }
    } catch (error) {
      message.error("Error fetching policies.");
      console.error(error);
    }
  };

  // Delete a policy by ID
  const handleDeletePolicy = async (policyID) => {
    try {
      await deletePolicyById(policyID);
      message.success("Policy deleted successfully!");
      fetchPolicies(); // Refresh policies after deletion
    } catch (error) {
      message.error("Error deleting policy.");
      console.error(error);
    }
  };

  // Update a policy using the updated function
  const handleUpdatePolicy = async (policyID, updatedPolicyData) => {
    try {
      const response = await updatePolicyById(policyID, updatedPolicyData);
      if (response && response.isSuccess) {
        message.success("Policy updated successfully!");
        fetchPolicies(); // Refresh policies after updating
        setIsUpdating(false); // Close the modal after updating
      } else {
        message.error("Error updating policy.");
      }
    } catch (error) {
      message.error("Error updating policy.");
      console.error(error);
    }
  };

  const handleViewDetail = async (policyID) => {
    if (!policyID) {
      message.error("Invalid policy ID.");
      return;
    }

    try {
      const response = await getPolicyById(policyID);
      if (response && response.isSuccess) {
        setSelectedPolicy(response.result);
        setIsViewingDetail(true);
      } else {
        message.error("Error fetching policy details.");
      }
    } catch (error) {
      message.error("Error fetching policy details.");
      console.error(error);
    }
  };

  // Search for policies
  const handleSearch = (value) => {
    setSearchTerm(value);
    const filtered = policies.filter(
      (policy) =>
        (policy.policyType || "")
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase()) ||
        (policy.policyContent || "")
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase()) ||
        (policy.applicableObject || "")
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase())
    );
    setFilteredPolicies(filtered);
  };

  useEffect(() => {
    fetchPolicies(); // Fetch policies on mount or when pageIndex changes
  }, [pageIndex]);

  const handleCreatePolicy = () => {
    setIsCreating(true);
  };

  const handleModalClose = () => {
    setIsCreating(false);
    setIsUpdating(false);
    setIsViewingDetail(false);
    setSelectedPolicy(null); // Reset selected policy
  };

  const columns = [
    {
      title: "Policy ID",
      dataIndex: "policyID",
      key: "policyID",
    },
    {
      title: "Policy Type",
      dataIndex: "policyType",
      key: "policyType",
    },
    {
      title: "Policy Content",
      dataIndex: "policyContent",
      key: "policyContent",
      render: (text) => (
        <div
          style={{
            maxWidth: "200px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {text}
        </div>
      ),
    },
    {
      title: "Applicable Object",
      dataIndex: "applicableObject",
      key: "applicableObject",
    },
    {
      title: "Effective Date",
      dataIndex: "effectiveDate",
      key: "effectiveDate",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div>
          <Button type="link" onClick={() => handleViewDetail(record.policyID)}>
            View
          </Button>
          <Button
            type="link"
            onClick={() => {
              setIsUpdating(true);
              setSelectedPolicy(record); // Set selected policy for updating
            }}
          >
            Edit
          </Button>
          <Button
            type="link"
            onClick={() => handleDeletePolicy(record.policyID)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h2>Manage Policies</h2>
      <Input
        placeholder="Search Policies"
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        style={{ marginBottom: "20px", width: "300px" }}
      />
      <Button
        type="primary"
        onClick={handleCreatePolicy}
        style={{ marginBottom: "20px" }}
      >
        Create Policy
      </Button>
      <Divider />
      <Table
        dataSource={filteredPolicies} // Use filtered policies for display
        columns={columns}
        rowKey="policyID"
        pagination={{
          current: pageIndex,
          pageSize,
          onChange: (page) => setPageIndex(page),
        }}
      />

      {/* Create Policy Modal */}
      <Modal
        title="Create Policy"
        open={isCreating} // Use 'open' instead of 'visible'
        onCancel={handleModalClose}
        footer={null}
      >
        <CreatePolicy
          onClose={handleModalClose}
          fetchPolicies={fetchPolicies}
        />
      </Modal>
      <Modal
        title="Policy Details"
        open={isViewingDetail} // Check if this is properly controlled
        onCancel={handleModalClose}
        footer={null}
      >
        {selectedPolicy ? (
          <div>
            <p>
              <strong>Policy ID:</strong> {selectedPolicy.policyID}
            </p>
            <p>
              <strong>Policy Type:</strong> {selectedPolicy.policyType}
            </p>
            <p>
              <strong>Policy Content:</strong> {selectedPolicy.policyContent}
            </p>
            <p>
              <strong>Applicable Object:</strong>{" "}
              {selectedPolicy.applicableObject}
            </p>
            <p>
              <strong>Effective Date:</strong>{" "}
              {new Date(selectedPolicy.effectiveDate).toLocaleDateString()}
            </p>
            <p>
              <strong>Value:</strong>{" "}
              {new Date(selectedPolicy.value).toLocaleDateString()}
            </p>
          </div>
        ) : (
          <p>No policy selected</p>
        )}
      </Modal>

      <Modal
        title="Edit Policy"
        open={isUpdating} // Modal should open when this is true
        onCancel={handleModalClose}
        footer={null}
      >
        {selectedPolicy ? (
          <div>
            <p>
              <strong>Policy ID:</strong> {selectedPolicy.policyID}
            </p>

            <div>
              <strong>Policy Type:</strong>
              <Input
                value={selectedPolicy.policyType}
                onChange={(e) =>
                  setSelectedPolicy({
                    ...selectedPolicy,
                    policyType: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <strong>Policy Content:</strong>
              <Input
                value={selectedPolicy.policyContent}
                onChange={(e) =>
                  setSelectedPolicy({
                    ...selectedPolicy,
                    policyContent: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <strong>Applicable Object:</strong>
              <Input
                value={selectedPolicy.applicableObject}
                onChange={(e) =>
                  setSelectedPolicy({
                    ...selectedPolicy,
                    applicableObject: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <strong>Effective Date:</strong>
              <DatePicker
                value={
                  selectedPolicy.effectiveDate
                    ? moment(selectedPolicy.effectiveDate)
                    : null
                }
                onChange={(date, dateString) =>
                  setSelectedPolicy({
                    ...selectedPolicy,
                    effectiveDate: dateString,
                  })
                }
              />
            </div>

            <div>
              <strong>Value:</strong>
              <Input
                value={selectedPolicy.value}
                onChange={(e) =>
                  setSelectedPolicy({
                    ...selectedPolicy,
                    value: e.target.value,
                  })
                }
              />
            </div>

            <Button
              type="primary"
              onClick={() =>
                handleUpdatePolicy(selectedPolicy.policyID, selectedPolicy)
              }
            >
              Update Policy
            </Button>
          </div>
        ) : (
          <p>Loading policy...</p>
        )}
      </Modal>
    </div>
  );
};

export default ManagePolicy;
