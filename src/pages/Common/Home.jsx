import {
  Button,
  Card,
  Col,
  Input,
  Layout,
  Modal,
  Row,
  Spin,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import {
  getAllProduct,
  getProductByCategoryName,
  getProductById,
  getProductByName,
} from "../../api/productApi";
import { getBrandName } from "../../utils/constant";

const { Header, Content } = Layout;
const { Title } = Typography;
const { Search } = Input;

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productDetail, setProductDetail] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categorySearchTerm, setCategorySearchTerm] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      const productList = await getAllProduct(1, 100);
      setProducts(productList);
      setLoading(false);
    };

    fetchProducts();
  }, []);

  const fetchProductDetail = async (productID) => {
    const productData = await getProductById(productID, 1, 10);
    if (productData) {
      setProductDetail(productData);
      setIsModalVisible(true);
    }
  };

  const handleCardDoubleClick = (productID) => {
    fetchProductDetail(productID);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setProductDetail(null);
  };

  const handleSearchByName = async (value) => {
    setLoading(true);
    try {
      const productList = await getProductByName(value, 1, 10);
      setProducts(Array.isArray(productList) ? productList : []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    }
    setLoading(false);
  };

  const handleSearchByCategory = async (value) => {
    setLoading(true);
    try {
      const productList = await getProductByCategoryName(value, 1, 10);
      setProducts(Array.isArray(productList) ? productList : []);
    } catch (error) {
      console.error("Error fetching products by category:", error);
      setProducts([]);
    }
    setLoading(false);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setCategorySearchTerm("");
    setLoading(true);
    const fetchProducts = async () => {
      const productList = await getAllProduct(1, 100);
      setProducts(productList);
      setLoading(false);
    };
    fetchProducts();
  };

  return (
    <Layout>
      <Header>
        <Title level={2} style={{ color: "white" }}>
          Product List
        </Title>
      </Header>
      <Content style={{ padding: "20px" }}>
        <div style={{ marginBottom: "20px" }}>
          <Search
            placeholder="Search products by name"
            enterButton="Search"
            size="large"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onSearch={handleSearchByName}
            style={{ width: 300, marginRight: 20 }}
          />

          {/* <Search
            placeholder="Search products by category"
            enterButton="Search"
            size="large"
            value={categorySearchTerm}
            onChange={(e) => setCategorySearchTerm(e.target.value)}
            onSearch={handleSearchByCategory}
            style={{ width: 300 }}
          /> */}

          <Button onClick={handleClearSearch} style={{ marginLeft: 20 }}>
            Clear Search
          </Button>
        </div>
        {loading ? (
          <Spin tip="Loading products..." />
        ) : products.length > 0 ? (
          <Row gutter={16}>
            {products.map((product) => (
              <Col span={8} key={product.productID}>
                <Card
                  hoverable
                  cover={
                    product.listImage.length > 0 && (
                      <img
                        alt={product.productName}
                        src={product.listImage[0].image}
                        style={{ height: 200, objectFit: "cover" }}
                      />
                    )
                  }
                  onDoubleClick={() => handleCardDoubleClick(product.productID)}
                  style={{ marginBottom: "20px" }}
                >
                  <Card.Meta
                    title={product.productName}
                    description={
                      <div>
                        <p>{product.productDescription}</p>
                        <p>Serial Number: {product.serialNumber}</p>
                        <p>Price (Rent)/hour: VND{product.priceRent}</p>
                        <p>Price (Buy): VND{product.priceBuy}</p>
                        <p>Rating: {product.rating}</p>
                        <p>Brand: {getBrandName(product.brand)}</p>
                        <p>Quality: {product.quality}</p>
                      </div>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <p>No products found.</p>
        )}
      </Content>

      {/* Modal for showing product details */}
      <Modal
        title={productDetail?.productName || "Product Details"}
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={[
          <Button key="close" onClick={handleModalClose}>
            Close
          </Button>,
        ]}
      >
        {productDetail ? (
          <div>
            <img
              src={productDetail.listImage[0]?.image}
              alt={productDetail.productName}
              className="w-full h-64 object-cover mb-4"
            />
            <p>
              <strong>Description:</strong> {productDetail.productDescription}
            </p>
            <p>
              <strong>Price (Rent):</strong> VND{productDetail.priceRent}
            </p>
            <p>
              <strong>Price (Buy):</strong> VND{productDetail.priceBuy}
            </p>
            <p>
              <strong>Rating:</strong> {productDetail.rating}
            </p>
            <p>
              <strong>Brand:</strong> {productDetail.brand}
            </p>
            <p>
              <strong>Quality:</strong> {productDetail.quality}
            </p>
          </div>
        ) : (
          <Spin tip="Loading details..." />
        )}
      </Modal>
    </Layout>
  );
};

export default Home;
