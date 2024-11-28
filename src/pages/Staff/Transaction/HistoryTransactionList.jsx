import { Button, Spin, Table } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { getUserById } from "../../../api/accountApi";
import { getStaffById } from "../../../api/staffApi";
import { getAllHistoryTransactions } from "../../../api/transactionApi";

const HistoryTransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10); // You can make this dynamic if needed
  const [loading, setLoading] = useState(false);
  const [accountNames, setAccountNames] = useState({});
  const [staffNames, setStaffNames] = useState({});

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      const data = await getAllHistoryTransactions(pageIndex, pageSize);
      if (data) {
        setTransactions(data.result);
        // Fetch account names and staff names for each transaction
        const accountNamesMap = {};
        const staffNamesMap = {};
        await Promise.all(
          data.result.map(async (transaction) => {
            if (transaction.accountID) {
              const accountData = await getUserById(transaction.accountID);
              if (accountData && accountData.result) {
                accountNamesMap[
                  transaction.accountID
                ] = `${accountData.result.lastName} ${accountData.result.firstName}`;
              }
            }
            if (transaction.staffID) {
              const staffData = await getStaffById(transaction.staffID);
              if (staffData) {
                staffNamesMap[
                  transaction.staffID
                ] = `${staffData.result.account.firstName} ${staffData.result.account.lastName} `;
              }
            }
          })
        );
        setAccountNames(accountNamesMap);
        setStaffNames(staffNamesMap);
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
      title: "Mã giao dịch lịch sử",
      dataIndex: "historyTransactionId",
      key: "historyTransactionId",
    },
    {
      title: "Tên tài khoản",
      dataIndex: "accountID",
      key: "accountID",
      render: (accountID) => accountNames[accountID],
    },
    {
      title: "Tên nhân viên",
      dataIndex: "staffID",
      key: "staffID",
      render: (staffID) => staffNames[staffID],
    },
    {
      title: "Số tiền",
      dataIndex: "price",
      key: "price",
      render: (price) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(price),
    },
    {
      title: "Mô tả giao dịch",
      dataIndex: "transactionDescription",
      key: "transactionDescription",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => moment(createdAt).format("DD - MM - YYYY HH:mm"),
    },
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Danh sách lịch sử giao dịch</h1>
      {loading ? (
        <div className="flex justify-center items-center">
          <Spin size="large" />
        </div>
      ) : (
        <div>
          <Table
            dataSource={transactions}
            columns={columns}
            rowKey="historyTransactionId"
            pagination={false}
          />
          <div className="flex justify-between items-center mt-4">
            <Button onClick={handlePreviousPage} disabled={pageIndex === 1}>
              Trước
            </Button>
            <span>Trang {pageIndex}</span>
            <Button onClick={handleNextPage}>Tiếp</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryTransactionList;
