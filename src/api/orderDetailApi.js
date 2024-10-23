import api from "../api/config";

export const getOrderDetails = async (
  orderId,
  pageIndex = 1,
  pageSize = 10
) => {
  try {
    const response = await api.get(
      `/orderDetail/get-order-details/${orderId}`,
      {
        params: {
          pageIndex,
          pageSize,
        },
      }
    );

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Failed to fetch order details.");
    }
  } catch (error) {
    console.error("Error fetching order details:", error);
    throw error;
  }
};
