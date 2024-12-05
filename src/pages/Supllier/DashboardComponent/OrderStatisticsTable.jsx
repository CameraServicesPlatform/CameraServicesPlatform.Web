import React from "react";
import { Card, Table } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";

const formatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});

const orderStatisticsColumns = [
  {
    title: "Tổng Doanh Thu",
    dataIndex: "totalSales",
    key: "totalSales",
    render: (text) => formatter.format(text),
  },
  {
    title: "Tổng Số Đơn Hàng",
    dataIndex: "totalOrders",
    key: "totalOrders",
  },
  {
    title: "Chờ Xử Lý",
    dataIndex: "pendingOrders",
    key: "pendingOrders",
  },
  {
    title: "Hoàn Thành",
    dataIndex: "completedOrders",
    key: "completedOrders",
  },
  {
    title: "Bị Hủy",
    dataIndex: "canceledOrders",
    key: "canceledOrders",
  },
  {
    title: "Được Duyệt",
    dataIndex: "approvedOrders",
    key: "approvedOrders",
  },
  {
    title: "Đã Đặt",
    dataIndex: "placedOrders",
    key: "placedOrders",
  },
  {
    title: "Đã Giao",
    dataIndex: "shippedOrders",
    key: "shippedOrders",
  },
  {
    title: "Thanh Toán Thất Bại",
    dataIndex: "paymentFailOrders",
    key: "paymentFailOrders",
  },
  {
    title: "Đang Hủy",
    dataIndex: "cancelingOrders",
    key: "cancelingOrders",
  },
  {
    title: "Thanh Toán",
    dataIndex: "paymentOrders",
    key: "paymentOrders",
  },
  {
    title: "Chờ Hoàn Tiền",
    dataIndex: "pendingRefundOrders",
    key: "pendingRefundOrders",
  },
  {
    title: "Đã Hoàn Tiền",
    dataIndex: "refundOrders",
    key: "refundOrders",
  },
  {
    title: "Trả Lại Tiền Đặt Cọc",
    dataIndex: "depositReturnOrders",
    key: "depositReturnOrders",
  },
  {
    title: "Gia Hạn",
    dataIndex: "extendOrders",
    key: "extendOrders",
  },
];

const OrderStatisticsTable = ({ orderStatistics }) => (
  <Card
    title={
      <span>
        <ShoppingCartOutlined /> Thống Kê Đơn Hàng
      </span>
    }
    className="shadow-sm"
  >
    <Table
      dataSource={[orderStatistics]}
      columns={orderStatisticsColumns}
      pagination={{ pageSize: 5 }}
      scroll={{ y: 240 }}
    />
  </Card>
);

export default OrderStatisticsTable;
