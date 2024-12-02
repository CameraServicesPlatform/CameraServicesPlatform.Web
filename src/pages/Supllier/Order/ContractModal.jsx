import React from "react";
import { Modal } from "antd";
import ContractOrder from "../Contract/ContractOrder";

const ContractModal = ({
  contractModalVisible,
  handleCloseContractModal,
  selectedOrder,
}) => {
  return (
    <Modal
      title="Hợp đồng"
      visible={contractModalVisible}
      onCancel={handleCloseContractModal}
      footer={null}
      width={800}
    >
      {selectedOrder && <ContractOrder orderID={selectedOrder.orderID} />}
    </Modal>
  );
};

export default ContractModal;
