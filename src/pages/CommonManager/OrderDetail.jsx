import { Card, message, Spin, Table, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getOrdersByAccount } from "../../api/orderApi";
import { getProductById } from "../../api/productApi"; // Ensure this path is correct

const { Title } = Typography;

const OrderDetail = () => {
  const [orderDetails, setOrderDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.user.user || {});
  const accountId = user.id;
  const pageIndex = 1; // Default page index
  const pageSize = 10; // Default page size

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const response = await getOrdersByAccount(
          accountId,
          pageIndex,
          pageSize
        );
        if (response && response.isSuccess) {
          const orders = response.result;

          const updatedOrders = await Promise.all(
            orders.map(async (order) => {
              const productDetails = await Promise.all(
                order.orderDetails.map(async (detail) => {
                  const product = await getProductById(detail.productID);
                  console.log(
                    "Fetched product for ID:",
                    detail.productID,
                    product.productName // Log the product name directly
                  );

                  return {
                    ...detail,
                    product: {
                      ...product.result, // Include the entire product object
                      productName:
                        product && product.isSuccess
                          ? product.result.productName // Access productName from result
                          : "Not available",
                    },
                  };
                })
              );

              return {
                ...order,
                orderDetails: productDetails,
              };
            })
          );

          setOrderDetails(updatedOrders);
        } else {
          message.error("Failed to fetch order details.");
        }
      } catch (error) {
        message.error("An error occurred while fetching order details.");
      } finally {
        setLoading(false);
      }
    };

    if (accountId) {
      fetchOrderDetails();
    }
  }, [accountId, pageIndex, pageSize]);

  if (loading) {
    return <Spin size="large" />;
  }

  return (
    <div>
      {orderDetails.length > 0 ? (
        orderDetails.map((order) => (
          <Card key={order.orderID} style={{ marginBottom: 20 }}>
            <Title level={4}>Order ID: {order.orderID}</Title>
            <p>
              <strong>Order Date:</strong>{" "}
              {new Date(order.orderDate).toLocaleString()}
            </p>
            <p>
              <strong>Total Amount:</strong> {order.totalAmount} VND
            </p>
            <p>
              <strong>Shipping Address:</strong> {order.shippingAddress}
            </p>
            <p>
              <strong>Order Status:</strong>{" "}
              {order.orderStatus === 0 ? "Pending" : "Completed"}
            </p>
            <Table
              dataSource={order.orderDetails}
              rowKey="orderDetailsID"
              pagination={false}
              columns={[
                {
                  title: "Product ID",
                  dataIndex: "productID",
                },
                {
                  title: "Product Name",
                  dataIndex: "product.productName", // Updated to use product.productName
                  render: (text) => text || "Not available",
                },
                {
                  title: "Product Price (VND)",
                  dataIndex: "productPrice",
                },
                {
                  title: "Quantity",
                  dataIndex: "productQuality",
                },
                {
                  title: "Total Price (VND)",
                  dataIndex: "productPriceTotal",
                },
              ]}
            />
          </Card>
        ))
      ) : (
        <p>No order details found.</p>
      )}
    </div>
  );
};

export default OrderDetail;
