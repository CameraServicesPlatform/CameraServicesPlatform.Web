import api from "../api/config";

export const getAllSuppliers = async (pageIndex, pageSize) => {
  try {
    const res = await api.get(
      `/supplier/get-all-supplier?pageIndex=${pageIndex}&pageSize=${pageSize}`
    );
    return res.data;
  } catch (err) {
    console.error("Error fetching supplier:", err);
    return null;
  }
};

export const getSupplierById = async (id, pageIndex = 1, pageSize = 1) => {
  try {
    const response = await api.get("/supplier/get-supplier-by-id", {
      params: {
        id,
        pageIndex,
        pageSize,
      },
      headers: {
        accept: "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching supplier by ID:", error);
    return null;
  }
};
// Search for suppliers by name
export const getSupplierByName = async (filter, pageIndex, pageSize) => {
  try {
    const res = await api.get(
      `/supplier/get-supplier-by-name?filter=${filter}&pageIndex=${pageIndex}&pageSize=${pageSize}`
    );
    return res.data;
  } catch (err) {
    console.error("Error fetching supplier by name:", err);
    return null;
  }
};

// Create a new supplier
export const createSupplier = async (supplierData) => {
  try {
    const res = await api.post(`/supplier/create-supplier`, supplierData);
    return res.data;
  } catch (err) {
    console.error("Error creating supplier:", err);
    return null;
  }
};

export const updateSupplier = async (formData) => {
  try {
    const res = await api.put("/supplier/update-supplier", formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Set the correct content type
      },
    });
    return res.data;
  } catch (err) {
    console.error("Error updating supplier:", err);
    return null;
  }
};

// Delete a supplier
export const deleteSupplier = async (supplierId) => {
  try {
    const res = await api.delete(
      `/supplier/delete-supplier?supplierId=${supplierId}`
    );
    return res.data;
  } catch (err) {
    console.error("Error deleting supplier:", err);
    return null;
  }
};
