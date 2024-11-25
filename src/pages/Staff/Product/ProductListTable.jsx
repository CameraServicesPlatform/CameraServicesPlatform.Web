import { message, Pagination, Typography } from "antd";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import HandleSearchAndFilter from "./HandleSearchFilter"; // Import the HandleSearchAndFilter component
import ProductTable from "./ProductTable"; // Import the ProductTable component
import ProductDetailsModal from "./ProductDetailsModal"; // Import the ProductDetailsModal component
import useFetchProducts from "./useFetchProducts"; // Import the custom hook

const { Title } = Typography;

const ProductListTable = () => {
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [expandedDescriptions, setExpandedDescriptions] = useState({}); // Track expanded descriptions
  const [filteredProducts, setFilteredProducts] = useState([]); // Track filtered products
  const { id } = useParams(); // Assume `id` is passed via URL parameters

  const { products, loading, total, categoryNames } = useFetchProducts(
    pageIndex,
    pageSize
  );

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
    setLoading(true);
    try {
      const fetchedProduct = await getProductById(productID);
      setSelectedProduct(fetchedProduct);
      setIsModalVisible(true); // Show the modal after fetching the product
    } catch (error) {
      message.error("Hệ thống loading sản phẩm bị lỗi, vui lòng quay lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const handleExpandDescription = (productId) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  return (
    <div>
      <Title level={2}>DANH SÁCH SẢN PHẨM</Title>

      <HandleSearchAndFilter
        products={products}
        onFilter={setFilteredProducts}
      />

      {loading ? (
        <p>Hệ thống đang loading sản phẩm</p>
      ) : (
        <div>
          {filteredProducts.length > 0 ? (
            <>
              <ProductTable
                products={filteredProducts}
                categoryNames={categoryNames}
                expandedDescriptions={expandedDescriptions}
                handleExpandDescription={handleExpandDescription}
                handleView={handleView}
                handleDelete={handleDelete}
              />
              <Pagination
                total={total}
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

      <ProductDetailsModal
        isModalVisible={isModalVisible}
        handleClose={handleModalClose}
        selectedProduct={selectedProduct}
        loading={loading}
      />
    </div>
  );
};

export default ProductListTable;
