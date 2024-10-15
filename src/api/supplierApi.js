import api from "../api/config";

export const getAllSuppliers = async (pageIndex, pageSize) => {
  try {
    const res = await api.get(
      `/voucher/get-all-voucher?pageIndex=${pageIndex}&pageSize=${pageSize}`
    );
    return res.data;
  } catch (err) {
    console.error("Error fetching supplier:", err);
    return null;
  }
};
// Get supplier by ID
export const getSupplierById = async (id, pageIndex = 1, pageSize = 10) => {
  try {
    const res = await api.get(
      `/supplier/get-supplier-by-id?id=${id}&pageIndex=${pageIndex}&pageSize=${pageSize}`
    );
    return res.data;
  } catch (err) {
    console.error("Error fetching supplier by ID:", err);
    return null;
  }
};

// Search for suppliers by name
export const getSupplierByName = async (
  filter,
  pageIndex = 1,
  pageSize = 10
) => {
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

// Update an existing supplier
export const updateSupplier = async (supplierData) => {
  try {
    const res = await api.put(`/supplier/update-supplier`, supplierData);
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
