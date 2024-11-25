import { Modal } from "antd";
import React from "react";
import DetailProduct from "./DetailProduct";
import EditProductForm from "./EditProductForm";

export const EditProductModal = ({
  isEditModalVisible,
  handleModalClose,
  selectedProduct,
  handleUpdateSuccess,
}) =>
  isEditModalVisible && (
    <EditProductForm
      visible={isEditModalVisible}
      onClose={handleModalClose}
      product={selectedProduct}
      onUpdateSuccess={handleUpdateSuccess}
    />
  );

export const ViewProductModal = ({
  isModalVisible,
  handleClose,
  selectedProduct,
  loading,
}) => (
  <Modal
    title="Chi Tiết Sản Phẩm"
    visible={isModalVisible}
    onCancel={handleClose}
    footer={null}
  >
    <DetailProduct
      product={selectedProduct}
      loading={loading}
      onClose={handleClose}
    />
  </Modal>
);
