import api from "../api/config";

export const createSupplierPaymentPurchuse = async (orderId) => {
  try {
    const response = await api.post(
      `/transaction/create-supplier-payment-purchuse/${orderId}`,
      ""
    );
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
