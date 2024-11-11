import { Button, Input, message, Table } from "antd";
import React, { useState } from "react";
import { getOrderByOrderType } from "../../../api/orderApi"; // Adjust the import based on your project structure

const FilterOrders = ({ setOrders }) => {
  const [filterType, setFilterType] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFilterOrders = async () => {
    if (filterType) {
      setLoading(true);
      try {
        const filteredOrders = await getOrderByOrderType(filterType, 1, 10);
        if (filteredOrders) {
          setFilteredOrders(
            Array.isArray(filteredOrders.result) ? filteredOrders.result : []
          );
          setOrders(
            Array.isArray(filteredOrders.result) ? filteredOrders.result : []
          );
        } else {
          message.error("Không thể lấy đơn hàng đã lọc.");
        }
      } catch (err) {
        message.error("Lỗi khi lấy đơn hàng đã lọc.");
      } finally {
        setLoading(false);
      }
    }
  };

  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "orderID",
      key: "orderID",
    },
    {
      title: "Mã tài khoản",
      dataIndex: "accountID",
      key: "accountID",
    },
    {
      title: "Ngày đặt hàng",
      dataIndex: "orderDate",
      key: "orderDate",
    },
    {
      title: "Trạng thái đơn hàng",
      dataIndex: "orderStatus",
      key: "orderStatus",
    },
    {
      title: "Tổng số tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
    },
    {
      title: "Loại đơn hàng",
      dataIndex: "orderType",
      key: "orderType",
    },
    {
      title: "Địa chỉ giao hàng",
      dataIndex: "shippingAddress",
      key: "shippingAddress",
    },
    {
      title: "Phương thức giao hàng",
      dataIndex: "deliveryMethod",
      key: "deliveryMethod",
    },
  ];

  return (
    <div>
      <Input
        placeholder="Lọc theo loại"
        value={filterType}
        onChange={(e) => setFilterType(e.target.value)}
        className="w-64 mb-4 mr-2"
      />
      <Button type="default" onClick={handleFilterOrders} loading={loading}>
        Lọc
      </Button>
      <Table
        dataSource={filteredOrders}
        columns={columns}
        rowKey="orderID"
        loading={loading}
        pagination={false}
      />
    </div>
  );
};

export default FilterOrders;
