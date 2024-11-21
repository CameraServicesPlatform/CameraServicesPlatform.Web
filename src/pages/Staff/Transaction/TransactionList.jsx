import { Button, Spin, Table } from "antd";
import React, { useEffect, useState } from "react";
import { getAllTransactions } from "../../../api/transactionApi"; // Adjust the import path as necessary

const TransactionType = {
  0: "Payment",
  1: "Refund",
};

const PaymentStatus = {
  0: "Pending",
  1: "Completed",
  2: "Failed",
};

const PaymentMethod = {
  0: "VNPAY",
  1: "CreditCard",
  2: "BankTransfer",
};

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(10); // You can make this dynamic if needed
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      const data = await getAllTransactions(pageIndex, pageSize);
      if (data) {
        setTransactions(data.result);
      }
      setLoading(false);
    };

    fetchTransactions();
  }, [pageIndex, pageSize]);

  const handleNextPage = () => {
    setPageIndex((prevPageIndex) => prevPageIndex + 1);
  };

  const handlePreviousPage = () => {
    setPageIndex((prevPageIndex) => Math.max(prevPageIndex - 1, 1));
  };

  const columns = [
    {
      title: "Transaction ID",
      dataIndex: "transactionID",
      key: "transactionID",
    },
    {
      title: "Order ID",
      dataIndex: "orderID",
      key: "orderID",
    },
    {
      title: "Transaction Date",
      dataIndex: "transactionDate",
      key: "transactionDate",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Transaction Type",
      dataIndex: "transactionType",
      key: "transactionType",
      render: (type) => TransactionType[type],
    },
    {
      title: "Payment Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (status) => PaymentStatus[status],
    },
    {
      title: "Payment Method",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      render: (method) => PaymentMethod[method],
    },
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Transaction List</h1>
      {loading ? (
        <div className="flex justify-center items-center">
          <Spin size="large" />
        </div>
      ) : (
        <div>
          <Table
            dataSource={transactions}
            columns={columns}
            rowKey="transactionID"
            pagination={false}
          />
          <div className="flex justify-between items-center mt-4">
            <Button onClick={handlePreviousPage} disabled={pageIndex === 1}>
              Previous
            </Button>
            <span>Page {pageIndex}</span>
            <Button onClick={handleNextPage}>Next</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionList;
