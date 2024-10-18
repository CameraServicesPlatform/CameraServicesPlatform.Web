import { Button, Form, Modal, Spin, message } from "antd";
import React, { useEffect, useState } from "react";
import { getAccountById } from "../../../api/accountApi"; // Ensure this API function is implemented

const GetInformationAccount = ({ accountId, visible, onCancel }) => {
  const [accountData, setAccountData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAccountData = async () => {
      if (accountId) {
        setLoading(true);
        try {
          const data = await getAccountById(accountId);
          if (data.isSuccess) {
            setAccountData(data.result);
          } else {
            message.error("Failed to fetch account data.");
          }
        } catch (error) {
          message.error("An error occurred while fetching account data.");
        }
        setLoading(false);
      }
    };

    fetchAccountData();
  }, [accountId]);

  const handleCopyData = () => {
    if (accountData) {
      const dataToCopy = `
        Account ID: ${accountData.id}
        First Name: ${accountData.firstName}
        Last Name: ${accountData.lastName}
        Email: ${accountData.email}
        Normalized Email: ${accountData.normalizedEmail}
        Phone Number: ${accountData.phoneNumber}
        Address: ${accountData.address || "No address provided"}
        Gender: ${
          accountData.gender !== undefined
            ? accountData.gender === 0
              ? "Male"
              : "Female"
            : "Not specified"
        }
        Job: ${accountData.job || "No job specified"}
        Hobby: ${accountData.hobby || "No hobby specified"}
        Supplier ID: ${accountData.supplierID || "No supplier ID provided"}
        Staff ID: ${accountData.staffID || "No staff ID provided"}
        Concurrency Stamp: ${accountData.concurrencyStamp}
        Refresh Token Expiry Time: ${
          accountData.refreshTokenExpiryTime || "Not available"
        }
        Verified: ${accountData.isVerified ? "Yes" : "No"}
        Username: ${accountData.userName}
      `;

      navigator.clipboard
        .writeText(dataToCopy)
        .then(() => {
          message.success("Account data copied to clipboard!");
        })
        .catch(() => {
          message.error("Failed to copy account data.");
        });
    }
  };

  return (
    <Modal
      title="Account Information"
      visible={visible}
      onCancel={onCancel}
      footer={null}
      centered
      width={800} // Set a specific width for the modal
    >
      {loading ? (
        <Spin />
      ) : (
        <Form layout="vertical" style={{ padding: "20px" }}>
          <Form.Item label="Account ID">
            <span style={{ fontWeight: "500" }}>{accountData?.id}</span>
          </Form.Item>
          <Form.Item label="First Name">
            <span style={{ fontWeight: "500" }}>{accountData?.firstName}</span>
          </Form.Item>
          <Form.Item label="Last Name">
            <span style={{ fontWeight: "500" }}>{accountData?.lastName}</span>
          </Form.Item>
          <Form.Item label="Email">
            <span style={{ fontWeight: "500" }}>{accountData?.email}</span>
          </Form.Item>
          <Form.Item label="Normalized Email">
            <span style={{ fontWeight: "500" }}>
              {accountData?.normalizedEmail}
            </span>
          </Form.Item>
          <Form.Item label="Phone Number">
            <span style={{ fontWeight: "500" }}>
              {accountData?.phoneNumber}
            </span>
          </Form.Item>
          <Form.Item label="Address">
            <span style={{ fontWeight: "500" }}>
              {accountData?.address || "No address provided"}
            </span>
          </Form.Item>
          <Form.Item label="Front of Citizen ID">
            {accountData?.frontOfCitizenIdentificationCard ? (
              <img
                src={accountData.frontOfCitizenIdentificationCard}
                alt="Front of Citizen ID"
                style={{
                  width: "100%",
                  height: "auto",
                  marginTop: "10px",
                  borderRadius: "5px",
                }} // Added border-radius for better aesthetics
              />
            ) : (
              <span>No image provided</span>
            )}
          </Form.Item>
          <Form.Item label="Back of Citizen ID">
            {accountData?.backOfCitizenIdentificationCard ? (
              <img
                src={accountData.backOfCitizenIdentificationCard}
                alt="Back of Citizen ID"
                style={{
                  width: "100%",
                  height: "auto",
                  marginTop: "10px",
                  borderRadius: "5px",
                }} // Added border-radius for better aesthetics
              />
            ) : (
              <span>No image provided</span>
            )}
          </Form.Item>
          <Form.Item label="Gender">
            <span style={{ fontWeight: "500" }}>
              {accountData?.gender !== undefined
                ? accountData.gender === 0
                  ? "Male"
                  : "Female"
                : "Not specified"}
            </span>
          </Form.Item>
          <Form.Item label="Job">
            <span style={{ fontWeight: "500" }}>
              {accountData?.job || "No job specified"}
            </span>
          </Form.Item>
          <Form.Item label="Hobby">
            <span style={{ fontWeight: "500" }}>
              {accountData?.hobby || "No hobby specified"}
            </span>
          </Form.Item>
          <Form.Item label="Supplier ID">
            <span style={{ fontWeight: "500" }}>
              {accountData?.supplierID || "No supplier ID provided"}
            </span>
          </Form.Item>
          <Form.Item label="Staff ID">
            <span style={{ fontWeight: "500" }}>
              {accountData?.staffID || "No staff ID provided"}
            </span>
          </Form.Item>
          <Form.Item label="Concurrency Stamp">
            <span style={{ fontWeight: "500" }}>
              {accountData?.concurrencyStamp}
            </span>
          </Form.Item>
          <Form.Item label="Refresh Token Expiry Time">
            <span style={{ fontWeight: "500" }}>
              {accountData?.refreshTokenExpiryTime || "Not available"}
            </span>
          </Form.Item>
          <Form.Item label="Verified">
            <span style={{ fontWeight: "500" }}>
              {accountData?.isVerified ? "Yes" : "No"}
            </span>
          </Form.Item>
          <Form.Item label="Username">
            <span style={{ fontWeight: "500" }}>{accountData?.userName}</span>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              onClick={handleCopyData}
              style={{ marginRight: "10px" }}
            >
              Copy Data
            </Button>
            <Button
              type="primary"
              onClick={onCancel}
              style={{ float: "right" }}
            >
              Close
            </Button>
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};

export default GetInformationAccount;
