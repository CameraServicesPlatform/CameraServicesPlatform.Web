import { Button, Table, Tag } from "antd";
import moment from "moment";
import React from "react";
import { getColumnSearchProps } from "./handle";

const OrderRentTable = ({
  orders,
  accountNames,
  pageIndex,
  pageSize,
  setPageIndex,
  setPageSize,
  handleOpenTrackingModal,
  handleOpenContractModal,
}) => {
  const orderStatusMap = {
    0: { text: "Chờ xử lý", color: "blue" },
    1: { text: "Sản phẩm sẵn sàng được giao", color: "green" },
    2: { text: "Hoàn thành", color: "yellow" },
    3: { text: "Đã nhận sản phẩm", color: "purple" },
    4: { text: "Đã giao hàng", color: "cyan" },
    5: { text: "Thanh toán thất bại", color: "cyan" },
    6: { text: "Đang hủy", color: "lime" },
    7: { text: "Đã hủy thành công", color: "red" },
    8: { text: "Đã Thanh toán", color: "orange" },
    9: { text: "Hoàn tiền đang chờ xử lý", color: "pink" },
    10: { text: "Hoàn tiền thành công ", color: "brown" },
    11: { text: "Hoàn trả tiền đặt cọc", color: "gold" },
    12: { text: "Gia hạn", color: "violet" },
  };

  const orderTypeMap = {
    0: { text: "Mua", color: "blue" },
    1: { text: "Thuê", color: "green" },
  };

  const deliveryStatusMap = {
    0: { text: "Đến cửa hàng lấy hàng", color: "blue" },
    1: { text: "Cửa hàng giao hàng", color: "green" },
    2: { text: "Đã trả lại", color: "red" },
  };

  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "orderID",
      key: "orderID",
      sorter: (a, b) => a.orderID.localeCompare(b.orderID),
      ...getColumnSearchProps("orderID"),
    },
    {
      title: "Tên tài khoản",
      dataIndex: "accountName",
      key: "accountName",
      sorter: (a, b) => a.accountName.localeCompare(b.accountName),
      ...getColumnSearchProps("accountName"),
    },
    {
      title: "Ngày đặt hàng",
      dataIndex: "orderDate",
      key: "orderDate",
      sorter: (a, b) => new Date(a.orderDate) - new Date(b.orderDate),
      render: (date) => moment(date).format("DD/MM/YYYY HH:mm:ss"),
    },
    {
      title: "Trạng thái đơn hàng",
      dataIndex: "orderStatus",
      key: "orderStatus",
      render: (status) => {
        const statusInfo = orderStatusMap[status];
        return statusInfo ? (
          <Tag color={statusInfo.color}>{statusInfo.text}</Tag>
        ) : null;
      },
      sorter: (a, b) => a.orderStatus - b.orderStatus,
    },
    {
      title: "Tổng số tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      sorter: (a, b) => a.totalAmount - b.totalAmount,
      render: (text) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(text),
    },
    {
      title: "Loại đơn hàng",
      dataIndex: "orderType",
      key: "orderType",
      render: (type) => {
        const typeInfo = orderTypeMap[type];
        return typeInfo ? (
          <Tag color={typeInfo.color}>{typeInfo.text}</Tag>
        ) : null;
      },
      sorter: (a, b) => a.orderType - b.orderType,
    },
    {
      title: "Địa chỉ giao hàng",
      dataIndex: "shippingAddress",
      key: "shippingAddress",
      sorter: (a, b) => a.shippingAddress.localeCompare(b.shippingAddress),
    },
    {
      title: "Phương thức giao hàng",
      dataIndex: "deliveriesMethod",
      key: "deliveriesMethod",
      render: (status) => {
        const deliveryInfo = deliveryStatusMap[status];
        return deliveryInfo ? (
          <Tag color={deliveryInfo.color}>{deliveryInfo.text}</Tag>
        ) : null;
      },
      sorter: (a, b) => a.deliveriesMethod - b.deliveriesMethod,
    },
    {
      title: "Hành động",
      key: "actions",
      render: (text, record) => (
        <>
          <Button
            type="primary"
            onClick={() => handleOpenTrackingModal(record)}
          >
            Theo dõi đơn hàng
          </Button>
          {record.orderType === 1 && (
            <Button
              type="default"
              onClick={() => handleOpenContractModal(record)}
              style={{ marginLeft: 8 }}
            >
              Hợp đồng
            </Button>
          )}
        </>
      ),
    },
  ];

  return (
    <Table
      dataSource={orders}
      columns={columns}
      rowKey="orderID"
      pagination={{
        current: pageIndex,
        pageSize: pageSize,
        total: orders.length,
        onChange: (page, pageSize) => {
          setPageIndex(page);
          setPageSize(pageSize);
        },
      }}
    />
  );
};

export default OrderRentTable;
