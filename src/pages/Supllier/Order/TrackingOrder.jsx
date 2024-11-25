import {
  CarOutlined,
  CheckCircleOutlined,
  CheckOutlined,
  CloseOutlined,
  SmileOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Button, message, Modal, Steps, Table, Upload } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  acceptCancelOrder,
  addImgProductAfter,
  addImgProductBefore,
  cancelOrder,
  updateOrderStatusApproved,
  updateOrderStatusCompleted,
  updateOrderStatusPendingRefund,
  updateOrderStatusPlaced,
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
  const [beforeImageUrl, setBeforeImageUrl] = useState(null);
  const [afterImageUrl, setAfterImageUrl] = useState(null);

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

  const handleUploadBefore = async (file) => {
    try {
      const response = await addImgProductBefore(order.orderID, file);
      if (response?.isSuccess) {
        message.success("Ảnh đã được thêm trước khi giao hàng!");
        setBeforeImageUrl(URL.createObjectURL(file)); // Update the state with the image URL
      } else {
        message.error("Không thể thêm ảnh trước khi giao hàng.");
      }
    } catch (error) {
      message.error("Lỗi khi thêm ảnh trước khi giao hàng.");
    }
  };

  const handleUploadAfter = async (file) => {
    try {
      const response = await addImgProductAfter(order.orderID, file);
      if (response?.isSuccess) {
        message.success("Ảnh đã được thêm sau khi giao hàng!");
        setAfterImageUrl(URL.createObjectURL(file)); // Update the state with the image URL
      } else {
        message.error("Không thể thêm ảnh sau khi giao hàng.");
      }
    } catch (error) {
      message.error("Lỗi khi thêm ảnh sau khi giao hàng.");
    }
  };

  const handlePendingRefund = async (orderId) => {
    try {
      const response = await updateOrderStatusPendingRefund(orderId);
      if (response?.isSuccess) {
        message.success("Đơn hàng đã được cập nhật trạng thái chờ hoàn tiền!");
        onUpdate(orderId, 9);
      } else {
        message.error("Không thể cập nhật trạng thái chờ hoàn tiền.");
      }
    } catch (error) {
      message.error("Lỗi khi cập nhật trạng thái chờ hoàn tiền.");
    }
  };
  const handleUpdateOrderStatusPlaced = async (orderId) => {
    try {
      const response = await updateOrderStatusPlaced(orderId);
      if (response?.isSuccess) {
        message.success("Đơn hàng đã được cập nhật trạng thái 'Placed'!");
        onUpdate(orderId, 1); // Assuming 1 is the status for 'Placed'
      } else {
        message.error("Không thể cập nhật trạng thái 'Placed'.");
      }
    } catch (error) {
      message.error("Lỗi khi cập nhật trạng thái 'Placed'.");
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
          case "upload-before":
            document.getElementById("uploadBeforeInput").click();
            break;
          case "upload-after":
            document.getElementById("uploadAfterInput").click();
            break;
          case "pending-refund":
            handlePendingRefund(orderId);
            break;
          case "update-placed":
            handleUpdateOrderStatusPlaced(orderId);
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
      title: "Đợi khách hàng đến nhận",
      status: 1,
      icon: <SmileOutlined />,
      action: "ship",
    },
    {
      title: "Đang vận chuyện sản phẩm",
      status: 1,
      icon: <CarOutlined />,
      action: "ship",
    },
    {
      title: "Hoàn thành",
      status: [3, 4],
      icon: <CheckCircleOutlined />,
      action: "complete",
    },
    {
      title: "Chờ hoàn tiền",
      status: [2, 7],
      icon: <CheckCircleOutlined />,
      action: "pending-refund",
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
      title: "Thời gian trả",
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
        {order.orderStatus === 1 && order.deliveriesMethod === 1 && (
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
            Kết thúc đơn thuê
          </Button>
        )}
        {(order.orderStatus === 4 || returnInitiated) && (
          <Button
            type="primary"
            onClick={() => showConfirm("pending-refund", order.orderID)}
            className="ml-2"
            icon={<CheckCircleOutlined />}
            style={{ marginRight: 8, marginBottom: 8 }}
          >
            Gửi yêu cầu hoàn tiền cho hệ thống
          </Button>
        )}
        {order.orderStatus === 7 && (
          <Button
            type="primary"
            onClick={() => showConfirm("pending-refund", order.orderID)}
            className="ml-2"
            icon={<CheckCircleOutlined />}
            style={{ marginRight: 8, marginBottom: 8 }}
          >
            Gửi yêu cầu hoàn tiền cho hệ thống
          </Button>
        )}
        {order.orderStatus === 1 &&
          order.deliveriesMethod === 0 &&
          order.orderType === 1 && (
            <Button
              type="primary"
              onClick={() => showConfirm("update-placed", order.orderID)}
              className="ml-2"
              icon={<CheckCircleOutlined />}
              style={{ marginRight: 8, marginBottom: 8 }}
            >
              Khách đã đến nhận hàng
            </Button>
          )}
        {order.orderStatus === 1 && (
          <Upload
            customRequest={({ file }) => handleUploadBefore(file)}
            showUploadList={false}
          >
            <Button
              icon={<UploadOutlined />}
              style={{ marginRight: 8, marginBottom: 8 }}
            >
              Thêm ảnh trước khi giao hàng
            </Button>
          </Upload>
        )}
        {order.orderStatus === 4 && order.orderType === 1 && (
          <Upload
            customRequest={({ file }) => handleUploadAfter(file)}
            showUploadList={false}
          >
            <Button
              icon={<UploadOutlined />}
              style={{ marginRight: 8, marginBottom: 8 }}
            >
              Thêm ảnh sau khi giao hàng
            </Button>
          </Upload>
        )}
      </div>
      {beforeImageUrl && (
        <div>
          <h3>Ảnh trước khi giao hàng:</h3>
          <img
            src={beforeImageUrl}
            alt="Before Delivery"
            style={{ maxWidth: "100%" }}
          />
        </div>
      )}
      {afterImageUrl && (
        <div>
          <h3>Ảnh sau khi giao hàng:</h3>
          <img
            src={afterImageUrl}
            alt="After Delivery"
            style={{ maxWidth: "100%" }}
          />
        </div>
      )}
      <Table
        dataSource={orderDetails}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={false}
        style={{ marginTop: 16 }}
      />
      <input
        type="file"
        id="uploadBeforeInput"
        style={{ display: "none" }}
        onChange={(e) => handleUploadBefore(e.target.files[0])}
      />
      <input
        type="file"
        id="uploadAfterInput"
        style={{ display: "none" }}
        onChange={(e) => handleUploadAfter(e.target.files[0])}
      />
    </div>
  );
};

export default TrackingOrder;
