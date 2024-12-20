import {
  AppstoreAddOutlined,
  CalendarOutlined,
  EditOutlined,
  InfoCircleOutlined,
  SearchOutlined,
  StarOutlined,
  TagOutlined,
  TeamOutlined,
} from "@ant-design/icons"; // Import Ant Design icons
import { Button, Card, Input, Layout, message, Spin, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Import useParams
import { getCategoryById } from "../../../api/categoryApi";
import {
  getAllProduct,
  getProductById,
  getProductByName,
} from "../../../api/productApi";
import { getSupplierById } from "../../../api/supplierApi";
import { getBrandName, getProductStatusEnum } from "../../../utils/constant";

const { Content } = Layout;
const { Title } = Typography;
const { Search } = Input;

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [supplierName, setSupplierName] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  const loadProducts = async () => {
    setLoading(true);
    try {
      const productData = await getAllProduct(1, 20);
      if (productData) {
        setProducts(productData);
      } else {
        message.error("Failed to load products.");
      }
    } catch (error) {
      message.error("An error occurred while fetching products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
    if (id) {
      loadProduct();
    }
  }, [id]);

  const loadProduct = async () => {
    setLoading(true);
    try {
      const data = await getProductById(id);
      if (data) {
        setProducts([data]);
        setProducts([data]);
        const supplierData = await getSupplierById(data.supplierID);
        const categoryData = await getCategoryById(data.categoryID);

        if (
          supplierData &&
          supplierData.result &&
          supplierData.result.items.length > 0
        ) {
          const supplier = supplierData.result.items[0];
          setSupplierName(supplier.supplierName);
        }

        if (
          categoryData &&
          categoryData.result &&
          categoryData.result.items.length > 0
        ) {
          const category = categoryData.result.items[0];
          setCategoryName(category.categoryName);
        }
      }
    } catch (error) {
      message.error("An error occurred while loading the product.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (value) => {
    setLoading(true);
    setSearchTerm(value);
    try {
      const productData = await getProductByName(value, 1, 20);
      if (productData) {
        setProducts(productData);
      } else {
        message.error("No products found.");
        setProducts([]);
      }
    } catch (error) {
      message.error("An error occurred while searching for products.");
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setCategory("");
    loadProducts(); // Reload products when clearing search
  };
  const getStatusColor = (status) => {
    switch (status) {
      case 0: // AvailableSell
        return "text-green-500"; // Green
      case 1: // AvailableRent
        return "text-blue-500"; // Blue
      case 2: // Rented
        return "text-yellow-500"; // Yellow
      case 3: // Sold
        return "text-red-500"; // Red
      case 4: // DiscontinuedProduct
        return "text-gray-500"; // Gray
      default:
        return "text-black"; // Default color
    }
  };
  const availableProducts = products.filter((product) => product.status === 0);

  return (
    <Layout>
      <Content className="p-6">
        <Title level={2} className="text-center mb-6 text-mainColor">
          Trang Sản Phẩm
        </Title>

        <div className="flex justify-center mb-6">
          <Search
            className="w-1/2"
            placeholder="Tìm kiếm sản phẩm"
            enterButton
            value={searchTerm}
            onSearch={handleSearch}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            }}
            suffix={<SearchOutlined />} // Add search icon
          />
          <Button
            onClick={handleClearSearch}
            className="ml-4 rounded-lg shadow-lg transition duration-200 hover:bg-gray-200"
            style={{ backgroundColor: "#f0f0f0", border: "none" }}
          >
            Xóa Tìm Kiếm
          </Button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center mt-10">
            <Spin size="large" />
            <p className="mt-4 text-lg">Đang tải sản phẩm...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableProducts.map((product) => (
              <Card
                key={product.productID}
                className="shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-200"
                cover={
                  product.listImage.length > 0 ? (
                    <img
                      src={product.listImage[0].image}
                      alt={product.productName}
                      className="w-full object-cover h-64 rounded-t-lg"
                    />
                  ) : (
                    <img
                      src="https://placehold.co/300x200"
                      alt="Placeholder for product image"
                      className="w-full object-cover h-64 rounded-t-lg"
                    />
                  )
                }
              >
                <Card.Meta
                  title={
                    <div className="flex justify-center">
                      <span className="text-lg font-semibold">
                        {product.productName}
                      </span>
                    </div>
                  }
                />
                <div className="mt-2 p-4">
                  <p className="text-gray-700 text-left">
                    {product.productDescription}
                  </p>
                  {productDetail.priceRent != null && (
                    <Descriptions.Item label="Giá (Thuê)">
                      <span style={{ color: "blue" }}>
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(productDetail.priceRent)}
                      </span>
                    </Descriptions.Item>
                  )}
                  {productDetail.priceBuy != null && (
                    <Descriptions.Item label="Giá (Mua)">
                      <span style={{ color: "green", fontWeight: "bold" }}>
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(productDetail.priceBuy)}
                      </span>
                    </Descriptions.Item>
                  )}
                  {productDetail.pricePerHour != null && (
                    <Descriptions.Item label="Giá (Thuê)/giờ">
                      <span style={{ color: "blue" }}>
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(productDetail.pricePerHour)}
                      </span>
                    </Descriptions.Item>
                  )}
                  {productDetail.pricePerDay != null && (
                    <Descriptions.Item label="Giá (Thuê)/ngày">
                      <span style={{ color: "blue" }}>
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(productDetail.pricePerDay)}
                      </span>
                    </Descriptions.Item>
                  )}
                  {productDetail.pricePerWeek != null && (
                    <Descriptions.Item label="Giá (Thuê)/tuần">
                      <span style={{ color: "blue" }}>
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(productDetail.pricePerWeek)}
                      </span>
                    </Descriptions.Item>
                  )}
                  {productDetail.pricePerMonth != null && (
                    <Descriptions.Item label="Giá (Thuê)/tháng">
                      <span style={{ color: "blue" }}>
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(productDetail.pricePerMonth)}
                      </span>
                    </Descriptions.Item>
                  )}
                  <p className="font-semibold text-left">
                    <TagOutlined className="inline mr-1" />
                    Thương hiệu: {getBrandName(product.brand)}
                  </p>
                  <p className="font-semibold text-left">
                    <InfoCircleOutlined className="inline mr-1" />
                    Chất lượng: {product.quality}
                  </p>
                  <p className="font-semibold text-left">
                    <InfoCircleOutlined className="inline mr-1" />
                    Trạng thái:
                    <span className={getStatusColor(product.status)}>
                      {getProductStatusEnum(product.status)}
                    </span>
                  </p>
                  <p className="font-semibold text-left">
                    <StarOutlined className="inline mr-1" />
                    Đánh giá: {product.rating}
                  </p>
                  <p className="font-semibold text-left">
                    <InfoCircleOutlined className="inline mr-1" />
                    Số Serial: {product.serialNumber}
                  </p>
                  <p className="text-left">
                    <TeamOutlined className="inline mr-1" />
                    <strong>Nhà cung cấp:</strong> {supplierName}
                  </p>
                  <p className="text-left">
                    <AppstoreAddOutlined className="inline mr-1" />
                    <strong>Danh mục:</strong> {categoryName}
                  </p>
                  <p className="font-semibold text-left">
                    <CalendarOutlined className="inline mr-1" />
                    Ngày tạo: {new Date(product.createdAt).toLocaleString()}
                  </p>
                  <p className="font-semibold text-left">
                    <EditOutlined className="inline mr-1" />
                    Ngày cập nhật:
                    {new Date(product.updatedAt).toLocaleString()}
                  </p>
                  <Button
                    type="primary"
                    onClick={() => navigate(`/product/${product.productID}`)}
                    className="mt-2 rounded-lg transition duration-200 hover:bg-blue-600"
                  >
                    Xem Chi Tiết
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Content>
    </Layout>
  );
};

export default ProductPage;
