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
import { useDispatch } from "react-redux";
import {
  getAllProduct,
  getProductByCategoryName,
  getProductByName,
} from "../../../api/productApi";
import { addToCart } from "../../../redux/features/cartSlice";

const { Content } = Layout;
const { Search } = Input;
const { Title, Paragraph } = Typography;
const { Option } = Select;

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;
  const [searchFilter, setSearchFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState(""); // New state for category filter
  const dispatch = useDispatch();

  useEffect(() => {
    fetchProducts();
  }, [currentPage, categoryFilter]); // Fetch products when category changes

  const fetchProducts = async () => {
    setLoading(true);
    try {
      console.log("Fetching products...");
      const data = categoryFilter
        ? await getProductByCategoryName(
            categoryFilter,
            currentPage,
            itemsPerPage
          )
        : await getAllProduct(currentPage, itemsPerPage);

      console.log("Received data:", data);
      if (data && data.result) {
        setProducts(data.result);
        setTotalItems(data.totalItems || 0); // Use totalItems if provided
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

  const handleSearch = async (value) => {
    setLoading(true);
    try {
      console.log(`Searching for ${value}...`);
      const data = await getProductByName(value, currentPage, itemsPerPage);
      console.log("Search results:", data);

      if (data && data.isSuccess && Array.isArray(data.result.items)) {
        setProducts(data.result.items);
        setTotalItems(data.result.totalItems || 0); // Use totalItems if available
        setSearchFilter(value);
      } else {
        message.error("No products found.");
        setProducts([]); // Reset products if no valid results
      }
    } catch (error) {
      console.error("Error searching products:", error);
      message.error("An error occurred while searching for products.");
      setProducts([]); // Reset products on error
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (value) => {
    setCategoryFilter(value);
    setCurrentPage(1); // Reset to first page on category change
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    console.log(`Added to cart: ${product.productName}`);
    message.success(`${product.productName} has been added to the cart!`);
  };

  if (loading) {
    return (
      <Spin
        tip="Loading..."
        style={{ display: "block", margin: "20px auto" }}
      />
    );
  }

  if (products.length === 0) {
    return <div>No products found.</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <Search
        placeholder="Search by product name"
        enterButton
        onSearch={handleSearch}
        style={{ marginBottom: "20px" }}
      />
      <Select
        placeholder="Filter by category"
        style={{ width: 200, marginBottom: "20px" }}
        onChange={handleCategoryChange}
      >
        {/* Replace these options with dynamic category fetching if available */}
        <Option value="">All Categories</Option>
      </Select>
      <Title level={2}>Products</Title>
      <Content style={{ padding: "20px" }}>
        <Title level={2}>Recommended</Title>
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
                    <Button
                      type="primary"
                      onClick={() => handleAddToCart(item.product)}
                      style={{ marginTop: "10px" }}
                    >
                      Add to Cart
                    </Button>
                  </>
                }
              />
            </Card>
          ))}
        </div>
        <div className="flex justify-center mt-4">
          {currentPage > 1 && (
            <button
              className="px-4 py-2 mx-1 rounded-lg bg-primary text-white"
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Previous
            </button>
          )}
          {currentPage > 2 && <span className="px-4 py-2 mx-1">..</span>}
          {[...Array(totalPages)].map((_, index) => {
            const page = index + 1;
            return (
              <button
                key={page}
                className={`px-4 py-2 mx-1 rounded-lg ${
                  currentPage === page ? "bg-primary text-white" : ""
                }`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            );
          })}
          {currentPage < totalPages - 1 && (
            <span className="px-4 py-2 mx-1">..</span>
          )}
          {currentPage < totalPages && (
            <button
              className="px-4 py-2 mx-1 rounded-lg bg-primary text-white"
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next
            </button>
          )}
        </div>
      </Content>
    </div>
  );
};

export default ProductPage;
