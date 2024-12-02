import React from "react";
import { Modal } from "antd";
import ContractOrder from "../../Contract/ContractOrder";

const ContractModal = ({ isVisible, order, handleClose }) => (
  <Modal
    title="Hợp đồng"
    visible={isVisible}
    onCancel={handleClose}
    footer={null}
    width={800}
  >
    {order && <ContractOrder orderID={order.orderID} />}
  </Modal>
);

export default ContractModal;
