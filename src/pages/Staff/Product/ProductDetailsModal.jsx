import { Modal } from "antd";
import React from "react";
import DetailAllProduct from "./DetailAllProduct";

const ProductDetailsModal = ({
  isModalVisible,
  handleClose,
  selectedProduct,
  loading,
}) => {
  return (
    <Modal
      title="Chi Tiết Sản Phẩm"
      visible={isModalVisible}
      onCancel={handleClose}
      footer={null}
    >
      <DetailAllProduct
        product={selectedProduct}
        loading={loading}
        onClose={handleClose}
      />
    </Modal>
  );
};

export default ProductDetailsModal;
