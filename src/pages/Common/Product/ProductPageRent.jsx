import {
  CalendarOutlined,
  DollarOutlined,
  EditOutlined,
  FolderOpenOutlined,
  InfoCircleOutlined,
  SearchOutlined,
  ShopOutlined,
  StarOutlined,
  TagOutlined,
} from "@ant-design/icons"; // Import Ant Design icons
import {
  Button,
  Card,
  Input,
  Layout,
  message,
  Pagination,
  Spin,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Import useParams
import { getCategoryById } from "../../../api/categoryApi";
import { getAllProduct, getProductByName } from "../../../api/productApi";
import { getSupplierById } from "../../../api/supplierApi";
import { getBrandName, getProductStatusEnum } from "../../../utils/constant";

const { Content } = Layout;
const { Title } = Typography;
const { Search } = Input;

const ProductPageRent = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const pageSize = 20;

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      const productData = await getAllProduct(1, 20);
      if (productData) {
        const productsWithDetails = await Promise.all(
          productData.map(async (product) => {
            const supplierData = await getSupplierById(product.supplierID);
            const categoryData = await getCategoryById(product.categoryID);

            return {
              ...product,
              supplierName:
                supplierData?.result?.items?.[0]?.supplierName || "Unknown",
              categoryName: categoryData?.result?.categoryName || "Unknown",
            };
          })
        );
        setProducts(productsWithDetails);
      } else {
        message.error("Failed to load products.");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      message.error("An error occurred while fetching products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleSearch = async (value) => {
    setLoading(true);
    setSearchTerm(value);
    try {
      const productData = await getProductByName(value, 1, 20);
      if (productData) {
        const productsWithDetails = await Promise.all(
          productData.map(async (product) => {
            const supplierData = await getSupplierById(product.supplierID);
            const categoryData = await getCategoryById(product.categoryID);

            return {
              ...product,
              supplierName:
                supplierData?.result?.items?.[0]?.supplierName || "Unknown",
              categoryName:
                categoryData?.result?.items?.[0]?.categoryName || "Unknown",
            };
          })
        );
        setProducts(productsWithDetails);
      } else {
        message.error("No products found.");
        setProducts([]);
      }
    } catch (error) {
      console.error("Error searching products:", error);
      message.error("An error occurred while searching for products.");
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
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
  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  const availableProducts = products.filter((product) => product.status === 1);

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
          <>
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
                    {product.depositProduct != null && (
                      <p className="font-bold text-left text-red-500">
                        <DollarOutlined className="inline mr-1" />
                        Giá Cọc:
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(product.depositProduct)}
                      </p>
                    )}
                    {product.pricePerHour != null && (
                      <p className="font-bold text-left text-green-500">
                        <DollarOutlined className="inline mr-1" />
                        Giá thuê:
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(product.pricePerHour)}
                        /giờ
                      </p>
                    )}
                    {product.pricePerDay != null && (
                      <p className="font-bold text-left text-green-500">
                        <DollarOutlined className="inline mr-1" />
                        Giá thuê:
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(product.pricePerDay)}
                        /ngày
                      </p>
                    )}
                    {product.pricePerWeek != null && (
                      <p className="font-bold text-left text-green-500">
                        <DollarOutlined className="inline mr-1" />
                        Giá thuê:
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(product.pricePerWeek)}
                        /tuần
                      </p>
                    )}
                    {product.pricePerMonth != null && (
                      <p className="font-bold text-left text-green-500">
                        <DollarOutlined className="inline mr-1" />
                        Giá thuê:
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(product.pricePerMonth)}
                        /tháng
                      </p>
                    )}
                    {product.priceBuy != null && (
                      <p className="font-bold text-left text-green-500">
                        <DollarOutlined className="inline mr-1" />
                        Giá mua:
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(product.priceBuy)}
                      </p>
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
                      <ShopOutlined className="inline mr-1" />
                      <strong>Nhà cung cấp:</strong> {product.supplierName}
                    </p>
                    <p className="text-left">
                      <FolderOpenOutlined className="inline mr-1" />
                      <strong>Danh mục:</strong> {product.categoryName}
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
            <div className="flex justify-center mt-6">
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={totalProducts}
                onChange={onPageChange}
                showSizeChanger={false}
              />
            </div>
          </>
        )}
      </Content>
    </Layout>
  );
};

export default ProductPageRent;
