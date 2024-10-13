import { Card, Col, Layout, Row, Spin, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { getAllProduct } from "../../api/productApi";

const { Header, Content } = Layout;
const { Title } = Typography;

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      const productList = await getAllProduct(1, 100);
      setProducts(productList);
      setLoading(false);
    };

    fetchProducts();
  }, []);

  const handleCardClick = (productID) => {
    navigate(`/product/${productID}`); // Navigate to the product detail page
  };

  return (
    <Layout>
      <Header>
        <Title level={2} style={{ color: "white" }}>
          Product List
        </Title>
      </Header>
      <Content style={{ padding: "20px" }}>
        {loading ? (
          <Spin tip="Loading products..." />
        ) : (
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
                  onClick={() => handleCardClick(product.productID)}
                  style={{ marginBottom: "20px" }}
                >
                  <Card.Meta
                    title={product.productName}
                    description={
                      <div>
                        <p>{product.productDescription}</p>
                        <p>Price (Rent): ${product.priceRent}</p>
                        <p>Price (Buy): ${product.priceBuy}</p>
                        <p>Rating: {product.rating}</p>
                      </div>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Content>
    </Layout>
  );
};

export default Home;
