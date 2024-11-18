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
 
// Create a new transaction
export const createTransaction = async (data) => {
  try {
    const res = await api.post("/transaction/create-transaction", data);
    return res.data;
  } catch (err) {
    console.error("Error creating transaction:", err);
    return null;
  }
};

// Get all transactions with pagination
export const getAllTransactions = async (pageIndex = 1, pageSize = 10) => {
  try {
    const res = await api.get(`/transaction/get-all-transaction?pageIndex=${pageIndex}&pageSize=${pageSize}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching all transactions:", err);
    return null;
  }
};

// Get a transaction by ID
export const getTransactionById = async (id, pageIndex = 1, pageSize = 10) => {
  try {
    const res = await api.get(`/transaction/get-transaction-by-id?id=${id}&pageIndex=${pageIndex}&pageSize=${pageSize}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching transaction by ID:", err);
    return null;
  }
};

// Get transactions by supplier ID
export const getTransactionBySupplierId = async (id, pageIndex = 1, pageSize = 10) => {
  try {
    const res = await api.get(`/transaction/get-transaction-by-supplier-id?id=${id}&pageIndex=${pageIndex}&pageSize=${pageSize}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching transactions by supplier ID:", err);
    return null;
  }
};

// Create a supplier payment
export const createSupplierPayment = async (data) => {
  try {
    const res = await api.post("/transaction/create-supplier-payment", data);
    return res.data;
  } catch (err) {
    console.error("Error creating supplier payment:", err);
    return null;
  }
};

// Create a supplier payment again
export const createSupplierPaymentAgain = async (data) => {
  try {
    const res = await api.post("/transaction/create-supplier-payment-again", data);
    return res.data;
  } catch (err) {
    console.error("Error creating supplier payment again:", err);
    return null;
  }
};