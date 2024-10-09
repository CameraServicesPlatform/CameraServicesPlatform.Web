import { Button, Card, Input, Layout, message, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux"; // Import useDispatch
import { getAllProduct, getProductByName } from "../../../api/productApi"; // Adjust the import path as needed
import { addToCart } from "../../../redux/features/cartSlice"; // Import addToCart action

const { Content } = Layout;
const { Search } = Input;
const { Title, Paragraph } = Typography;

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;
  const [searchFilter, setSearchFilter] = useState("");
  const dispatch = useDispatch(); // Initialize dispatch

  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      console.log("Fetching products...");
      const data = await getAllProduct(currentPage, itemsPerPage);
      console.log("Received data:", data);
      if (data && data.result) {
        setProducts(data.result);
        setTotalItems(data.result.length || 0);
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
      if (data && data.result) {
        setProducts(data.result);
        setTotalItems(data.result.length || 0);
        setSearchFilter(value);
      } else {
        message.error("No products found.");
      }
    } catch (error) {
      console.error("Error searching products:", error);
      message.error("An error occurred while searching for products.");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleAddToCart = (product) => {
    // Dispatch the addToCart action with the product data
    dispatch(addToCart(product)); // Ensure product object has an 'id' field
    console.log(`Added to cart: ${product.productName}`);
    message.success(`${product.productName} has been added to the cart!`);
  };

  if (loading) {
    return <div>Loading...</div>;
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
      <Title level={2}>Products</Title>
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
                    <Button
                      type="primary"
                      onClick={() => handleAddToCart(item.product)} // Call handleAddToCart
                      style={{ marginTop: "10px" }}
                    >
                      Thêm vào giỏ hàng
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
