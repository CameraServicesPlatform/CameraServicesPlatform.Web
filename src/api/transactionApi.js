import api from "../api/config";

export const createSupplierPaymentAgain = async (paymentData) => {
  try {
    const response = await api.post(
      "/transaction/create-supplier-payment-again",
      paymentData
    );
    return response.data;
  } catch (error) {
    console.error("Error creating supplier payment again:", error);
    return (
      error.response?.data || {
        isSuccess: false,
        messages: ["Error creating supplier payment again"],
      }
    );
  }
};
