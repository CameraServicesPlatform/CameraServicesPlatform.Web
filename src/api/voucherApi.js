import api from "../api/config";

// Function to get all vouchers with pagination
export const getAllVouchers = async (pageIndex = 1, pageSize = 10) => {
  try {
    const response = await api.get(`/voucher/get-all-voucher`, {
      params: {
        pageIndex,
        pageSize,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching vouchers:", error);
    throw error;
  }
};

// Function to get a voucher by its ID
export const getVoucherById = async (id, pageIndex = 1, pageSize = 10) => {
  try {
    const response = await api.get(`/voucher/get-voucher-by-id`, {
      params: {
        id,
        pageIndex,
        pageSize,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching voucher by ID:", error);
    throw error;
  }
};

// Function to get vouchers by supplier ID
export const getVouchersBySupplierId = async (
  supplierId,
  pageIndex = 1,
  pageSize = 10
) => {
  try {
    const response = await api.get(`/voucher/get-voucher-by-supplier-id`, {
      params: {
        supplierId,
        pageIndex,
        pageSize,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching vouchers by supplier ID:", error);
    throw error;
  }
};

// Function to create a new voucher
export const createVoucher = async (voucherData) => {
  try {
    const response = await api.post(`/voucher/create-voucher`, voucherData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating voucher:", error);
    throw error;
  }
};

// Function to update an existing voucher
export const updateVoucher = async (voucherData) => {
  try {
    const response = await api.put(`/voucher/update-voucher`, voucherData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating voucher:", error);
    throw error;
  }
};

// Function to delete a voucher
export const deleteVoucher = async (voucherId) => {
  try {
    const response = await api.delete(`/voucher/delete-voucher`, {
      params: {
        voucherId,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting voucher:", error);
    throw error;
  }
};
