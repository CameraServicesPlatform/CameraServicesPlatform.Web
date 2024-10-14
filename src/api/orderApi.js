import api from "../api/config";

export const createOrderWithPament = async (order) => {
  try {
    const res = await api.post(`/order/create-order-with-payment`, order);
    return res.data;
  } catch (err) {
    return null;
  }
};
export const getAllOrderByAccountId = async (id, pageNumber, pageSize) => {
  try {
    const response = await api.get(
      `/order/get-all-order-by-accountId/${id}/${pageNumber}/${pageSize}`
    );
    return response.data;
  } catch (error) {}
};
export const getAllOrderDetailsByOrderId = async (id, pageNumber, pageSize) => {
  try {
    const response = await api.get(
      `/order/get-all-order-detail-by-order-id/${id}/${pageNumber}/${pageSize}`
    );
    return response.data;
  } catch (error) {}
};
export const purchaseOrder = async (id) => {
  try {
    const response = await api.post(`/order/purchase-order/${id}`);
    return response.data;
  } catch (error) {}
};

export const updateStatusOrder = async (id) => {
  try {
    const response = await api.put(`/update-status?orderId=${id}`);
    return response.data;
  } catch (error) {}
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
    const res = await api.post(`/order/create-order-buy`, orderData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
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
      {}, // Sending an empty object as the request body
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
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
      {}, // Sending an empty object as the request body
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  } catch (err) {
    console.error("Error canceling order:", err);
    return null;
  }
};
