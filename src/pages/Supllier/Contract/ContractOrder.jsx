import { Table, message } from "antd";
import React, { useEffect, useState } from "react";
import { getAllContractsByOrderId } from "../../../api/contractApi"; // Adjust the import path according to your project structure

const ContractOrder = ({ orderID }) => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const data = await getAllContractsByOrderId(
          orderID,
          pageIndex,
          pageSize
        );
        if (data.isSuccess) {
          setContracts(data.result.items);
        } else {
          message.error("Failed to fetch contracts.");
        }
      } catch (error) {
        message.error("Error fetching contracts by order ID.");
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();
  }, [orderID, pageIndex, pageSize]);

  const columns = [
    {
      title: "Contract ID",
      dataIndex: "contractID",
      key: "contractID",
    },
    {
      title: "Order ID",
      dataIndex: "orderID",
      key: "orderID",
    },
    {
      title: "Template Details",
      dataIndex: "templateDetails",
      key: "templateDetails",
    },
    {
      title: "Contract Terms",
      dataIndex: "contractTerms",
      key: "contractTerms",
    },
    {
      title: "Penalty Policy",
      dataIndex: "penaltyPolicy",
      key: "penaltyPolicy",
    },
  ];

  return (
    <Table
      dataSource={contracts}
      columns={columns}
      rowKey="contractID"
      loading={loading}
      pagination={{
        current: pageIndex,
        pageSize: pageSize,
        onChange: (page, size) => {
          setPageIndex(page);
          setPageSize(size);
        },
      }}
    />
  );
};

export default ContractOrder;
