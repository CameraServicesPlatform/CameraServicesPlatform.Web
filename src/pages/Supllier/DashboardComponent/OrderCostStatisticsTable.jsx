import React from "react";
import { Card, Table } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";

const formatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});

const orderCostColumns = [
  {
    title: "Tháng",
    dataIndex: "month",
    key: "month",
    render: (text) => new Date(text).toLocaleDateString(),
  },
  {
    title: "Tổng Chi Phí",
    dataIndex: "totalCost",
    key: "totalCost",
    render: (text) => formatter.format(text),
  },
];

const OrderCostStatisticsTable = ({ orderCostStatistics }) => (
  <Card
    title={
      <span>
        <ShoppingCartOutlined /> Thống Kê Chi Phí Đơn Hàng
      </span>
    }
    className="shadow-sm"
  >
    <Table
      dataSource={orderCostStatistics}
      columns={orderCostColumns}
      pagination={{ pageSize: 5 }}
      scroll={{ y: 240 }}
    />
  </Card>
);

export default OrderCostStatisticsTable;
