import {
  CarOutlined,
  CheckCircleOutlined,
  CheckOutlined,
  CloseOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import { message, Modal, Table } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { getAllExtendsByOrderId, getExtendById } from "../../../api/extendApi";
import {
  acceptCancelOrder,
  addImgProductAfter,
  addImgProductBefore,
  cancelOrder,
  getImageProductAfterByOrderId,
  getImageProductBeforeByOrderId,
  updateOrderStatusApproved,
  updateOrderStatusCompleted,
  updateOrderStatusPendingRefund,
  updateOrderStatusPlaced,
  updateOrderStatusShipped,
} from "../../../api/orderApi";
import { getOrderDetails } from "../../../api/orderDetailApi";
import CreateReturnDetailForm from "../ReturnDetail/CreateReturnDetailForm";
import ActionsComponent from "./TrackingOrder/ActionsComponent";
import ImagesComponent from "./TrackingOrder/ImagesComponent";
import OrderDetailsTable from "./TrackingOrder/OrderDetailsTable";
import StepsComponent from "./TrackingOrder/StepsComponent";

const TrackingOrder = ({ order, onUpdate }) => {
  const [orderDetails, setOrderDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReturnDetailForm, setShowReturnDetailForm] = useState(false);
  const [selectedOrderID, setSelectedOrderID] = useState(null);
  const [returnInitiated, setReturnInitiated] = useState(false);
  const [beforeImageUrl, setBeforeImageUrl] = useState(null);
  const [afterImageUrl, setAfterImageUrl] = useState(null);
  const [extendsData, setExtendsData] = useState([]);

  useEffect(() => {
    const fetchImages = async (orderId) => {
      try {
        const beforeImageResponse = await getImageProductBeforeByOrderId(
          orderId
        );
        const afterImageResponse = await getImageProductAfterByOrderId(orderId);

        if (beforeImageResponse) {
          setBeforeImageUrl(beforeImageResponse.result);
        } else {
          message.error("Failed to fetch before image.");
        }

        if (afterImageResponse) {
          setAfterImageUrl(afterImageResponse.result);
        } else {
          message.error("Failed to fetch after image.");
        }
      } catch (error) {
        message.error("Error fetching images.");
      }
    };

    if (order?.orderID) {
      fetchImages(order.orderID);
    }
  }, [order]);

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

    const fetchImages = async () => {
      try {
        const beforeImage = await getImageProductBeforeByOrderId(order.orderID);
        const afterImage = await getImageProductAfterByOrderId(order.orderID);
        setBeforeImageUrl(beforeImage?.url || null);
        setAfterImageUrl(afterImage?.url || null);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    if (order) {
      fetchOrderDetails();
      fetchImages();
    }
  }, [order]);

  useEffect(() => {
    if (order?.orderID) {
      fetchExtendsByOrderId(order.orderID);
    }
  }, [order]);

  const fetchExtendsByOrderId = async (orderID) => {
    setLoading(true);
    try {
      const result = await getAllExtendsByOrderId(orderID);
      console.log("API response:", result);
      if (result && result.isSuccess) {
        console.log("Fetched extends data:", result.result.items);
        setExtendsData(result.result.items || []);
      } else {
        console.error("Failed to fetch extends data.");
      }
    } catch (error) {
      console.error("Error fetching extends data:", error);
    } finally {
      setLoading(false);
    }
  };

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
      title: "Đợi khách hàng trả hàng",
      status: [12, 3],
      icon: <SmileOutlined />,
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

  const extendColumns = [
    {
      title: "Mã gia hạn",
      dataIndex: "extendId",
      key: "extendId",
    },
    {
      title: "Mã đơn hàng",
      dataIndex: "orderID",
      key: "orderID",
    },
    {
      title: "Đơn vị thời gian",
      dataIndex: "durationUnit",
      key: "durationUnit",
      render: (text) => {
        switch (text) {
          case 0:
            return "Giờ";
          case 1:
            return "Ngày";
          case 2:
            return "Tuần";
          case 3:
            return "Tháng";
          default:
            return text;
        }
      },
    },
    {
      title: "Giá trị thời gian",
      dataIndex: "durationValue",
      key: "durationValue",
    },
    {
      title: "Ngày trả gia hạn",
      dataIndex: "extendReturnDate",
      key: "extendReturnDate",
      render: (text) => moment(text).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Ngày bắt đầu gia hạn",
      dataIndex: "rentalExtendStartDate",
      key: "rentalExtendStartDate",
      render: (text) => moment(text).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Ngày kết thúc gia hạn",
      dataIndex: "rentalExtendEndDate",
      key: "rentalExtendEndDate",
      render: (text) => moment(text).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Tổng số tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (text) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(text),
    },
  ];

  const orderDetailsColumns = [
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

  const handleExtendClick = async (extendID) => {
    const result = await getExtendById(extendID);
    if (result) {
      console.log("Extend data:", result);
    } else {
      console.error("Failed to fetch extend data.");
    }
  };

  return (
    <div>
      <StepsComponent currentStep={currentStep} steps={steps} />
      <ActionsComponent
        order={order}
        showConfirm={showConfirm}
        handleReturnClick={handleReturnClick}
        handleExtendClick={handleExtendClick}
        returnInitiated={returnInitiated}
        handleUploadBefore={handleUploadBefore}
        handleUploadAfter={handleUploadAfter}
      />
      <ImagesComponent
        beforeImageUrl={beforeImageUrl}
        afterImageUrl={afterImageUrl}
      />
      <OrderDetailsTable
        orderDetails={orderDetails}
        columns={orderDetailsColumns}
        loading={loading}
      />
      {order.orderStatus === 12 && (
        <Table
          columns={extendColumns}
          dataSource={extendsData}
          rowKey="extendId"
          pagination={false}
        />
      )}
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
    </div>
  );
};

export default TrackingOrder;
