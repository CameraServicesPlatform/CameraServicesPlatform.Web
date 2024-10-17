import api from "../api/config";

// Function to get all vouchers with pagination
export const getAllVouchers = async (pageIndex, pageSize) => {
  try {
    const response = await api.get(`/voucher/get-all-voucher`, {
      params: { pageIndex, pageSize },
    });

    if (response.status === 200 && response.data.result) {
      return response.data.result.items; // Return the list of vouchers
    }
  } catch (error) {
    console.error("Error fetching vouchers:", error);
    return null; // Handle error
  }
};

// Function to get a voucher by ID
export const getVoucherById = async (id) => {
  try {
    const response = await api.get(`/voucher/get-voucher-by-id`, {
      params: { id },
    });
    if (response.status === 200 && response.data.isSuccess) {
      return response.data.result; // Return the voucher details
    }
  } catch (error) {
    console.error("Error fetching voucher by ID:", error);
    return null; // Handle error
  }
};

// Function to get vouchers by supplier ID
export const getVouchersBySupplierId = async (
  supplierId,
  pageIndex,
  pageSize
) => {
  try {
    const response = await api.get(
      `/voucher/get-voucher-by-supplier-id?supplierId=${supplierId}&pageIndex=${pageIndex}&pageSize=${pageSize}`
    );
    if (!response.data.isSuccess) {
      throw new Error("Failed to fetch vouchers.");
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching vouchers by supplier ID:", error);
    message.error("Failed to fetch vouchers. Please try again later.");
    throw error; // Rethrow if you want to handle it later
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
    return response.data; // Return the created voucher data
  } catch (error) {
    console.error("Error creating voucher:", error);
    throw error; // Rethrow error for handling upstream
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
    return response.data; // Return the updated voucher data
  } catch (error) {
    console.error("Error updating voucher:", error);
    throw error; // Rethrow error for handling upstream
  }
};

// Function to delete a voucher
export const deleteVoucher = async (voucherId) => {
  try {
    const response = await api.delete(`/voucher/delete-voucher`, {
      params: { voucherId },
    });
    return response.data; // Return the response data after deletion
  } catch (error) {
    console.error("Error deleting voucher:", error);
    throw error; // Rethrow error for handling upstream
  }
};
