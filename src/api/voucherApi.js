import { message } from "antd";
import api from "../api/config";

// Function to get all vouchers with pagination
export const getAllVouchers = async (pageIndex = 1, pageSize = 100) => {
  try {
    const response = await api.get(`/voucher/get-all-voucher`, {
      params: { pageIndex, pageSize },
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching vouchers:", error);
    message.error("Failed to fetch vouchers. Please try again later.");
    return null;
  }
};

// Function to get a voucher by ID
export const getVoucherById = async (id) => {
  try {
    const response = await api.get(`/voucher/get-voucher-by-id`, {
      params: { id },
    });
    if (response.status === 200 && response.data.isSuccess) {
      return response.data.result;
    }
  } catch (error) {
    console.error("Error fetching voucher by ID:", error);
    return null;
  }
};

// Function to get vouchers by supplier ID with pagination
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
      headers: { "Content-Type": "application/json" },
    });
    if (response.status === 200 && response.data.isSuccess) {
      message.success("Voucher created successfully.");
      return response.data.result;
    }
  } catch (error) {
    console.error("Error creating voucher:", error);
    message.error("Failed to create voucher. Please try again.");
    throw error;
  }
};

// Function to update an existing voucher
export const updateVoucher = async (voucherData) => {
  try {
    const response = await api.put(`/voucher/update-voucher`, voucherData, {
      headers: { "Content-Type": "application/json" },
    });
    if (response.status === 200 && response.data.isSuccess) {
      message.success("Voucher updated successfully.");
      return response.data.result;
    }
  } catch (error) {
    console.error("Error updating voucher:", error);
    message.error("Failed to update voucher. Please try again.");
    throw error;
  }
};

// Function to delete a voucher by ID
export const deleteVoucher = async (voucherId) => {
  try {
    const response = await api.delete(`/voucher/delete-voucher`, {
      params: { voucherId },
    });
    if (response.status === 200 && response.data.isSuccess) {
      message.success("Voucher deleted successfully.");
      return response.data.result;
    }
  } catch (error) {
    console.error("Error deleting voucher:", error);
    message.error("Failed to delete voucher. Please try again.");
    throw error;
  }
};
export const getProductVouchersByProductId = async (
  productId,
  pageIndex = 1,
  pageSize = 10
) => {
  try {
    const response = await api.get(
      `/productVoucher/get-product-voucher-by-product-id`,
      {
        params: {
          ProductId: productId,
          pageIndex: pageIndex,
          pageSize: pageSize,
        },
        headers: {
          Accept: "text/plain",
        },
      }
    );

    if (response.data.isSuccess) {
      return response.data.result;
    } else {
      throw new Error("Failed to fetch product vouchers.");
    }
  } catch (error) {
    console.error("Error fetching product vouchers by product ID:", error);
    message.error("Failed to fetch product vouchers. Please try again later.");
    throw error;
  }
};
