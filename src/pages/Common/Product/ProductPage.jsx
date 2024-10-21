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
import { useNavigate } from "react-router-dom";
import {
  getAllProduct,
  getProductByCategoryName,
  getProductByName,
} from "../../../api/productApi"; // Ensure this path is correct

const { Content } = Layout;
const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Function to load products
  const loadProducts = async () => {
    setLoading(true);
    try {
      const productData = await getAllProduct(1, 20); // Fetch products with default pagination
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
    loadProducts(); // Load products when the component mounts
  }, []);

  const handleSearch = async (value) => {
    setLoading(true);
    setSearchTerm(value);
    try {
      const productData = await getProductByName(value, 1, 20); // Add pageIndex and pageSize
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
      const productData = await getProductByCategoryName(value, 1, 20); // Add pageIndex and pageSize
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

  const handleClearSearch = () => {
    setSearchTerm("");
    setCategory("");
    loadProducts(); // Reload products when clearing search
  };

  const handleCreateOrderRent = (product) => {
    message.success(`Order for renting ${product.productName} created!`);
  };

  const handleCreateOrderBuy = (product) => {
    navigate("/create-order-buy", { state: { product } });
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
            value={category}
          >
            <Option value="">All Categories</Option>
            <Option value="Canon">Canon</Option>
            <Option value="Nikon">Nikon</Option>
            <Option value="Sony">Sony</Option>
            <Option value="Fujifilm">Fujifilm</Option>
            <Option value="Olympus">Olympus</Option>
            <Option value="Panasonic">Panasonic</Option>
            <Option value="Leica">Leica</Option>
            <Option value="Pentax">Pentax</Option>
            <Option value="Hasselblad">Hasselblad</Option>
            <Option value="Sigma">Sigma</Option>
          </Select>

          <Search
            className="w-1/4"
            placeholder="Search for products"
            enterButton
            value={searchTerm}
            onSearch={handleSearch}
            onChange={(e) => setSearchTerm(e.target.value)} // Handle input change
          />
          <Button onClick={handleClearSearch} className="ml-4">
            Clear Search
          </Button>
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
                  <p className="font-semibold">Price (Rent): VND</p>
                  {product.priceRent ? product.priceRent.toFixed(2) : "N/A"}
                  <p className="font-semibold">Price (Buy): VND</p>
                  {product.priceBuy ? product.priceBuy.toFixed(2) : "N/A"}
                  <p className="font-semibold">Brand: </p>
                  {product.brand}
                  <p className="font-semibold">Quality: </p>
                  {product.quality}
                  <p className="font-semibold">
                    Status: {product.status === 1 ? "Available" : "Unavailable"}
                  </p>
                  <p className="font-semibold">Rating: </p>
                  {product.rating}
                  <p className="font-semibold">Serial Number:</p>
                  {product.serialNumber}
                  <p className="font-semibold">Supplier ID:</p>
                  {product.supplierID}
                  <p className="font-semibold">Category ID:</p>
                  {product.categoryID}
                  <p className="font-semibold">Created At:</p>
                  {new Date(product.createdAt).toLocaleString()}
                  <p className="font-semibold">Updated At:</p>
                  {new Date(product.updatedAt).toLocaleString()}
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
