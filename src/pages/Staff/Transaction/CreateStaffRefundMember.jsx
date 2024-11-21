import { Button, Table, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { getAllOrders } from "../../../api/orderApi";
import { createStaffRefund } from "../../../api/transactionApi";
const { Title } = Typography;

const CreateStaffRefundMember = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const result = await getAllOrders(1, 10);
      if (result && result.isSuccess) {
        setOrders(result.result);
      }
      setLoading(false);
    };

    fetchOrders();
  }, []);

  const handleRefund = async (orderID, accountId, amount) => {
    const staffId = "your-staff-id"; // Replace with actual staff ID
    const data = { orderID, accountId, staffId, amount };
    const result = await createStaffRefund(data);
    if (result && result.isSuccess) {
      console.log("Refund successful:", result);
    } else {
      console.error("Refund failed:", result);
    }
  };

  const columns = [
    {
      title: "Supplier ID",
      dataIndex: "supplierID",
      key: "supplierID",
    },
    {
      title: "Order ID",
      dataIndex: "orderID",
      key: "orderID",
    },
    {
      title: "Account ID",
      dataIndex: "accountID",
      key: "accountID",
    },
    {
      title: "Order Date",
      dataIndex: "orderDate",
      key: "orderDate",
    },
    {
      title: "Order Status",
      dataIndex: "orderStatus",
      key: "orderStatus",
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
    },
    {
      title: "Order Type",
      dataIndex: "orderType",
      key: "orderType",
    },
    {
      title: "Shipping Address",
      dataIndex: "shippingAddress",
      key: "shippingAddress",
    },
    {
      title: "Deliveries Method",
      dataIndex: "deliveriesMethod",
      key: "deliveriesMethod",
    },
    {
      title: "Deposit",
      dataIndex: "deposit",
      key: "deposit",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) =>
        (record.orderStatus === 7 || record.orderType === 1) && (
          <Button
            type="primary"
            onClick={() =>
              handleRefund(record.orderID, record.accountID, record.totalAmount)
            }
          >
            Refund
          </Button>
        ),
    },
  ];

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <Title level={2} className="text-center">
        Danh Sách Đơn Hàng
      </Title>
      <Table
        columns={columns}
        dataSource={orders}
        rowKey="orderID"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default CreateStaffRefundMember;
