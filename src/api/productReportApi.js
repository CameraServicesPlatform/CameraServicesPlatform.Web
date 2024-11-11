import api from "../api/config";

export const getAllProductReports = async (pageIndex = 1, pageSize = 10) => {
  try {
    const res = await api.get(`/productReport/get-all-product-report`, {
      params: { pageIndex, pageSize },
    });
    return res.data;
  } catch (err) {
    console.error("Error fetching all product reports:", err);
    return null;
  }
};
export const getProductReportById = async (
  id,
  pageIndex = 1,
  pageSize = 10
) => {
  try {
    const res = await api.get(`/productReport/get-product-report-by-id`, {
      params: { id, pageIndex, pageSize },
    });
    return res.data;
  } catch (err) {
    console.error("Error fetching product report by ID:", err);
    return null;
  }
};
export const getProductReportBySupplierId = async (
  supplierId,
  pageIndex = 1,
  pageSize = 10
) => {
  try {
    const res = await api.get(
      `/productReport/get-product-report-by-supplierId`,
      {
        params: { id: supplierId, pageIndex, pageSize },
      }
    );
    return res.data;
  } catch (err) {
    console.error("Error fetching product report by supplier ID:", err);
    return null;
  }
};
export const createProductReport = async (data) => {
  try {
    const res = await api.post(`/productReport/create-product-report`, data);
    return res.data;
  } catch (err) {
    console.error("Error creating product report:", err);
    return null;
  }
};
export const updateProductReport = async (
  productReportID,
  statusType,
  endDate,
  reason
) => {
  try {
    const res = await api.put(`/productReport/update-product-report`, {
      productReportID,
      statusType,
      endDate,
      reason,
    });
    return res.data;
  } catch (err) {
    console.error("Error updating product report:", err);
    return null;
  }
};
export const deleteProductReport = async (productReportId) => {
  try {
    const res = await api.delete(`/productReport/delete-product-report`, {
      params: { productReportId },
    });
    return res.data;
  } catch (err) {
    console.error("Error deleting product report:", err);
    return null;
  }
};
