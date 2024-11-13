
import { Button, Card, List, message, Typography, Spin, Empty } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getProductById } from "../../../api/productApi"; // Import getProductById function
import {
  deleteWishlistItem,
  getWishlistByAccountId,
} from "../../../api/wishlistApi"; // Import necessary functions
import { Link } from "react-router-dom";

const { Title } = Typography;

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = useSelector((state) => state.user.user || {});
  const accountId = user.id;

  useEffect(() => {
    const fetchWishlist = async () => {
      setLoading(true);
      try {
        const data = await getWishlistByAccountId(accountId);
        if (data && data.isSuccess) {
          const itemsWithDetails = await Promise.all(
            data.result.items.map(async (item) => {
              const product = await getProductById(item.productID);
              return {
                ...item,
                productName: product.productName,
                productDescription: product.productDescription,
                price: product.priceBuy || product.priceRent,
                productImage: product.imageUrls[0],
                productSlug: product.slug,
              };
            })
          );
          setWishlist(itemsWithDetails);
        } else {
          message.error("Failed to load wishlist.");
        }
      } catch (error) {
        console.error("Error fetching wishlist:", error);
        message.error("Error fetching wishlist.");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [accountId]);

  const handleDeleteWishlistItem = async (wishlistId) => {
    console.log("Deleting wishlist", wishlistId);
    try {
      const result = await deleteWishlistItem(wishlistId);
      if (result && result.isSuccess) {
        message.success("Wishlist item deleted successfully!");
        setWishlist(wishlist.filter((item) => item.wishlistID !== wishlistId));
      } else {
        message.error("Failed to delete wishlist item.");
      }
    } catch (error) {
      console.error("Error deleting wishlist item:", error);
      message.error("Failed to delete wishlist item.");
    }
  };

  const handleAddToCart = (productId) => {
    // Implement add to cart functionality
  };

  return (
    <div className="wishlist-container">
      <Title level={2}>My Wishlist</Title>
      {loading ? (
        <div className="loading-spinner">
          <Spin size="large" />
        </div>
      ) : wishlist.length === 0 ? (
        <Empty description="No items in your wishlist" />
      ) : (
        <List
          grid={{ gutter: 16, column: 4 }}
          dataSource={wishlist}
          renderItem={(item) => (
            <List.Item>
              <Card
                title={
                  <Link to={`/product/${item.productSlug}`}>{item.productName}</Link>
                }
                extra={
                  <>
                    <Button
                      type="primary"
                      onClick={() => handleAddToCart(item.productID)}
                      style={{ marginRight: 8 }}
                    >
                      Add to Cart
                    </Button>
                    <Button
                      type="danger"
                      onClick={() => handleDeleteWishlistItem(item.wishlistID)}
                    >
                      Delete
                    </Button>
                  </>
                }
                hoverable
                cover={<img alt={item.productName} src={item.productImage} />}
              >
                <Card.Meta
                  description={
                    <>
                      <p>{item.productDescription}</p>
                      <p>
                        <strong>Price:</strong> {item.price}
                      </p>
                    </>
                  }
                />
              </Card>
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default Wishlist;