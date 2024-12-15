import { EditOutlined, EyeOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Input, message, Modal, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getSupplierIdByAccountId } from "../../../api/accountApi";
import { getCategoryById } from "../../../api/categoryApi"; // Import the API for fetching category by ID
import {
  getProductById,
  getProductBySupplierId,
} from "../../../api/productApi";
import { getBrandName } from "../../../utils/constant";
import CreateProduct from "./CreateProduct/";
import DetailProduct from "./DetailProduct";
import EditProductForm from "./EditProductForm";
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
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const { id } = useParams();

  // Fetch supplier ID on component mount
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

  // Fetch products based on supplier ID, page index, and page size
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

        if (result.totalCount === 50) {
          alert("The system has helped you paginate.");
        }
        // Fetch category names for each product
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
        await Promise.all(categoryPromises); // Wait for all category fetches to complete
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
      message.error("Failed to fetch product details.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsModalVisible(false);
    setSelectedProduct(null); // Clear selected product
  };

  const handleCreateProduct = () => {
    setIsCreateModalVisible(true);
  };

  const handleCreateModalClose = () => {
    setIsCreateModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const filteredProducts = Array.isArray(products)
    ? products.filter((product) =>
        product.productName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const getStatusClass = (status) => {
    switch (status) {
      case 0:
        return "bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300"; // For Sale
      case 1:
        return "bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300"; // For Rent
      case 2:
        return "bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300"; // Rented Out
      case 3:
        return "bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300"; // Sold
      case 4:
        return "bg-gray-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300"; // Unavailable
      default:
        return "bg-gray-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300"; // Default case
    }
  };

  const renderPriceRent = (priceRent, record) => {
    const priceLabels = {
      hour: record.pricePerHour,
      day: record.pricePerDay,
      week: record.pricePerWeek,
      month: record.pricePerMonth,
    };

    return (
      <div>
        {record.pricePerHour !== null && record.pricePerHour !== 0 && (
          <span style={{ marginRight: "10px" }}>
            <strong>Giờ:</strong> {record.pricePerHour} VND
          </span>
        )}
        {record.pricePerDay !== null && record.pricePerDay !== 0 && (
          <span style={{ marginRight: "10px" }}>
            <strong>Ngày:</strong> {record.pricePerDay} VND
          </span>
        )}
        {record.pricePerWeek !== null && record.pricePerWeek !== 0 && (
          <span style={{ marginRight: "10px" }}>
            <strong>Tuần:</strong> {record.pricePerWeek} VND
          </span>
        )}
        {record.pricePerMonth !== null && record.pricePerMonth !== 0 && (
          <span style={{ marginRight: "10px" }}>
            <strong>Tháng:</strong> {record.pricePerMonth} VND
          </span>
        )}
        {Object.values(priceLabels).every(
          (val) => val === null || val === 0
        ) && <span>--</span>}
      </div>
    );
  };

  const renderPriceBuy = (priceBuy) => (
    <span
      style={{
        fontWeight: "bold",
        color: priceBuy !== null && priceBuy !== 0 ? "#007bff" : "#888",
      }}
    >
      {priceBuy !== null && priceBuy !== 0 ? `${priceBuy} VND` : "--"}
    </span>
  );

  const renderProductCard = (product) => (
    <a
      href="#"
      className="relative flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100"
    >
      <img
        className="object-cover w-full rounded-t-lg h-40 md:h-auto md:w-48 md:rounded-none md:rounded-l-lg"
        src={
          product.listImage && product.listImage.length > 0
            ? product.listImage[0].image
            : "https://via.placeholder.com/100?text=No+Image"
        }
        alt={product.productName}
      />
      <div className="flex flex-col justify-between p-2 leading-normal">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
          {product.productName}
        </h5>
        <p className="mb-3 font-normal text-gray-700">
          <strong>Danh mục: </strong> {categoryNames[product.categoryID]}
        </p>
        <p className="mb-3 font-normal text-gray-700">
          <strong>Thương hiệu:</strong>
          {getBrandName(product.brand)}
        </p>
        <p className="mb-3 font-normal text-gray-700">
          <strong>Giá: </strong>
          {renderPriceBuy(product.priceBuy)}
        </p>
        <p className="mb-3 font-normal text-gray-700">
          <strong>Giá thuê: </strong>
          {renderPriceRent(product.pricePerHour, product)}
        </p>

        <p className="mb-3 font-normal text-gray-700">
          <strong>Chất lượng: </strong>
          {product.quality}
        </p>
        <p className="mb-3 font-normal text-gray-700">
          {product.rating ? (
            <span>
              {"★".repeat(product.rating)}
              {"☆".repeat(5 - product.rating)}
            </span>
          ) : (
            " "
          )}
        </p>
        <div className="flex mt-4 md:mt-6">
          <Button
            type="default"
            icon={<EyeOutlined />}
            onClick={() => handleView(product.productID)}
            style={{
              marginRight: "8px",
              backgroundColor: "#1890ff",
              color: "#fff",
              borderColor: "#1890ff",
            }}
          >
            Xem
          </Button>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(product)}
            style={{
              marginRight: "8px",
              backgroundColor: "#52c41a",
              color: "#fff",
              borderColor: "#52c41a",
            }}
          >
            Sửa
          </Button>
        </div>
      </div>
      <div
        className={`absolute top-0 left-0 m-2 p-1 ${getStatusClass(
          product.status
        )}`}
      >
        {product.status === 0 && "Đang bán"}
        {product.status === 1 && "Cho thuê"}
        {product.status === 2 && "Đã cho thuê"}
        {product.status === 3 && "Đã bán"}
        {product.status === 4 && "Không có sẵn"}
      </div>
    </a>
  );

  return (
    <div>
      <Title level={2}>DANH SÁCH SẢN PHẨM</Title>

      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Input
          placeholder="Search by product name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: "300px" }}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreateProduct}
          style={{
            backgroundColor: "#52c41a",
            color: "#fff",
            borderColor: "#52c41a",
          }}
        >
          Thêm sản phẩm
        </Button>
      </div>

      {loading ? (
        <p>Loading products...</p>
      ) : (
        <div>
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProducts.map((product) => renderProductCard(product))}
            </div>
          ) : (
            <p>No products available.</p>
          )}
        </div>
      )}

      {/* Create Product Modal */}
      <Modal
        title="Create Product"
        visible={isCreateModalVisible}
        onCancel={handleCreateModalClose}
        footer={null}
      >
        <CreateProduct onClose={handleCreateModalClose} />
      </Modal>

      {/* Edit Product Modal */}
      {isEditModalVisible && (
        <EditProductForm
          visible={isEditModalVisible}
          onClose={handleModalClose}
          product={selectedProduct}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}
      <Modal
        title="Product Details"
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
