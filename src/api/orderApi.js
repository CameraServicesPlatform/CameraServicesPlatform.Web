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
      "/order/create-order-buy-with-payment",
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

export const getOrderOfAccount = async (AccountID, pageIndex, pageSize) => {
  try {
    const res = await api.get(
      `/order/get-order-of-account?AccountID=${AccountID}&pageIndex=${pageIndex}&pageSize=${pageSize}`
    );
    return res.data;
  } catch (err) {
    console.error("Error fetching orders of account:", err);
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
    if (err.response && err.response.status === 400) {
      console.error("Validation error occurred:", err.response.data);
      // Handle validation errors here
    } else {
      console.error("Error creating order:", err);
    }
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
export const updateOrderStatusShipped = async (orderId) => {
  try {
    const response = await api.put(
      `/order/update-order-status-Shipped/${orderId}`,
      {
        headers: {
          accept: "text/plain",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating order status to Shipped:", error);
    return (
      error.response?.data || {
        isSuccess: false,
        messages: ["Error updating order status"],
      }
    );
  }
};

export const purchaseOrder = async (orderId) => {
  try {
    const response = await api.post(`/order/purchase-order/${orderId}`, "");
    return response.data;
  } catch (error) {
    console.error("Error purchasing order:", error);
    return (
      error.response?.data || {
        isSuccess: false,
        messages: ["Error purchasing order"],
      }
    );
  }
};
export const acceptCancelOrder = async (orderId) => {
  try {
    const res = await api.put(
      `/order/accept-cancel-order/${orderId}`,
      {},
      {
        headers: {
          accept: "text/plain",
        },
      }
    );
    return res.data;
  } catch (err) {
    console.error("Error accepting order cancellation:", err);
    return (
      err.response?.data || {
        isSuccess: false,
        messages: ["Error accepting order cancellation"],
      }
    );
  }
};
export const createOrderRentWithPayment = async (orderData) => {
  try {
    const res = await api.post(
      "/order/create-order-rent-with-payment",
      orderData
    );
    return res.data;
  } catch (err) {
    console.error("Error creating rental order with payment:", err);
    return null;
  }
};
export const updateOrderStatusPlaced = async (orderId) => {
  try {
    const res = await api.put(
      `/order/update-order-status-placed/${orderId}`,
      {},
      {
        headers: {
          accept: "text/plain",
        },
      }
    );
    return res.data;
  } catch (err) {
    console.error("Error updating order status to placed:", err);
    return (
      err.response?.data || {
        isSuccess: false,
        messages: ["Error updating order status to placed"],
      }
    );
  }
};
export const updateOrderStatusPendingRefund = async (orderId) => {
  try {
    const response = await api.put(
      `/order/update-order-status-pending-refund/${orderId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error updating order status to pending refund:", error);
    throw error;
  }
};

// Function to update order status to refund
export const updateOrderStatusRefund = async (orderId) => {
  try {
    const response = await api.put(
      `/order/update-order-status-refund/${orderId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error updating order status to refund:", error);
    throw error;
  }
};

// Function to update order status to deposit refund
export const updateOrderStatusDepositRefund = async (orderId) => {
  try {
    const response = await api.put(
      `/order/update-order-status-deposit-refund/${orderId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error updating order status to deposit refund:", error);
    throw error;
  }
};
export const updateOrderStatusApproved = async (orderId) => {
  try {
    const response = await api.put(
      `/order/update-order-status-Approved/${orderId}`,
      {},
      {
        headers: {
          accept: "text/plain",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating order status to Approved:", error);
    return (
      error.response?.data || {
        isSuccess: false,
        messages: ["Error updating order status"],
      }
    );
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
export const addImgProductAfter = async (orderId, imgFile) => {
  const formData = new FormData();
  formData.append("OrderID", orderId);
  formData.append("Img", imgFile);

  try {
    const response = await api.post("/order/add-img-product-after", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding image to product after:", error);
    return (
      error.response?.data || {
        isSuccess: false,
        messages: ["Error adding image to product after"],
      }
    );
  }
};

export const addImgProductBefore = async (orderId, imgFile) => {
  const formData = new FormData();
  formData.append("OrderID", orderId);
  formData.append("Img", imgFile);

  try {
    const response = await api.post("/order/add-img-product-before", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding image to product before:", error);
    return (
      error.response?.data || {
        isSuccess: false,
        messages: ["Error adding image to product before"],
      }
    );
  }
};
