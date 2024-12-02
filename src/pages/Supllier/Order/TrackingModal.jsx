import React from "react";
import { Modal } from "antd";
import TrackingOrder from "./TrackingOrder";

const TrackingModal = ({
  isTrackingModalVisible,
  handleCloseTrackingModal,
  selectedOrder,
  handleUpdateOrderStatus,
}) => {
  return (
    <Modal
      title="Theo dõi đơn hàng"
      open={isTrackingModalVisible}
      onCancel={handleCloseTrackingModal}
      footer={null}
      width="80%"
      style={{ top: 20 }}
      styles={{ body: { maxHeight: "80vh", overflowY: "auto" } }}
    >
      {selectedOrder && (
        <TrackingOrder
          order={selectedOrder}
          onUpdate={handleUpdateOrderStatus}
        />
      )}
    </Modal>
  );
};

export default TrackingModal;
