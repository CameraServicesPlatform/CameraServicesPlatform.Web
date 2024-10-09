import { Card, Layout, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { getAllProduct } from "../../api/productApi";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";

const { Header, Content } = Layout;
const { Title, Paragraph } = Typography;

const Home = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const logoSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    cssEase: "linear",
    arrows: true,
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getAllProduct(1, 100);
      if (data && data.isSuccess) {
        setProducts(data.result);
      } else {
        setError("Failed to fetch products");
      }
    } catch (err) {
      setError("An error occurred while fetching products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) return <LoadingComponent />;
  if (error) return <div>{error}</div>;

  return (
    <>
      <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <div className="text-lg font-bold">CameraServicePlatform</div>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <a href="may-anh" className="hover:underline">
                Camera
              </a>
            </li>
            <li>
              <a href="lens" className="hover:underline">
                Lens
              </a>
            </li>
            <li>
              <a href="phu-kien" className="hover:underline">
                Accessory
              </a>
            </li>
          </ul>
        </nav>
      </header>

      <Content style={{ padding: "20px" }}>
        <Title level={2}>Đề xuất</Title>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
          {products.map((item) => (
            <Card
              key={item.product.productID}
              hoverable
              style={{ width: 240 }}
              cover={
                <img
                  alt={item.product.productName}
                  src={item.listImage[0]?.image || "/placeholder-image.png"}
                />
              }
            >
              <Card.Meta
                title={item.product.productName}
                description={
                  <>
                    <Paragraph>{item.product.productDescription}</Paragraph>
                    <Paragraph
                      strong
                    >{`Price: $${item.product.priceBuy}`}</Paragraph>
                    <Paragraph>{`Rating: ${item.product.rating}`}</Paragraph>
                  </>
                }
              />
            </Card>
          ))}
        </div>
      </Content>
    </>
  );
};

export default Home;
