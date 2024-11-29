import React from "react";
import { Button, Upload } from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  UploadOutlined,
} from "@ant-design/icons";

const ActionsComponent = ({
  order,
  showConfirm,
  handleReturnClick,
  returnInitiated,
  handleUploadBefore, // Add this line
  handleUploadAfter, // Add this line
}) => (
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
        icon={<CheckOutlined />}
        style={{ marginRight: 8, marginBottom: 8 }}
      >
        Chấp nhận hủy
      </Button>
    )}
    <Upload
      customRequest={({ file }) => handleUploadBefore(file)}
      showUploadList={false}
    >
      <Button
        icon={<UploadOutlined />}
        style={{ marginRight: 8, marginBottom: 8 }}
      >
        Upload Before Image
      </Button>
    </Upload>
    <Upload
      customRequest={({ file }) => handleUploadAfter(file)}
      showUploadList={false}
    >
      <Button
        icon={<UploadOutlined />}
        style={{ marginRight: 8, marginBottom: 8 }}
      >
        Upload After Image
      </Button>
    </Upload>
  </div>
);

export default ActionsComponent;
