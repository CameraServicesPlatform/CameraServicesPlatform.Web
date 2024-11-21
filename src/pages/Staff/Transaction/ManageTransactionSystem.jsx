import { Tabs } from "antd";
import React, { useState } from "react";
import HistoryTransactionList from "./HistoryTransactionList.jsx";
import TransactionList from "./TransactionList";
const ManageTransactionSystem = () => {
  const [refreshList, setRefreshList] = useState(false);

  const tabItems = [
    {
      key: "1",
      label: "Danh Sách Giao Dịch Đơn Hàng Hệ Thống",
      children: <TransactionList refresh={refreshList} />,
    },
    {
      key: "2",

      label: "Danh Sách Giao Dịch Hoàn Trả",
      children: <HistoryTransactionList refresh={refreshList} />,
    },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-semibold mb-6">Quản Lý Báo Cáo Sản Phẩm</h1>{" "}
      <Tabs defaultActiveKey="1" items={tabItems} />
    </div>
  );
};

export default ManageTransactionSystem;
