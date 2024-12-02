import React from "react";
import { Modal } from "antd";
import TrackingOrder from "../TrackingOrder";

const TrackingRentModal = ({
  isVisible,
  order,
  handleClose,
  handleUpdateOrderStatus,
}) => (
  <Modal
    title="Theo dõi đơn hàng"
    open={isVisible}
    onCancel={handleClose}
    footer={null}
    width="80%"
    style={{ top: 20 }}
    bodyStyle={{ maxHeight: "80vh", overflowY: "auto" }}
  >
    {order && (
      <TrackingOrder order={order} onUpdate={handleUpdateOrderStatus} />
    )}
  </Modal>
);

export default TrackingRentModal;
