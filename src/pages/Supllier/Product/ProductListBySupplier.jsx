import { Col, Input, message, Pagination, Row, Typography } from "antd";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import LoadingComponent from "../../../components/LoadingComponent/LoadingComponent";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [isLoading, setIsLoading] = useState(false); // Add this line

  const handleDelete = async (productId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (confirmed) {
      try {
        await deleteProduct(productId);
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product.productID !== productId)
        );
        message.success("Product deleted successfully.");
      } catch (error) {
        message.error("Failed to delete product.");
      }
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setIsEditModalVisible(true);
  };

  const handleUpdateSuccess = (updatedProduct) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.productID === updatedProduct.productID
          ? updatedProduct
          : product
      )
    );
  };

  const handleModalClose = () => {
    setIsEditModalVisible(false);
    setSelectedProduct(null);
  };

  const handleView = async (productID) => {
    setIsLoading(true); // Update this line
    try {
      const fetchedProduct = await getProductById(productID);
      setSelectedProduct(fetchedProduct);
      setIsModalVisible(true);
    } catch (error) {
      message.error("Failed to fetch product details.");
    } finally {
      setIsLoading(false); // Update this line
    }
  };

  const handleClose = () => {
    setIsModalVisible(false);
    setSelectedProduct(null);
  };

  const handleExpandDescription = (productId) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  const filteredProducts = Array.isArray(products)
    ? products.filter((product) =>
        product.productName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div>
      <Title level={2}>DANH SÁCH SẢN PHẨM </Title>
      <Input
        placeholder="Tìm kiếm theo tên sản phẩm"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ marginBottom: "20px", width: "300px" }}
      />
      <LoadingComponent isLoading={isLoading} title="Đang tải dữ liệu..." />{" "}
      {/* Add this line */}
      {loading ? (
        <p>Loading products...</p>
      ) : (
        <div>
          {filteredProducts.length > 0 ? (
            <>
              <Row gutter={[16, 16]}>
                {filteredProducts.map((product) => (
                  <Col key={product.productID} xs={24} sm={12} md={8} lg={6}>
                    <ProductCard
                      product={product}
                      categoryNames={categoryNames}
                      handleExpandDescription={handleExpandDescription}
                      expandedDescriptions={expandedDescriptions}
                      handleView={handleView}
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
            </>
          ) : (
            <p>No products available.</p>
          )}
        </div>
      )}
      <EditProductModal
        isEditModalVisible={isEditModalVisible}
        handleModalClose={handleModalClose}
        selectedProduct={selectedProduct}
        handleUpdateSuccess={handleUpdateSuccess}
      />
      <ViewProductModal
        isModalVisible={isModalVisible}
        handleClose={handleClose}
        selectedProduct={selectedProduct}
        loading={loading}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default ProductListBySupplier;
