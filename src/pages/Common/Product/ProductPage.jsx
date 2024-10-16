import {
  Button,
  Card,
  Input,
  Layout,
  message,
  Select,
  Spin,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import {
  getAllProduct,
  getProductByCategoryName,
  getProductByName,
} from "../../../api/productApi";

const { Content } = Layout;
const { Search } = Input;
const { Title } = Typography;
const { Option } = Select;

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const productData = await getAllProduct(1, 20); // Adjust page size as needed
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

    loadProducts();
  }, []);

  const handleSearch = async (value) => {
    setLoading(true);
    setSearchTerm(value);
    try {
      const productData = await getProductByName(value);
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

  const handleCategoryChange = async (value) => {
    setLoading(true);
    setCategory(value);
    try {
      const productData = await getProductByCategoryName(value);
      if (productData) {
        setProducts(productData);
      } else {
        message.error("No products found in this category.");
        setProducts([]);
      }
    } catch (error) {
      message.error("An error occurred while fetching products by category.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrderRent = (product) => {
    message.success(`Order for renting ${product.productName} created!`);
  };

  const handleCreateOrderBuy = (product) => {
    message.success(`Order for buying ${product.productName} created!`);
  };

  return (
    <Layout>
      <Content className="p-6">
        <Title level={2} className="text-center mb-6 text-mainColor">
          Product Page
        </Title>

        <div className="flex justify-center mb-4">
          <Select
            className="w-1/4 mr-4"
            onChange={handleCategoryChange}
            placeholder="Select a category"
          >
            {/* Replace with actual categories */}
            <Option value=""></Option>
            <Option value="SCanon">Canon 1</Option>
            <Option value="Nikon">Nikon 2</Option>
            <Option value="Sony">Sony</Option>
            <Option value="Fujifilm">Fujifilm</Option>
            <Option value="Olympus">Olympus</Option>
            <Option value="Panasonic">Panasonic</Option>
            <Option value="Leica">Leica</Option>
            <Option value="Pentax">Pentax</Option>
            <Option value="Hasselblad">Hasselblad</Option>
            <Option value="Sigma">Sigma</Option>
            <Option value="Another">Another</Option>
          </Select>

          <Search
            className="w-1/4"
            placeholder="Search for products"
            enterButton
            onSearch={handleSearch}
          />
        </div>

        {loading ? (
          <Spin size="large" className="flex justify-center mt-10" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card
                key={product.productID}
                className="shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-200"
                cover={
                  product.listImage.length > 0 && (
                    <img
                      src={product.listImage[0].image}
                      alt={product.productName}
                      className="h-48 w-full object-cover rounded-t-lg"
                    />
                  )
                }
              >
                <Card.Meta title={product.productName} />
                <div className="mt-2">
                  <p className="text-gray-700">{product.productDescription}</p>
                  <p className="font-semibold">
                    Price (Rent): ${product.priceRent.toFixed(2)}
                  </p>
                  <p className="font-semibold">
                    Price (Buy): ${product.priceBuy.toFixed(2)}
                  </p>
                  <p className="font-semibold">Rating: {product.rating}</p>
                </div>

                <div className="flex justify-between mt-4">
                  <Button
                    type="primary"
                    onClick={() => handleCreateOrderRent(product)}
                    className="bg-mainColor hover:bg-opacity-80 transition duration-200"
                  >
                    Create Order for Rent
                  </Button>
                  <Button
                    type="default"
                    onClick={() => handleCreateOrderBuy(product)}
                    className="bg-primary text-white hover:bg-opacity-80 transition duration-200"
                  >
                    Create Order for Buy
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
