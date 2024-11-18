import { Input, Table, message } from "antd";
import React, { useEffect, useState } from "react";
import { getAllContractsByOrderId } from "../../../api/contractApi"; // Adjust the import path according to your project structure

const ContractOrder = ({ orderID }) => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");

  const fetchContracts = async () => {
    setLoading(true);
    try {
      const data = await getAllContractsByOrderId(
        orderID,
        pageIndex,
        pageSize,
        searchText
      );
      if (data.isSuccess) {
        setContracts(data.result.items);
      } else {
        message.error("Không thể lấy hợp đồng.");
      }
    } catch (error) {
      message.error("Lỗi khi lấy hợp đồng theo ID đơn hàng.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, [orderID, pageIndex, pageSize, searchText]);

  const columns = [
    {
      title: "Mã hợp đồng",
      dataIndex: "contractID",
      key: "contractID",
      sorter: true,
    },
    {
      title: "Mã đơn hàng",
      dataIndex: "orderID",
      key: "orderID",
    },
    {
      title: "Chi tiết mẫu",
      dataIndex: "templateDetails",
      key: "templateDetails",
    },
    {
      title: "Điều khoản hợp đồng",
      dataIndex: "contractTerms",
      key: "contractTerms",
    },
    {
      title: "Chính sách phạt",
      dataIndex: "penaltyPolicy",
      key: "penaltyPolicy",
      sorter: true,
    },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-6">Điều khoản hợp đồng</h2>
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
        onChange={(pagination, filters, sorter) => {
          // Handle table change for sorting
        }}
        className="w-full"
      />
    </div>
  );
};

export default ContractOrder;
