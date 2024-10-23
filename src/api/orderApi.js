import api from "../api/config";

export const getOrderDetailsById = async (orderId, pageIndex, pageSize) => {
  try {
    const res = await api.get(
      `/orderDetail/get-order-details/${orderId}?pageIndex=${pageIndex}&pageSize=${pageSize}`
    );
    return res.data;
  } catch (err) {
    console.error("Error fetching order details:", err);
    return null;
  }
};
export const createOrderWithPayment = async (orderData) => {
  try {
    const res = await api.post(
      `/order/create-order-buy-with-payment`,
      orderData
    );
    return res.data;
  } catch (err) {
    console.error("Error creating order with payment:", err);
    return null;
  }
};

export const getOrdersByAccount = async (accountId, pageIndex, pageSize) => {
  try {
    const res = await api.get(
      `/order/get-order-of-account?AccountID=${accountId}&pageIndex=${pageIndex}&pageSize=${pageSize}`
    );
    return res.data;
  } catch (err) {
    console.error("Error fetching orders by account:", err);
    return null;
  }
};

export const getAllOrders = async (pageIndex, pageSize) => {
  try {
    const res = await api.get(
      `/order/get-all-order?pageIndex=${pageIndex}&pageSize=${pageSize}`
    );
    return res.data;
  } catch (err) {
    console.error("Error fetching all orders:", err);
    return null;
  }
};
export const getOrderByOrderType = async (type, pageIndex, pageSize) => {
  try {
    const res = await api.get(
      `/order/get-order-by-order-type?type=${type}&pageIndex=${pageIndex}&pageSize=${pageSize}`
    );
    return res.data;
  } catch (err) {
    console.error("Error fetching orders by type:", err);
    return null;
  }
};
export const getOrderOfSupplierId = async (supplierId, pageIndex, pageSize) => {
  try {
    const res = await api.get(
      `/order/get-order-of-supplierId?SupplierId=${supplierId}&pageIndex=${pageIndex}&pageSize=${pageSize}`
    );
    return res.data;
  } catch (err) {
    console.error("Error fetching orders of supplier:", err);
    return null;
  }
};
export const getCountOfProductRent = async (productId, pageIndex, pageSize) => {
  try {
    const res = await api.get(
      `/order/get-count-of-product-rent?productId=${productId}&pageIndex=${pageIndex}&pageSize=${pageSize}`
    );
    return res.data;
  } catch (err) {
    console.error("Error fetching count of product rentals:", err);
    return null;
  }
};

export const getOrderOfMember = async (memberId, pageIndex, pageSize) => {
  try {
    const res = await api.get(
      `/order/get-order-of-member?MemberId=${memberId}&pageIndex=${pageIndex}&pageSize=${pageSize}`
    );
    return res.data;
  } catch (err) {
    console.error("Error fetching orders of member:", err);
    return null;
  }
};
export const getOrderById = async (orderId, pageIndex, pageSize) => {
  try {
    const res = await api.get(
      `/order/get-order-by-id?OrderId=${orderId}&pageIndex=${pageIndex}&pageSize=${pageSize}`
    );
    return res.data;
  } catch (err) {
    console.error("Error fetching order by ID:", err);
    return null;
  }
};
export const createOrderBuy = async (orderData) => {
  try {
    const res = await api.post(`/order/create-order-buy`, orderData);
    return res.data;
  } catch (err) {
    console.error("Error creating order:", err);
    return null;
  }
};
export const updateOrderStatusCompleted = async (orderId) => {
  try {
    const res = await api.put(
      `/order/update-order-status-completed/${orderId}`,
      {}
    );
    return res.data;
  } catch (err) {
    console.error("Error updating order status:", err);
    return null;
  }
};
export const cancelOrder = async (orderId) => {
  try {
    const res = await api.put(
      `/order/cancel-order/${orderId}`,
      {} // Sending an empty object as the request body
    );
    return res.data;
  } catch (err) {
    console.error("Error canceling order:", err);
    return null;
  }
};
export const createOrderRent = async (orderData) => {
  try {
    const res = await api.post("/order/create-order-rent", orderData, {});
    return res.data;
  } catch (err) {
    console.error("Error creating rental order:", err);
    return null;
  }
};
