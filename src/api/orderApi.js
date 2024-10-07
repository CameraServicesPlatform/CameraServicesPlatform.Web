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
    const response = await api.put(`/order/update-status?orderId=${id}`);
    return response.data;
  } catch (error) {}
};
