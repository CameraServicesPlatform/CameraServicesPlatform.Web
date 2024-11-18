import {
  CarOutlined,
  CheckCircleOutlined,
  CheckOutlined,
  CloseOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import { Button, message, Modal, Steps, Table } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  acceptCancelOrder,
  cancelOrder,
  updateOrderStatusApproved,
  updateOrderStatusCompleted,
  updateOrderStatusShipped,
} from "../../../api/orderApi";
import { getOrderDetails } from "../../../api/orderDetailApi";
import CreateReturnDetailForm from "../ReturnDetail/CreateReturnDetailForm";

const { Step } = Steps;

const TrackingOrder = ({ order, onUpdate }) => {
  const [orderDetails, setOrderDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReturnDetailForm, setShowReturnDetailForm] = useState(false);
  const [selectedOrderID, setSelectedOrderID] = useState(null);
  const [returnInitiated, setReturnInitiated] = useState(false);

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

  const handleAcceptCancelOrder = async (orderId) => {
    try {
      const response = await acceptCancelOrder(orderId);
      if (response?.isSuccess) {
        message.success("Đơn hàng đã được chấp nhận hủy!");
        onUpdate(orderId, 7); // Assuming 7 is the status for accepted cancellation
      } else {
        message.error("Không thể chấp nhận hủy đơn hàng.");
      }
    } catch (error) {
      message.error("Lỗi khi chấp nhận hủy đơn hàng.");
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
          case "accept-cancel":
            handleAcceptCancelOrder(orderId);
            break;
          default:
            break;
        }
      },
    });
  };

  const steps = [
    {
      title: "Phê duyệt",
      status: 0,
      icon: <CheckOutlined />,
      action: "approve",
    },
    {
      title: "Yêu cầu hủy",
      status: 0,
      icon: <CloseOutlined />,
      action: "cancel",
    },
    {
      title: "Chấp nhận hủy",
      status: 6,
      icon: <CheckCircleOutlined />,
      action: "accept-cancel",
    },
    {
      title: "Đang vận chuyện sản phẩm",
      status: 1,
      icon: <CarOutlined />,
      action: "ship",
    },
    {
      title: "Đợi khách hàng đến nhận",
      status: 1,
      icon: <SmileOutlined />,
      action: "ship",
    },
    {
      title: "Hoàn thành",
      status: [3, 4, 5],
      icon: <CheckCircleOutlined />,
      action: "complete",
    },
  ];

  const currentStep = steps.findIndex(
    (step) =>
      step.status === order.orderStatus ||
      (Array.isArray(step.status) && step.status.includes(order.orderStatus))
  );

  // Define the columns for the Table component
  const columns = [
    {
      title: "Mã chi tiết đơn hàng",
      dataIndex: "orderDetailsID",
      key: "orderDetailsID",
    },
    {
      title: "Mã đơn hàng",
      dataIndex: "orderID",
      key: "orderID",
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Số lượng sản phẩm",
      dataIndex: "productQuality",
      key: "productQuality",
    },
    {
      title: "Tổng giá sản phẩm",
      dataIndex: "productPrice",
      key: "price",
      render: (text) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(text),
    },
    {
      title: "Tổng giá sản phẩm",
      dataIndex: "productPriceTotal",
      key: "productPriceTotal",
      render: (text) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(text),
    },
    {
      title: "Thời gian thuê",
      dataIndex: "periodRental",
      key: "periodRental",
      render: (text) => moment(text).format("DD - MM - YYYY HH:mm"),
    },
  ];

  const handleReturnClick = (orderID) => {
    setSelectedOrderID(orderID);
    setShowReturnDetailForm(true);
    setReturnInitiated(true);
  };

  return (
    <div>
      <Steps current={currentStep}>
        {steps.map((step, index) => (
          <Step key={index} title={step.title} icon={step.icon} />
        ))}
      </Steps>
      <div className="steps-action" style={{ marginTop: 16 }}>
        {(order.orderStatus === 0 || order.orderStatus === 8) && (
          <Button
            type="primary"
            onClick={() => showConfirm("approve", order.orderID)}
            className="ml-2"
            icon={<CheckOutlined />}
            style={{ marginRight: 8, marginBottom: 8 }}
          >
            Phê duyệt
          </Button>
        )}
        {(order.orderStatus === 0 || order.orderStatus === 5) && (
          <Button
            type="danger"
            onClick={() => showConfirm("cancel", order.orderID)}
            className="ml-2"
            icon={<CloseOutlined />}
            style={{ marginRight: 8, marginBottom: 8 }}
          >
            Hủy
          </Button>
        )}
        {order.orderStatus === 6 && (
          <Button
            type="primary"
            onClick={() => showConfirm("accept-cancel", order.orderID)}
            className="ml-2"
            icon={<CheckCircleOutlined />}
            style={{ marginRight: 8, marginBottom: 8 }}
          >
            Chấp nhận hủy
          </Button>
        )}
        {order.orderStatus === 1 && order.deliveryMethod === 1 && (
          <Button
            type="default"
            onClick={() => showConfirm("ship", order.orderID)}
            className="ml-2"
            icon={<CarOutlined />}
            style={{ marginRight: 8, marginBottom: 8 }}
          >
            Giao hàng
          </Button>
        )}
        {order.orderStatus === 1 && !order.shippingAddress && (
          <Button
            type="default"
            onClick={() => showConfirm("complete", order.orderID)}
            className="ml-2"
            icon={<CheckCircleOutlined />}
            style={{ marginRight: 8, marginBottom: 8 }}
          >
            Hoàn thành
          </Button>
        )}
        {(order.orderStatus === 4 ||
          (order.orderStatus === 3 && order.orderType === 1)) && (
          <Button onClick={() => handleReturnClick(order.orderID)}>
            Trả hàng
          </Button>
        )}

        <Modal
          title="Create Return Detail"
          visible={showReturnDetailForm}
          onCancel={() => setShowReturnDetailForm(false)}
          footer={null}
        >
          <CreateReturnDetailForm
            orderID={selectedOrderID}
            onSuccess={() => setShowReturnDetailForm(false)}
          />
        </Modal>
        {(order.orderStatus === 4 || returnInitiated) && (
          <Button
            type="primary"
            onClick={() => showConfirm("complete", order.orderID)}
            className="ml-2"
            icon={<CheckCircleOutlined />}
            style={{ marginRight: 8, marginBottom: 8 }}
          >
            Hoàn thành
          </Button>
        )}
      </div>
      <Table
        dataSource={orderDetails}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={false}
        style={{ marginTop: 16 }}
      />
    </div>
  );
};

export default TrackingOrder;
