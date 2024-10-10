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
