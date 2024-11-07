import {
  CarOutlined,
  CheckCircleOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { Button, message, Modal, Table } from "antd";
import React, { useEffect, useState } from "react";
import {
  cancelOrder,
  updateOrderStatusApproved,
  updateOrderStatusCompleted,
  updateOrderStatusShipped,
} from "../../../api/orderApi";
import { getOrderDetails } from "../../../api/orderDetailApi";
const TrackingOrder = ({ order, onUpdate }) => {
  const [orderDetails, setOrderDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const data = await getOrderDetails(order.orderID);
        setOrderDetails(data.result || []);
      } catch (error) {
        message.error("Lỗi khi lấy chi tiết đơn hàng.");
      } finally {
        setLoading(false);
      }
    };

    if (order) {
      fetchOrderDetails();
    }
  }, [order]);

  const handleCompleteOrder = async (orderId) => {
    try {
      const response = await updateOrderStatusCompleted(orderId);
      if (response?.isSuccess) {
        message.success("Đơn hàng đã được hoàn thành!");
        onUpdate(orderId, 2);
      } else {
        message.error("Không thể hoàn thành đơn hàng.");
      }
    } catch (error) {
      message.error("Lỗi khi hoàn thành đơn hàng.");
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      const response = await cancelOrder(orderId);
      if (response?.isSuccess) {
        message.success("Đơn hàng đã được hủy!");
        onUpdate(orderId, 6);
      } else {
        message.error("Không thể hủy đơn hàng.");
      }
    } catch (error) {
      message.error("Lỗi khi hủy đơn hàng.");
    }
  };

  const handleShipOrder = async (orderId) => {
    try {
      const response = await updateOrderStatusShipped(orderId);
      if (response?.isSuccess) {
        message.success("Đơn hàng đã được giao!");
        onUpdate(orderId, 4);
      } else {
        message.error("Không thể giao đơn hàng.");
      }
    } catch (error) {
      message.error("Lỗi khi giao đơn hàng.");
    }
  };

  const handleApproveOrder = async (orderId) => {
    try {
      const response = await updateOrderStatusApproved(orderId);
      if (response?.isSuccess) {
        message.success("Đơn hàng đã được phê duyệt!");
        onUpdate(orderId, 1);
      } else {
        message.error("Không thể phê duyệt đơn hàng.");
      }
    } catch (error) {
      message.error("Lỗi khi phê duyệt đơn hàng.");
    }
  };

  const showConfirm = (action, orderId) => {
    Modal.confirm({
      title: "Bạn có chắc chắn?",
      content: `Bạn có muốn ${action} đơn hàng này không?`,
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
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
    },
  ];

  return (
    <div>
      {order.orderStatus === 0 && (
        <>
          <Button
            type="primary"
            onClick={() => showConfirm("approve", order.orderID)}
            className="ml-2"
            icon={<CheckOutlined />}
          >
            Phê duyệt
          </Button>
          <Button
            type="danger"
            onClick={() => showConfirm("cancel", order.orderID)}
            className="ml-2"
            icon={<CloseOutlined />}
          >
            Hủy
          </Button>
        </>
      )}
      {order.orderStatus === 7 && (
        <Button
          type="primary"
          onClick={() => showConfirm("approve", order.orderID)}
          className="ml-2"
          icon={<CheckOutlined />}
        >
          Phê duyệt
        </Button>
      )}
      {order.orderStatus === 1 && (
        <Button
          type="default"
          onClick={() => showConfirm("ship", order.orderID)}
          className="ml-2"
          icon={<CarOutlined />}
        >
          Giao hàng
        </Button>
      )}
      {order.orderStatus !== 2 && order.orderStatus !== 6 && (
        <Button
          type="primary"
          onClick={() => showConfirm("complete", order.orderID)}
          className="ml-2"
          icon={<CheckCircleOutlined />}
        >
          Hoàn thành
        </Button>
      )}
      <Table
        dataSource={orderDetails}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={false}
      />
    </div>
  );
};

export default TrackingOrder;
