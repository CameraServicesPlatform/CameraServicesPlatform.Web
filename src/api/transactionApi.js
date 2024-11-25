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
export const getAllTransactions = async (pageIndex = 1, pageSize = 100) => {
  try {
    const res = await api.get(
      `/transaction/get-all-transaction?pageIndex=${pageIndex}&pageSize=${pageSize}`
    );
    return res.data;
  } catch (err) {
    console.error("Error fetching all transactions:", err);
    return null;
  }
};

// Get a transaction by ID
export const getTransactionById = async (id, pageIndex = 1, pageSize = 100) => {
  try {
    const res = await api.get(
      `/transaction/get-transaction-by-id?id=${id}&pageIndex=${pageIndex}&pageSize=${pageSize}`
    );
    return res.data;
  } catch (err) {
    console.error("Error fetching transaction by ID:", err);
    return null;
  }
};

// Get transactions by supplier ID
export const getTransactionBySupplierId = async (
  id,
  pageIndex = 1,
  pageSize = 100
) => {
  try {
    const res = await api.get(
      `/transaction/get-transaction-by-supplier-id?id=${id}&pageIndex=${pageIndex}&pageSize=${pageSize}`
    );
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
    console.error("Error creating supplier payment again:", err);
    return null;
  }
};

// Create a staff refund
export const createStaffRefund = async (data) => {
  try {
    const res = await api.post("/transaction/create-staff-refund-member", data);
    return res.data;
  } catch (err) {
    console.error("Error creating staff refund:", err);
    return null;
  }
};

export const createStaffRefundPurchuse = async (orderId) => {
  try {
    const res = await api.post(
      `/transaction/create-staff-refund-member-purchuse?orderId=${orderId}`,
      ""
    );
    return res.data;
  } catch (err) {
    console.error("Error creating staff refund purchase:", err);
    return null;
  }
};

export const getAllHistoryTransactions = async (
  pageIndex = 1,
  pageSize = 10
) => {
  try {
    const res = await api.get(
      `/historyTransaction/get-all-history-transaction?pageIndex=${pageIndex}&pageSize=${pageSize}`
    );
    return res.data;
  } catch (err) {
    console.error("Error fetching all history transactions:", err);
    return null;
  }
};

export const createStaffRefundReturnDetail = async (orderID, staffId) => {
  try {
    const res = await api.post(
      "/transaction/create-staff-refund-return-detail",
      {
        orderID,
        staffId,
      }
    );
    return res.data;
  } catch (err) {
    console.error("Error creating staff refund return detail:", err);
    return null;
  }
};

export const createStaffRefundDeposit = async (orderID, staffId) => {
  try {
    const res = await api.post("/transaction/create-staff-refund-deposit", {
      orderID,
      staffId,
    });
    return res.data;
  } catch (err) {
    console.error("Error creating staff refund deposit:", err);
    return null;
  }
};

export const addImagePayment = async (orderId, imgFile) => {
  const formData = new FormData();
  formData.append("OrderID", orderId);
  formData.append("Img", imgFile);

  try {
    const response = await api.post(
      "/transaction/add-image-payment",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding image payment:", error);
    return {
      isSuccess: false,
      messages: ["Error adding image payment"],
    };
  }
};

export const createStaffRefundSupplier = async (orderId, staffId) => {
  try {
    const response = await api.post(
      "/transaction/create-staff-refund-supplier",
      {
        orderID: orderId,
        staffId: staffId,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating staff refund supplier:", error);
    return {
      isSuccess: false,
      messages: ["Error creating staff refund supplier"],
    };
  }
};

export const updateOrderStatusRefund = async (orderId) => {
  try {
    const response = await api.put(
      `/order/update-order-status-refund/${orderId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error updating order status to refund:", error);
    return {
      isSuccess: false,
      messages: ["Error updating order status to refund"],
    };
  }
};

export const getTransactionImage = async (orderId) => {
  try {
    const response = await api.post(
      `/transaction/get-image?orderId=${orderId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching transaction image:", error);
    return {
      isSuccess: false,
      messages: ["Error fetching transaction image"],
    };
  }
};
