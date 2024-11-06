import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import {
  Button,
  Input,
  message,
  Modal,
  Pagination,
  Table,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getSupplierIdByAccountId } from "../../../api/accountApi";
import { getCategoryById } from "../../../api/categoryApi"; // Import the API for fetching category by ID
import {
  deleteProduct,
  getProductById,
  getProductBySupplierId,
} from "../../../api/productApi";
import { getBrandName, getProductStatusEnum } from "../../../utils/constant";
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
  const [categoryNames, setCategoryNames] = useState({}); // Store category names keyed by ID
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { id } = useParams(); // Assume `id` is passed via URL parameters

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

  // Handle product deletion
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

  // Handle product edit modal visibility and product update
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

  // Search and filter products
  const filteredProducts = Array.isArray(products)
    ? products.filter((product) =>
        product.productName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const getStatusClass = (status) => {
    switch (status) {
      case 0:
        return "text-green-500 text-sm font-bold"; // For Sale
      case 1:
        return "text-blue-500 text-sm font-bold"; // For Rent
      case 2:
        return "text-orange-500 text-sm font-bold"; // Rented Out
      case 3:
        return "text-red-500 text-sm font-bold"; // Sold
      case 4:
        return "text-gray-500 text-sm font-bold"; // Unavailable
      default:
        return "text-gray-400 text-sm font-bold"; // Default case
    }
  };

  // Hàm lấy nhãn và màu sắc cho giá cả
  const getPriceLabelAndStyle = (price) => {
    if (price === null) return { color: "#888" };
    if (price > 100000) return { color: "red" };
    if (price > 50000) return { color: "orange" };
    return { color: "green" };
  };

  // Hàm render cho giá thuê
  const renderPriceRent = (priceRent, record) => {
    const priceLabels = {
      rent: getPriceLabelAndStyle(priceRent),
      hour: getPriceLabelAndStyle(record.pricePerHour),
      day: getPriceLabelAndStyle(record.pricePerDay),
      week: getPriceLabelAndStyle(record.pricePerWeek),
      month: getPriceLabelAndStyle(record.pricePerMonth),
    };

    return (
      <div>
        {priceRent !== null && (
          <span style={{ color: priceLabels.rent.color }}>
            {priceRent} VND - {priceLabels.rent.label}
          </span>
        )}
        {record.pricePerHour && (
          <div style={{ color: priceLabels.hour.color }}>
            (Theo Giờ: {record.pricePerHour} VND - {priceLabels.hour.label})
          </div>
        )}
        {record.pricePerDay && (
          <div style={{ color: priceLabels.day.color }}>
            (Theo Ngày: {record.pricePerDay} VND - {priceLabels.day.label})
          </div>
        )}
        {record.pricePerWeek && (
          <div style={{ color: priceLabels.week.color }}>
            (Theo Tuần: {record.pricePerWeek} VND - {priceLabels.week.label})
          </div>
        )}
        {record.pricePerMonth && (
          <div style={{ color: priceLabels.month.color }}>
            (Theo Tháng: {record.pricePerMonth} VND - {priceLabels.month.label})
          </div>
        )}
        {Object.values(record).every((val) => val === null) && (
          <span>Không có</span>
        )}
      </div>
    );
  };

  // Hàm render cho giá bán
  const renderPriceBuy = (priceBuy) => (
    <span
      style={{
        fontWeight: "bold",
        color: priceBuy !== null ? "#007bff" : "#888",
      }}
    >
      {priceBuy !== null ? `${priceBuy} VND` : "Không có"}
    </span>
  );

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

  // Định nghĩa các cột
  const columns = [
    {
      title: "Mã Sản Phẩm",
      dataIndex: "productID",
      sorter: (a, b) => a.productID - b.productID,
    },
    {
      title: "Số Serial",
      dataIndex: "serialNumber",
      sorter: (a, b) => a.serialNumber.localeCompare(b.serialNumber),
    },
    {
      title: "Mã Nhà Cung Cấp",
      dataIndex: "supplierID",
      sorter: (a, b) => a.supplierID - b.supplierID,
    },
    {
      title: "Tên Loại Hàng",
      dataIndex: "categoryID",
      render: (categoryID) => categoryNames[categoryID] || "Không xác định",
      sorter: (a, b) =>
        (categoryNames[a.categoryID] || "").localeCompare(
          categoryNames[b.categoryID] || ""
        ),
    },
    {
      title: "Tên Sản Phẩm",
      dataIndex: "productName",
      sorter: (a, b) => a.productName.localeCompare(b.productName),
    },
    {
      title: "Mô Tả",
      dataIndex: "productDescription",
    },
    {
      title: "Giá (Thuê)",
      dataIndex: "priceRent",
      render: renderPriceRent,
      sorter: (a, b) => a.priceRent - b.priceRent,
    },
    {
      title: "Giá (Bán)",
      dataIndex: "priceBuy",
      render: renderPriceBuy,
      sorter: (a, b) => a.priceBuy - b.priceBuy,
    },
    {
      title: "Thương Hiệu",
      dataIndex: "brand",
      render: (brand) => getBrandName(brand),
      sorter: (a, b) =>
        getBrandName(a.brand).localeCompare(getBrandName(b.brand)),
    },
    {
      title: "Chất Lượng",
      dataIndex: "quality",
      sorter: (a, b) => a.quality.localeCompare(b.quality),
    },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      render: (status) => (
        <span className={getStatusClass(status)}>
          {getProductStatusEnum(status)}
        </span>
      ),
      sorter: (a, b) => a.status - b.status,
    },
    {
      title: "Đánh Giá",
      dataIndex: "rating",
      sorter: (a, b) => a.rating - b.rating,
    },
    {
      title: "Ngày Tạo",
      dataIndex: "createdAt",
      render: (createdAt) => new Date(createdAt).toLocaleString(),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: "Ngày Cập Nhật",
      dataIndex: "updatedAt",
      render: (updatedAt) => new Date(updatedAt).toLocaleString(),
      sorter: (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt),
    },
    {
      title: "Danh Sách Ảnh",
      dataIndex: "listImage",
      render: (listImage, record) => (
        <img
          src={
            listImage && listImage.length > 0
              ? listImage[0].image
              : "https://via.placeholder.com/100?text=No+Image"
          }
          alt={record.productName}
          width="100"
        />
      ),
    },
    {
      title: "Hành Động",
      render: (text, record) => (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            type="default"
            icon={<EyeOutlined />} // Eye icon for view
            onClick={() => handleView(record.productID)}
            style={{ marginRight: "8px" }}
          >
            Xem
          </Button>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            style={{ marginRight: "8px" }}
          ></Button>
          <Button
            type="danger"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.productID)}
          ></Button>
        </div>
      ),
    },
  ];

  const handleClose = () => {
    setIsModalVisible(false);
    setSelectedProduct(null); // Clear selected product
  };

  return (
    <div>
      <Title level={2}>Product List</Title>

      {/* Search Box */}
      <Input
        placeholder="Search by product name"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ marginBottom: "20px", width: "300px" }}
      />

      {loading ? (
        <p>Loading products...</p>
      ) : (
        <div>
          {filteredProducts.length > 0 ? (
            <>
              <Table
                dataSource={filteredProducts}
                columns={columns}
                rowKey="productID"
                pagination={false}
                bordered
              />
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
