import {
  Button,
  Col,
  message,
  Modal,
  Pagination,
  Row,
  Select,
  Typography,
  Form,
  Input,
  Space
} from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getSupplierIdByAccountId } from "../../../api/accountApi";
import { getCategoryById } from "../../../api/categoryApi";
import {
  getProductById,
  getProductBySupplierId,
} from "../../../api/productApi";
import LoadingComponent from "../../../components/LoadingComponent/LoadingComponent";
import CreateProduct from "./CreateProduct/CreateProduct";
import DetailProduct from "./DetailProduct";
import EditProductForm from "./EditProductForm";
import HandleSearchAndFilter from "./ManageProductCard/HandleSearchAndFilter";
import ProductCard from "./ManageProductCard/ProductCard";
const { Title } = Typography;
const { Option } = Select;

const ProductListBySupplier = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const user = useSelector((state) => state.user.user || {});
  const [supplierId, setSupplierId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [categoryNames, setCategoryNames] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const { id } = useParams();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({ searchTerm: "", filter: "" });
  const [sortOrder, setSortOrder] = useState("createdAt");
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

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
  }, [supplierId, pageIndex, pageSize, sortOrder]);

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

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

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
        open={isCreateModalVisible}
        onCancel={handleCreateModalCancel}
        footer={null}
      >
        <CreateProduct
          isCreateModalVisible={isCreateModalVisible}
          handleCreateModalCancel={handleCreateModalCancel}
        />
      </Modal>

      <Title level={2}>DANH SÁCH SẢN PHẨM</Title>

      <LoadingComponent isLoading={isLoading} title="Đang tải dữ liệu..." />
      {loading ? (
        <p>Hệ thống đang loading sản phẩm</p>
      ) : (
        <div>
          <HandleSearchAndFilter
            products={products}
            onFilter={setFilteredProducts}
            onFilterChange={handleFilterChange}
          />
          <Row gutter={[16, 16]}>
            {Array.isArray(filteredProducts) &&
              filteredProducts.map((product) => (
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

      {isEditModalVisible && (
        <EditProductForm
          open={isEditModalVisible}
          onClose={handleModalClose}
          product={selectedProduct}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}
      <Modal
        title="Chi Tiết Sản Phẩm"
        open={isModalVisible}
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
