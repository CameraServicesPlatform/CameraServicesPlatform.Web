import { Button, Modal, Spin } from "antd";
import React, { useState } from "react";
import DetailProduct from "./DetailProduct";
import EditProductForm from "./EditProductForm";

// Edit Product Modal Component
export const EditProductModal = ({
  isEditModalVisible,
  handleModalClose,
  selectedProduct,
  handleUpdateSuccess,
}) => (
  <Modal
    title="Chỉnh Sửa Sản Phẩm"
    open={isEditModalVisible}
    onCancel={handleModalClose}
    footer={null}
  >
    <EditProductForm
      visible={isEditModalVisible}
      product={selectedProduct}
      onUpdateSuccess={handleUpdateSuccess}
      onClose={handleModalClose}
    />
  </Modal>
);

// View Product Modal Component
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
    open={isModalVisible}
    onCancel={handleClose}
    footer={[
      <Button key="close" onClick={handleClose}>
        Đóng
      </Button>,
    ]}
  >
    {loading ? (
      <Spin tip="Đang tải...">
        <div style={{ minHeight: "200px" }} />
      </Spin>
    ) : (
      <DetailProduct product={selectedProduct} />
    )}
  </Modal>
);

// Main Component to manage both modals
const ProductModals = ({
  selectedProduct,
  handleUpdateSuccess,
  handleDelete,
}) => {
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleViewClose = () => {
    setIsViewModalVisible(false);
  };

  const handleEditClose = () => {
    setIsEditModalVisible(false);
  };

  const handleEdit = (product) => {
    console.log("handleEdit called with product:", product);
    setIsViewModalVisible(false);
    setIsEditModalVisible(true);
  };

  return (
    <>
      <ViewProductModal
        isModalVisible={isViewModalVisible}
        handleClose={handleViewClose}
        selectedProduct={selectedProduct}
        loading={loading}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
      <EditProductModal
        isEditModalVisible={isEditModalVisible}
        handleModalClose={handleEditClose}
        selectedProduct={selectedProduct}
        handleUpdateSuccess={handleUpdateSuccess}
      />
    </>
  );
};

export default ProductModals;
