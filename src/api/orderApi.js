import api from "../api/config";

export const getAllOrders = async (pageIndex, pageSize) => {
  try {
    const res = await api.get(
      `/api/Orders/get-all-order?pageIndex=${pageIndex}&pageSize=${pageSize}`
    );
    return res.data;
  } catch (err) {
    console.error("Error fetching all orders:", err);
    return null;
  }
};
export const getOrdersByType = async (type, pageIndex, pageSize) => {
  try {
    const res = await api.get(
      `/api/Orders/get-order-by-order-type?type=${type}&pageIndex=${pageIndex}&pageSize=${pageSize}`
    );
    return res.data;
  } catch (err) {
    console.error("Error fetching orders by type:", err);
    return null;
  }
};
export const getOrdersBySupplierId = async (
  supplierId,
  pageIndex,
  pageSize
) => {
  try {
    const res = await api.get(
      `/api/Orders/get-order-of-supplierId?SupplierId=${supplierId}&pageIndex=${pageIndex}&pageSize=${pageSize}`
    );
    return res.data;
  } catch (err) {
    console.error("Error fetching orders by supplier ID:", err);
    return null;
  }
};
export const getOrdersByMemberId = async (memberId, pageIndex, pageSize) => {
  try {
    const res = await api.get(
      `/api/Orders/get-order-of-member?MemberId=${memberId}&pageIndex=${pageIndex}&pageSize=${pageSize}`
    );
    return res.data;
  } catch (err) {
    console.error("Error fetching orders by member ID:", err);
    return null;
  }
};
export const createOrder = async (orderData) => {
  try {
    const res = await api.post("/api/Orders/create-order-buy", orderData);
    return res.data;
  } catch (err) {
    console.error("Error creating order:", err);
    return null;
  }
};
export const updateOrderStatusCompleted = async (orderId) => {
  try {
    const res = await api.put(
      `/api/Orders/update-order-status-completed/${orderId}`
    );
    return res.data;
  } catch (err) {
    console.error("Error updating order status:", err);
    return null;
  }
};
export const cancelOrder = async (orderId) => {
  try {
    const res = await api.put(`/Orders/cancel-order/${orderId}`);
    return res.data;
  } catch (err) {
    console.error("Error canceling order:", err);
    return null;
  }
};
