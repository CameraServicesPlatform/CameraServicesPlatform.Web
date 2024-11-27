import { Col, message, Pagination, Row, Typography } from "antd";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getProductById } from "../../../api/productApi";
import LoadingComponent from "../../../components/LoadingComponent/LoadingComponent";
import HandleSearchAndFilter from "./HandleSearchAndFilter"; // Import the HandleSearchAndFilter component
import ProductCard from "./ProductItem";
import { EditProductModal, ViewProductModal } from "./ProductModals";

import useFetchProducts from "./useFetchProducts";
const { Title } = Typography;

const ProductListBySupplier = () => {
  const user = useSelector((state) => state.user.user || {});
  const { id } = useParams();
  const {
    products,
    loading,
    pageIndex,
    pageSize,
    total,
    setPageIndex,
    setPageSize,
    categoryNames,
  } = useFetchProducts(user);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState(products);

  const handleEdit = (product) => {
    console.log("handleEdit called with product:", product);
    setSelectedProduct(product);
    setIsModalVisible(false);
    setIsEditModalVisible(true);
  };

  const handleView = async (productID) => {
    setIsLoading(true);
    try {
      const fetchedProduct = await getProductById(productID);
      setSelectedProduct(fetchedProduct);
      setIsModalVisible(true);
    } catch (error) {
      message.error("Hệ thống loading sản phẩm bị lỗi, vui lòng quay lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsModalVisible(false);
    setSelectedProduct(null);
  };

  const handleViewClose = () => {
    setIsModalVisible(false);
  };

  const handleEditClose = () => {
    setIsEditModalVisible(false);
  };

  const handleExpandDescription = (productID) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [productID]: !prev[productID],
    }));
  };
  return (
    <div>
      <Title level={2}>DANH SÁCH SẢN PHẨM</Title>

      <LoadingComponent isLoading={isLoading} title="Đang tải dữ liệu..." />
      {loading ? (
        <p>Hệ thống đang loading sản phẩm</p>
      ) : (
        <div>
          <HandleSearchAndFilter
            products={products}
            onFilter={setFilteredProducts}
          />
          <Row gutter={[16, 16]}>
            {filteredProducts.map((product) => (
              <Col key={product.productID} xs={24} sm={12} md={8} lg={6}>
                <ProductCard
                  product={product}
                  categoryNames={categoryNames}
                  handleExpandDescription={handleExpandDescription}
                  expandedDescriptions={expandedDescriptions}
                  handleView={handleView}
                  handleEdit={handleEdit}
                />
              </Col>
            ))}
          </Row>
          <Pagination
            total={filteredProducts.length}
            showSizeChanger
            onShowSizeChange={(current, size) => {
              setPageSize(size);
            }}
            style={{ marginTop: "20px", textAlign: "center" }}
          />
        </div>
      )}

      <ViewProductModal
        isModalVisible={isModalVisible}
        handleClose={handleViewClose}
        selectedProduct={selectedProduct}
        loading={loading}
        handleEdit={handleEdit}
        handleDelete={() => {}}
      />
      <EditProductModal
        isEditModalVisible={isEditModalVisible}
        handleModalClose={handleEditClose}
        handleDelete={() => {}}
        selectedProduct={selectedProduct}
        handleUpdateSuccess={() => {}}
      />
    </div>
  );
};

export default ProductListBySupplier;
