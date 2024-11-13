import { Button, Input, message, Space, Table } from "antd";
import React, { useEffect, useState } from "react";
import {
  deleteContractTemplateById,
  getAllContractTemplates,
} from "../../../api/contractTemplateApi";
import UpdateContractTemplateForm from "./UpdateContractTemplateForm";

const { Search } = Input;

const ContractTemplateList = ({ refresh }) => {
  const [contractTemplates, setContractTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);

  useEffect(() => {
    const fetchContractTemplates = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllContractTemplates();
        setContractTemplates(data.result.items);
      } catch (error) {
        setError(error);
        message.error("Error fetching contract templates.");
      } finally {
        setLoading(false);
      }
    };

    fetchContractTemplates();
  }, [refresh]);

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleUpdate = (contractTemplateId) => {
    setSelectedTemplateId(contractTemplateId);
    setUpdateModalVisible(true);
  };

  const handleDelete = async (contractTemplateId) => {
    try {
      await deleteContractTemplateById(contractTemplateId);
      message.success("Contract template deleted successfully.");
      setRefreshList((prev) => !prev);
    } catch (error) {
      message.error("Error deleting contract template.");
    }
  };

  const handleUpdateSuccess = () => {
    message.success("Contract template updated successfully.");
    setRefreshList((prev) => !prev);
  };

  const filteredTemplates = contractTemplates.filter((template) =>
    template.templateName.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: "Template Name",
      dataIndex: "templateName",
      key: "templateName",
    },
    {
      title: "Contract Terms",
      dataIndex: "contractTerms",
      key: "contractTerms",
    },
    {
      title: "Template Details",
      dataIndex: "templateDetails",
      key: "templateDetails",
    },
    {
      title: "Penalty Policy",
      dataIndex: "penaltyPolicy",
      key: "penaltyPolicy",
    },
    {
      title: "Account ID",
      dataIndex: "accountID",
      key: "accountID",
    },
    {
      title: "Product ID",
      dataIndex: "productID",
      key: "productID",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space size="middle">
          <Button onClick={() => handleUpdate(record.contractTemplateID)}>
            Update
          </Button>
          <Button
            onClick={() => handleDelete(record.contractTemplateID)}
            danger
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>Danh sách mẫu hợp đồng</h2>
      <Search
        placeholder="Search by template name"
        onSearch={handleSearch}
        enterButton
        style={{ marginBottom: 20 }}
      />
      <Table
        dataSource={filteredTemplates}
        columns={columns}
        rowKey="contractTemplateID"
      />
      <UpdateContractTemplateForm
        visible={updateModalVisible}
        onClose={() => setUpdateModalVisible(false)}
        contractTemplateId={selectedTemplateId}
        onUpdateSuccess={handleUpdateSuccess}
      />
    </div>
  );
};

export default ContractTemplateList;
