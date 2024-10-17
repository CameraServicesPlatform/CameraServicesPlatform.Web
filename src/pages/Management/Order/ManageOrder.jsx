import {
  Button,
  Card,
  Form,
  Input,
  List,
  message,
  Spin,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import {
  cancelOrder,
  createOrder,
  getAllOrders,
  getOrdersByType,
  updateOrderStatusCompleted,
} from "../../../api/orderApi";

const { Title } = Typography;

const ManageOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderData, setOrderData] = useState({}); // Order data for new order
  const [filterType, setFilterType] = useState(""); // Order type filter

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const data = await getAllOrders(1, 10);
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        setError("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleCreateOrder = async () => {
    try {
      const newOrder = await createOrder(orderData);
      if (newOrder) {
        setOrders((prevOrders) => [...prevOrders, newOrder]);
        setOrderData({}); // Clear the order data after creating
        message.success("Order created successfully!");
      }
    } catch {
      message.error("Failed to create order.");
    }
  };

  const handleCompleteOrder = async (orderId) => {
    try {
      const updatedOrder = await updateOrderStatusCompleted(orderId);
      if (updatedOrder) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? updatedOrder : order
          )
        );
        message.success("Order marked as completed!");
      }
    } catch {
      message.error("Failed to update order status.");
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      const canceledOrder = await cancelOrder(orderId);
      if (canceledOrder) {
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order.id !== orderId)
        );
        message.success("Order canceled successfully!");
      }
    } catch {
      message.error("Failed to cancel order.");
    }
  };

  const handleFilterOrders = async () => {
    if (filterType) {
      const filteredOrders = await getOrdersByType(filterType, 0, 10);
      setOrders(Array.isArray(filteredOrders) ? filteredOrders : []);
    }
  };

  if (loading) {
    return <Spin tip="Loading orders..." />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-6 bg-gray-50">
      <Title level={2} className="mb-6 text-center">
        Manage Orders
      </Title>

      <Card className="mb-6 p-4 shadow-md">
        <Form layout="inline" onFinish={handleCreateOrder}>
          <Form.Item>
            <Input
              placeholder="Enter Order Data"
              value={orderData.orderInfo || ""}
              onChange={(e) =>
                setOrderData({ ...orderData, orderInfo: e.target.value })
              }
              className="w-64"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Create Order
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card className="mb-6 p-4 shadow-md">
        <Input
          placeholder="Filter by Type"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="w-64 mb-4 mr-2"
        />
        <Button type="default" onClick={handleFilterOrders}>
          Filter
        </Button>
      </Card>

      <List
        bordered
        dataSource={orders}
        renderItem={(order) => (
          <List.Item key={order.id}>
            <div className="flex justify-between w-full">
              <div>
                <strong>Order ID:</strong> {order.id} &nbsp;
                <strong>Status:</strong> {order.status}
              </div>
              <div>
                <Button
                  type="primary"
                  onClick={() => handleCompleteOrder(order.id)}
                  disabled={order.status === "Completed"}
                  className="ml-2"
                >
                  Complete
                </Button>
                <Button
                  type="danger"
                  onClick={() => handleCancelOrder(order.id)}
                  className="ml-2"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </List.Item>
        )}
      />
    </div>
  );
};

export default ManageOrder;
