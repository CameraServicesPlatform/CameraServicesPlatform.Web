import {
  CheckCircleOutlined,
  CheckOutlined,
  CloseOutlined,
  ShippingOutlined,
} from "@ant-design/icons";
import { Button, message, Modal, Spin, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getSupplierIdByAccountId } from "../../../api/accountApi";
import {
  cancelOrder,
  getOrderOfSupplierId,
  updateOrderStatusApproved,
  updateOrderStatusCompleted,
  updateOrderStatusShipped,
} from "../../../api/orderApi";

const OrderListBySupplier = ({ refresh }) => {
  const user = useSelector((state) => state.user.user || {});
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [supplierId, setSupplierId] = useState(null);

  const orderStatusMap = {
    0: "Pending",
    1: "Approved",
    2: "Completed",
    3: "Placed",
    4: "Shipped",
    5: "Delivered",
    6: "Cancelled",
    7: "Payment",
  };

  const orderTypeMap = {
    0: "Purchase",
    1: "Rental",
  };

  const deliveryStatusMap = {
    0: "GoShopPichUpProduct",
    1: "ShopShip",
    2: "Returned",
  };

  // Fetch supplier ID
  useEffect(() => {
    const fetchSupplierId = async () => {
      if (user.id) {
        try {
          const response = await getSupplierIdByAccountId(user.id);
          if (response?.isSuccess) {
            setSupplierId(response.result);
          } else {
            message.error("Lấy ID Nhà cung cấp không thành công.");
          }
        } catch (error) {
          message.error("Lỗi khi lấy ID Nhà cung cấp.");
        }
      }
    };
    fetchSupplierId();
  }, [user.id]);

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (supplierId) {
        setLoading(true);
        try {
          const data = await getOrderOfSupplierId(
            supplierId,
            pageIndex,
            pageSize
          );
          if (data?.isSuccess) {
            setOrders(data.result || []);
          } else {
            message.error("Failed to load orders.");
          }
        } catch (err) {
          setError("Failed to load orders.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchOrders();
  }, [refresh, supplierId, pageIndex, pageSize]);

  const handleCompleteOrder = async (orderId) => {
    try {
      const response = await updateOrderStatusCompleted(orderId);
      if (response?.isSuccess) {
        message.success("Order marked as completed!");
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.orderID === orderId ? { ...order, orderStatus: 2 } : order
          )
        );
      } else {
        message.error("Failed to mark order as completed.");
      }
    } catch (error) {
      message.error("Error marking order as completed.");
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      const response = await cancelOrder(orderId);
      if (response?.isSuccess) {
        message.success("Order canceled successfully!");
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.orderID === orderId ? { ...order, orderStatus: 6 } : order
          )
        );
      } else {
        message.error("Failed to cancel order.");
      }
    } catch (error) {
      message.error("Error canceling order.");
    }
  };

  const handleShipOrder = async (orderId) => {
    try {
      const response = await updateOrderStatusShipped(orderId);
      if (response?.isSuccess) {
        message.success("Order marked as shipped!");
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.orderID === orderId ? { ...order, orderStatus: 4 } : order
          )
        );
      } else {
        message.error("Failed to mark order as shipped.");
      }
    } catch (error) {
      message.error("Error marking order as shipped.");
    }
  };

  const handleApproveOrder = async (orderId) => {
    try {
      const response = await updateOrderStatusApproved(orderId);
      if (response?.isSuccess) {
        message.success("Order marked as approved!");
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.orderID === orderId ? { ...order, orderStatus: 1 } : order
          )
        );
      } else {
        message.error("Failed to mark order as approved.");
      }
    } catch (error) {
      message.error("Error marking order as approved.");
    }
  };

  const showConfirm = (action, orderId) => {
    Modal.confirm({
      title: "Are you sure?",
      content: `Do you want to ${action} this order?`,
      onOk() {
        switch (action) {
          case "complete":
            handleCompleteOrder(orderId);
            break;
          case "cancel":
            handleCancelOrder(orderId);
            break;
          case "ship":
            handleShipOrder(orderId);
            break;
          case "approve":
            handleApproveOrder(orderId);
            break;
          default:
            break;
        }
      },
    });
  };

  const columns = [
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
      render: (status) => orderStatusMap[status],
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
      render: (type) => orderTypeMap[type],
    },
    {
      title: "Shipping Address",
      dataIndex: "shippingAddress",
      key: "shippingAddress",
    },
    {
      title: "Delivery Method",
      dataIndex: "deliveryMethod",
      key: "deliveryMethod",
      render: (status) => deliveryStatusMap[status],
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <div>
          {record.orderStatus === 0 && (
            <>
              <Button
                type="primary"
                onClick={() => showConfirm("approve", record.orderID)}
                className="ml-2"
                icon={<CheckOutlined />}
              >
                Approve
              </Button>
              <Button
                type="danger"
                onClick={() => showConfirm("cancel", record.orderID)}
                className="ml-2"
                icon={<CloseOutlined />}
              >
                Cancel
              </Button>
            </>
          )}
          {record.orderStatus === 7 && (
            <Button
              type="primary"
              onClick={() => showConfirm("approve", record.orderID)}
              className="ml-2"
              icon={<CheckOutlined />}
            >
              Approve
            </Button>
          )}
          {record.orderStatus === 1 && (
            <Button
              type="default"
              onClick={() => showConfirm("ship", record.orderID)}
              className="ml-2"
              icon={<ShippingOutlined />}
            >
              Ship
            </Button>
          )}
          {record.orderStatus !== 2 && record.orderStatus !== 6 && (
            <Button
              type="primary"
              onClick={() => showConfirm("complete", record.orderID)}
              className="ml-2"
              icon={<CheckCircleOutlined />}
            >
              Complete
            </Button>
          )}
        </div>
      ),
    },
  ];

  if (loading) {
    return <Spin tip="Loading orders..." />;
  }

  if (error) {
    return <div>{error}</div>;
  }

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

export default OrderListBySupplier;
