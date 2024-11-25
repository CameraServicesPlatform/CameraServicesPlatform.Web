import React from "react";
import { Modal, Button } from "antd";
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
  handleEdit,
  handleDelete,
}) => (
  <Modal
    title="Chi Tiết Sản Phẩm"
    visible={isModalVisible}
    onCancel={handleClose}
    footer={[
      <Button
        key="edit"
        type="primary"
        onClick={() => handleEdit(selectedProduct)}
      >
        Edit
      </Button>,
      <Button
        key="delete"
        type="danger"
        onClick={() => handleDelete(selectedProduct.productID)}
      >
        Delete
      </Button>,
      <Button key="close" onClick={handleClose}>
        Close
      </Button>,
    ]}
  >
    <DetailProduct
      product={selectedProduct}
      loading={loading}
      onClose={handleClose}
    />
  </Modal>
);

