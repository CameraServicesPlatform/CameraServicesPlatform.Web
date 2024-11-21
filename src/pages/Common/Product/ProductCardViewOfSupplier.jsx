import {
  ClockCircleOutlined,
  DollarOutlined,
  InfoCircleOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Empty,
  Input,
  message,
  Modal,
  Pagination,
  Row,
  Select,
  Spin,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getSupplierIdByAccountId } from "../../../api/accountApi";
import { getCategoryById } from "../../../api/categoryApi";
import {
  getProductById,
  getProductBySupplierId,
} from "../../../api/productApi";
import { getBrandName, getProductStatusEnum } from "../../../utils/constant";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const ProductCardViewOfSupplier = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const user = useSelector((state) => state.user.user || {});
  const [supplierId, setSupplierId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [categoryNames, setCategoryNames] = useState({});
  const [brandFilter, setBrandFilter] = useState(null);
  const { id } = useParams();

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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };

  const handleClose = () => {
    setIsModalVisible(false);
    setSelectedProduct(null);
  };

  const handleBrandFilterChange = (value) => {
    setBrandFilter(value);
    setPageIndex(1);
  };

  const filteredProducts = products
    .filter((product) =>
      product.productName.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((product) => (brandFilter ? product.brand === brandFilter : true));

  const startIndex = (pageIndex - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  return (
    <div className="container mx-auto px-4">
      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <Input
          placeholder="Tìm kiếm theo tên sản phẩm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: "100%", maxWidth: 300 }}
          prefix={<SearchOutlined />}
          className="mb-2 md:mb-0"
        />
        <Select
          placeholder="Filter by Brand"
          onChange={handleBrandFilterChange}
          allowClear
          style={{ width: 200 }}
          className="mt-2 md:mt-0"
        >
          <Option value="Canon">Canon</Option>
          <Option value="Nikon">Nikon</Option>
          <Option value="Sony">Sony</Option>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      ) : (
        <>
          {paginatedProducts.length > 0 ? (
            <>
              <Row gutter={[16, 16]}>
                {paginatedProducts.map((product) => (
                  <Col key={product.productID} xs={24} sm={12} md={8} lg={12}>
                    <Card
                      className="w-full flex flex-col justify-between overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 rounded-lg"
                      cover={
                        <div style={{ height: "200px", overflow: "hidden" }}>
                          <img
                            alt={product.productName}
                            src={
                              product.listImage && product.listImage.length > 0
                                ? product.listImage[0].image
                                : "https://via.placeholder.com/150?text=No+Image"
                            }
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        </div>
                      }
                    >
                      <Card.Meta
                        title={
                          <div>
                            <ShoppingCartOutlined className="mr-2" />
                            <Title level={5} className="mb-0 truncate">
                              {product.productName}
                            </Title>
                          </div>
                        }
                        description={
                          <div className="flex flex-col justify-between h-full">
                            <div className="overflow-hidden">
                              <Paragraph
                                ellipsis={{ rows: 1 }}
                                className="flex items-center"
                              >
                                <InfoCircleOutlined className="mr-2" />
                                {product.productDescription}
                              </Paragraph>
                              <Text className="flex items-center truncate">
                                <DollarOutlined className="mr-2" />
                                Giá Bán:{" "}
                                {product.priceBuy && product.priceBuy !== 0
                                  ? `${product.priceBuy} VND`
                                  : "--"}
                              </Text>
                              <Text className="flex items-center truncate">
                                <ClockCircleOutlined className="mr-2" />
                                Giá Thuê Theo Giờ:{" "}
                                {product.pricePerHour &&
                                product.pricePerHour !== 0
                                  ? `${product.pricePerHour} VND`
                                  : "--"}
                              </Text>
                              <Text className="flex items-center truncate">
                                <ClockCircleOutlined className="mr-2" />
                                Giá Thuê Theo Ngày:{" "}
                                {product.pricePerDay &&
                                product.pricePerDay !== 0
                                  ? `${product.pricePerDay} VND`
                                  : "--"}
                              </Text>
                              <Text className="flex items-center truncate">
                                <ClockCircleOutlined className="mr-2" />
                                Giá Thuê Theo Tuần:{" "}
                                {product.pricePerWeek &&
                                product.pricePerWeek !== 0
                                  ? `${product.pricePerWeek} VND`
                                  : "--"}
                              </Text>
                              <Text className="flex items-center truncate">
                                <ClockCircleOutlined className="mr-2" />
                                Giá Thuê Theo Tháng:{" "}
                                {product.pricePerMonth &&
                                product.pricePerMonth !== 0
                                  ? `${product.pricePerMonth} VND`
                                  : "--"}
                              </Text>
                              <Text className="flex items-center truncate">
                                Thương Hiệu: {getBrandName(product.brand)}
                              </Text>
                              <Text className="flex items-center truncate">
                                Trạng Thái:{" "}
                                {getProductStatusEnum(product.status)}
                              </Text>
                              <Text className="flex items-center truncate">
                                <InfoCircleOutlined className="mr-2" />
                                Ngày Tạo: {formatDate(product.createdAt)}
                              </Text>
                            </div>
                            <Button
                              type="primary"
                              onClick={() => handleView(product.productID)}
                              className="mt-2 bg-blue-600 hover:bg-blue-700 transition-colors duration-300"
                              icon={<InfoCircleOutlined />}
                            >
                              Xem Chi Tiết
                            </Button>
                          </div>
                        }
                      />
                    </Card>
                  </Col>
                ))}
              </Row>
              <Pagination
                current={pageIndex}
                pageSize={pageSize}
                total={filteredProducts.length}
                showSizeChanger
                onShowSizeChange={(current, size) => {
                  setPageSize(size);
                }}
                onChange={(page) => {
                  setPageIndex(page);
                }}
                style={{ marginTop: "20px", textAlign: "center" }}
              />
            </>
          ) : (
            <div className="flex justify-center items-center h-64">
              <Empty description="Không có sản phẩm nào" />
            </div>
          )}
        </>
      )}

      <Modal
        title={
          <div className="flex items-center">
            <InfoCircleOutlined className="mr-2" />
            Chi Tiết Sản Phẩm
          </div>
        }
        visible={isModalVisible}
        onCancel={handleClose}
        footer={[
          <Button key="close" onClick={handleClose}>
            Close
          </Button>,
        ]}
        className="rounded-lg"
      >
        {selectedProduct && (
          <div className="space-y-4">
            <Title level={3} className="flex items-center">
              <ShoppingCartOutlined className="mr-2" />
              {selectedProduct.productName}
            </Title>
            <Paragraph className="flex items-center">
              <InfoCircleOutlined className="mr-2" />
              {selectedProduct.productDescription}
            </Paragraph>
            <Text className="flex items-center">
              <DollarOutlined className="mr-2" />
              Giá Mua: {selectedProduct.priceBuy}
            </Text>
            {selectedProduct.pricePerHour && (
              <Text className="flex items-center">
                <ClockCircleOutlined className="mr-2" />
                Giá Thuê Theo Giờ: {selectedProduct.pricePerHour}
              </Text>
            )}
            {selectedProduct.pricePerDay && (
              <Text className="flex items-center">
                <ClockCircleOutlined className="mr-2" />
                Giá Thuê Theo Ngày: {selectedProduct.pricePerDay}
              </Text>
            )}
            {selectedProduct.pricePerWeek && (
              <Text className="flex items-center">
                <ClockCircleOutlined className="mr-2" />
                Giá Thuê Theo Tuần: {selectedProduct.pricePerWeek}
              </Text>
            )}
            {selectedProduct.pricePerMonth && (
              <Text className="flex items-center">
                <ClockCircleOutlined className="mr-2" />
                Giá Thuê Theo Tháng: {selectedProduct.pricePerMonth}
              </Text>
            )}
            <Text className="flex items-center">
              <InfoCircleOutlined className="mr-2" />
              Thương Hiệu: {getBrandName(selectedProduct.brand)}
            </Text>
            <Text className="flex items-center">
              <InfoCircleOutlined className="mr-2" />
              Trạng Thái: {getProductStatusEnum(selectedProduct.status)}
            </Text>
            <Text className="flex items-center">
              <InfoCircleOutlined className="mr-2" />
              Ngày Tạo: {formatDate(selectedProduct.createdAt)}
            </Text>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ProductCardViewOfSupplier;
