import {
  Button,
  Card,
  Carousel,
  Col,
  Input,
  Layout,
  Modal,
  Pagination,
  Row,
  Typography,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import { getCategoryById } from "../../../api/categoryApi";
import {
  getAllProduct,
  getProductById,
  getProductByName,
} from "../../../api/productApi";
import { getSupplierById } from "../../../api/supplierApi";
import LoadingComponent from "../../../components/LoadingComponent/LoadingComponent"; // Import your custom loading spinner

const brandNames = {
  1: "Canon",
  2: "Nikon",
  3: "Sony",
  4: "Fujifilm",
  5: "Olympus",
  6: "Panasonic",
  7: "Leica",
  8: "Pentax",
  9: "Hasselblad",
  10: "Sigma",
  11: "Others",
};

const { Header, Content } = Layout;
const { Title } = Typography;
const { Search } = Input;

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productDetail, setProductDetail] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // Set items per page
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalProducts = products.length;
  const [supplierName, setSupplierName] = useState("");
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const productList = await getAllProduct(1, 100);
        setProducts(productList);
      } catch (error) {
        message.error("Có lỗi xảy ra khi tải danh sách sản phẩm.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const fetchProductDetail = async (productID) => {
    setLoading(true);
    try {
      const data = await getProductById(productID);
      if (data) {
        setProductDetail(data);
        // Fetch supplier and category information
        const supplierData = await getSupplierById(data.supplierID, 1, 1);
        const categoryData = await getCategoryById(data.categoryID);

        if (supplierData?.result?.items.length > 0) {
          setSupplierName(supplierData.result.items[0].supplierName);
        }

        if (categoryData?.result?.items.length > 0) {
          setCategoryName(categoryData.result.items[0].categoryName);
        }
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi tải chi tiết sản phẩm.");
    } finally {
      setLoading(false);
      setIsModalVisible(true);
    }
  };

  const handleCardDoubleClick = (productID) => {
    fetchProductDetail(productID);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setProductDetail(null);
    setSupplierName("");
    setCategoryName("");
  };

  const handleSearchByName = async (value) => {
    setLoading(true);
    try {
      const productList = await getProductByName(value, 1, 10);
      setProducts(Array.isArray(productList) ? productList : []);
      setCurrentPage(1); // Reset to the first page when searching
    } catch (error) {
      console.error("Error fetching products:", error);
      message.error("Có lỗi xảy ra khi tìm kiếm sản phẩm.");
      setProducts([]);
    }
    setLoading(false);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setLoading(true);
    const fetchProducts = async () => {
      try {
        const productList = await getAllProduct(1, 100);
        setProducts(productList);
      } catch (error) {
        message.error("Có lỗi xảy ra khi tải danh sách sản phẩm.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  };

  return (
    <Layout>
      <LoadingComponent isLoading={loading} />
      <Header>
        <Title level={2} style={{ color: "white" }}>
          Danh Sách Sản Phẩm
        </Title>
      </Header>
      <Content style={{ padding: "20px" }}>
        <Carousel autoplay style={{ marginBottom: "20px" }}></Carousel>

        <div style={{ marginBottom: "20px" }}>
          <Search
            placeholder="Tìm kiếm sản phẩm theo tên"
            enterButton="Tìm kiếm"
            size="large"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onSearch={handleSearchByName}
            style={{ width: 300, marginRight: 20 }}
          />
          <Button onClick={handleClearSearch} style={{ marginLeft: 20 }}>
            Xóa Tìm Kiếm
          </Button>
        </div>

        {!loading && currentProducts.length > 0 ? (
          <>
            <Row gutter={16}>
              {currentProducts.map((product) => (
                <Col span={6} key={product.productID}>
                  <Card
                    hoverable
                    cover={
                      product.listImage.length > 0 && (
                        <img
                          alt={product.productName}
                          src={product.listImage[0].image}
                          style={{ height: 150, objectFit: "cover" }}
                          loading="lazy"
                        />
                      )
                    }
                    onDoubleClick={() =>
                      handleCardDoubleClick(product.productID)
                    }
                    style={{ marginBottom: "20px", height: "100%" }}
                  >
                    <Card.Meta
                      title={product.productName}
                      description={
                        <div>
                          <p>{product.productDescription}</p>
                          <p>Serial Number: {product.serialNumber}</p>
                          {product.priceRent != null && (
                            <p>Giá (Thuê)/giờ: VND{product.priceRent}</p>
                          )}
                          {product.priceBuy != null && (
                            <p>Giá (Mua): VND{product.priceBuy}</p>
                          )}
                          <p>
                            Đánh giá:{" "}
                            {Array.from({ length: 5 }, (_, index) => (
                              <span
                                key={index}
                                style={{
                                  color:
                                    index < product.rating
                                      ? "yellow"
                                      : "lightgray",
                                  fontSize: "20px",
                                }}
                              >
                                {index < product.rating ? "★" : "☆"}
                              </span>
                            ))}
                          </p>
                          <p>
                            Thương hiệu:{" "}
                            {brandNames[product.brand] || "Không xác định"}
                          </p>
                          <p>Chất lượng: {product.quality}</p>
                        </div>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>
            {/* Pagination */}
            <Pagination
              current={currentPage}
              pageSize={itemsPerPage}
              total={totalProducts}
              onChange={(page) => setCurrentPage(page)}
              style={{ marginTop: "20px", textAlign: "center" }}
            />
          </>
        ) : (
          !loading && <p>Không tìm thấy sản phẩm nào.</p>
        )}
      </Content>
      <Modal
        title={productDetail?.productName || "Chi tiết sản phẩm"}
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={[
          <Button key="close" onClick={handleModalClose}>
            Đóng
          </Button>,
        ]}
      >
        {productDetail ? (
          <div>
            <img
              src={productDetail.listImage[0]?.image}
              alt={productDetail.productName}
              className="w-full h-64 object-cover mb-4"
              loading="lazy"
            />
            <p>
              <strong>Mô tả:</strong> {productDetail.productDescription}
            </p>
            {productDetail.priceRent != null && (
              <p>
                <strong>Giá (Thuê):</strong> VND{productDetail.priceRent}
              </p>
            )}
            {productDetail.priceBuy != null && (
              <p>
                <strong>Giá (Mua):</strong> VND{productDetail.priceBuy}
              </p>
            )}
            <p>
              <strong>Nhà cung cấp:</strong> {supplierName || "Không xác định"}
            </p>
            <p>
              <strong>Danh mục:</strong> {categoryName || "Không xác định"}
            </p>
          </div>
        ) : (
          <p>Đang tải chi tiết sản phẩm...</p>
        )}
      </Modal>
    </Layout>
  );
};

export default ProductList;
