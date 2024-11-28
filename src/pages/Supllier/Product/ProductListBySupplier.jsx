import { Button, Input, message, Modal, Pagination, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getSupplierIdByAccountId } from "../../../api/accountApi";
import { getCategoryById } from "../../../api/categoryApi";
import {
  deleteProduct,
  getProductById,
  getProductBySupplierId,
} from "../../../api/productApi";
import CreateProduct from "./CreateProduct"; // Import CreateProduct
import DetailProduct from "./DetailProduct";
import EditProductForm from "./EditProductForm";
import ProductCard from "./ManageProductCard/ProductCard";

const { Title } = Typography;

const ProductListBySupplier = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const user = useSelector((state) => state.user.user || {});
  const [supplierId, setSupplierId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [categoryNames, setCategoryNames] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const { id } = useParams();
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false); // State for create modal

  useEffect(() => {
    const fetchSupplierId = async () => {
      if (user.id) {
        try {
          const response = await getSupplierIdByAccountId(user.id);
          if (response?.isSuccess) {
            setSupplierId(response.result);
          } else {
            message.error("Failed to fetch supplier ID.");
          }
        } catch (error) {
          message.error("Error fetching supplier ID.");
        }
      }
    };

    fetchSupplierId();
  }, [user]);

  const fetchProducts = async () => {
    if (!supplierId) return;

    setLoading(true);
    try {
      const result = await getProductBySupplierId(
        supplierId,
        pageIndex,
        pageSize
      );
      if (Array.isArray(result)) {
        setProducts(result);
        setTotal(result.totalCount || 0);

        const categoryPromises = result.map(async (product) => {
          if (product.categoryID) {
            const categoryResponse = await getCategoryById(product.categoryID);
            if (categoryResponse?.isSuccess) {
              setCategoryNames((prev) => ({
                ...prev,
                [product.categoryID]: categoryResponse.result.categoryName,
              }));
            }
          }
        });
        await Promise.all(categoryPromises);
      } else {
        message.error("Unable to fetch products.");
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
      message.error("Error fetching products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (supplierId) {
      fetchProducts();
    }
  }, [supplierId, pageIndex, pageSize]);

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

  const filteredProducts = Array.isArray(products)
    ? products.filter((product) =>
        product.productName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleView = async (productID) => {
    setLoading(true);
    try {
      const fetchedProduct = await getProductById(productID);
      setSelectedProduct(fetchedProduct);
      setIsModalVisible(true);
    } catch (error) {
      message.error("Failed to fetch product details.");
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

  const handleClose = () => {
    setIsModalVisible(false);
    setSelectedProduct(null);
  };
  const showCreateModal = () => {
    setIsCreateModalVisible(true);
  };

  const handleCreateModalCancel = () => {
    setIsCreateModalVisible(false);
  };
  return (
    <div>
      <Button type="primary" onClick={showCreateModal}>
        Tạo sản phẩm mới
      </Button>
      <Modal
        title="Tạo sản phẩm mới"
        visible={isCreateModalVisible}
        onCancel={handleCreateModalCancel}
        footer={null}
      >
        <CreateProduct />
      </Modal>
      <Title level={2}>DANH SÁCH SẢN PHẨM</Title>

      <Input
        placeholder="Tìm kiếm theo tên sản phẩm"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-5 w-72"
      />

      {loading ? (
        <p>Loading products...</p>
      ) : (
        <div>
          {filteredProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.productID}
                    product={product}
                    categoryNames={categoryNames}
                    handleView={handleView}
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                    handleExpandDescription={handleExpandDescription}
                    expandedDescriptions={expandedDescriptions}
                  />
                ))}
              </div>
              <Pagination
                total={total}
                showSizeChanger
                onShowSizeChange={(current, size) => {
                  setPageSize(size);
                }}
                className="mt-5 text-center"
              />
            </>
          ) : (
            <p>No products available.</p>
          )}
        </div>
      )}

      {isEditModalVisible && (
        <EditProductForm
          visible={isEditModalVisible}
          onClose={handleModalClose}
          product={selectedProduct}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}
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
    </div>
  );
};

export default ProductListBySupplier;
