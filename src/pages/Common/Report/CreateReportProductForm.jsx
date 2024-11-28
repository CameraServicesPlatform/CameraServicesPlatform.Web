import { message } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getOrderDetailsById, getOrdersByAccount } from "../../../api/orderApi";
import { formatDateTime, formatPrice } from "../../../utils/util"; // Assuming you have these utility functions

const CreateReportProductForm = () => {
  const user = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [data, setData] = useState([]);
  const [supplierMap, setSupplierMap] = useState({});

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      console.log("Fetching orders for user ID:", user.id);
      const response = await getOrdersByAccount(user.id, 1, 100);
      console.log("API response:", response);
      if (response.isSuccess) {
        setOrders(response.result || []);
      } else {
        message.error("Failed to fetch orders.");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      message.error("An error occurred, please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrderDetails = async (id) => {
    try {
      setIsLoading(true);
      const response = await getOrderDetailsById(id, 1, 100); // Adjust pageSize as needed
      if (response.isSuccess) {
        setData(response.result || []);
      } else {
        message.error("Failed to fetch order details.");
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      message.error("An error occurred, please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClick = (order) => {
    fetchOrderDetails(order.orderID);
  };

  const renderOrderItems = (order) => (
    <tr
      key={order.orderID}
      className={
        order.orderStatus === 1 && order.deliveryMethod === 0
          ? "bg-yellow-100"
          : "cursor-pointer hover:bg-gray-50 transition-colors"
      }
      onClick={() => handleClick(order)}
    >
      <td className="py-3 px-4 border-b">{order.orderID}</td>
      <td className="py-3 px-4 border-b">
        <div>
          <strong>Tên nhà cung cấp:</strong>
          {supplierMap[order.supplierID]?.supplierName || " "}
        </div>
        <div>
          <strong>Địa chỉ:</strong>
          {supplierMap[order.supplierID]?.supplierAddress || " "}
        </div>
        <div>
          <strong>Mô tả:</strong>
          {supplierMap[order.supplierID]?.supplierDescription || " "}
        </div>
        <div>
          <strong>Số điện thoại liên hệ:</strong>
          {supplierMap[order.supplierID]?.contactNumber || ""}
        </div>
      </td>
      <td className="py-3 px-4 border-b">
        <StatusBadge status={order.orderStatus} map={orderStatusMap} />
      </td>
      <td className="py-3 px-4 border-b hidden md:table-cell">
        {order.shippingAddress}
      </td>
      <td className="py-3 px-4 border-b hidden lg:table-cell">
        <StatusBadge status={order.deliveriesMethod} map={deliveryStatusMap} />
      </td>
      <td className="py-3 px-4 border-b">
        <StatusBadge status={order.orderType} map={orderTypeMap} />
      </td>
      <td className="py-3 px-4 border-b hidden sm:table-cell">
        {formatDateTime(order.orderDate)}
      </td>
      <td className="py-3 px-4 border-b">{formatPrice(order.totalAmount)}</td>
    </tr>
  );

  useEffect(() => {
    if (user?.id) fetchOrders();
  }, [user]);

  return (
    <div>
      <h1>Create Report Product Form</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Supplier Info</th>
              <th>Status</th>
              <th>Shipping Address</th>
              <th>Delivery Method</th>
              <th>Order Type</th>
              <th>Order Date</th>
              <th>Total Amount</th>
            </tr>
          </thead>
          <tbody>{orders.map(renderOrderItems)}</tbody>
        </table>
      )}
    </div>
  );
};

export default CreateReportProductForm;
