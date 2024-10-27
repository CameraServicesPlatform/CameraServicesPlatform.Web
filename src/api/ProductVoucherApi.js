import api from "../api/config";
export const getAllProductVouchers = async (pageIndex = 1, pageSize = 10) => {
  try {
    const response = await api.get("/productVoucher/get-all-product-voucher", {
      params: { pageIndex, pageSize },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching all product vouchers:", error);
    return null;
  }
};

export const getProductVoucherById = async (
  id,
  pageIndex = 1,
  pageSize = 10
) => {
  try {
    const response = await api.get(
      "/productVoucher/get-product-voucher-by-id",
      {
        params: { id, pageIndex, pageSize },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching product voucher by ID:", error);
    return null;
  }
};

export const getProductVoucherByProductId = async (
  ProductId,
  pageIndex = 1,
  pageSize = 10
) => {
  try {
    const response = await api.get(
      "/productVoucher/get-product-voucher-by-product-id",
      {
        params: { ProductId, pageIndex, pageSize },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching product voucher by Product ID:", error);
    return null;
  }
};

export const createProductVoucher = async (productID, vourcherID) => {
  try {
    const response = await api.post("/productVoucher/create-product-voucher", {
      productID,
      vourcherID,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating product voucher:", error);
    return null;
  }
};

export const updateProductVoucher = async (
  productVoucherID,
  productID,
  vourcherID
) => {
  try {
    const response = await api.put("/productVoucher/update-product-voucher", {
      productVoucherID,
      productID,
      vourcherID,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating product voucher:", error);
    return null;
  }
};

export const deleteProductVoucher = async (voucherId) => {
  try {
    const response = await api.delete(
      "/productVoucher/delete-product-voucher",
      {
        params: { voucherId },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting product voucher:", error);
    return null;
  }
};
