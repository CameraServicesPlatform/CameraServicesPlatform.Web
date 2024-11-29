import React from "react";
import { Button, Modal, Upload } from "antd";
import { CheckOutlined, CloseOutlined, CheckCircleOutlined, CarOutlined, UploadOutlined } from "@ant-design/icons";

const ActionsComponent = ({ order, showConfirm, handleReturnClick, returnInitiated }) => (
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
    {(order.orderStatus === 4 || (order.orderStatus === 3 && order.orderType === 1)) && (
      <Button onClick={() => handleReturnClick(order.orderID)}>
        Trả hàng
      </Button>
    )}
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
    {order.orderStatus === 1 && order.deliveriesMethod === 0 && order.orderType === 1 && (
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
);

export default ActionsComponent;