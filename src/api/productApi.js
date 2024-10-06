import api from "../api/config";

export const getAllProduct = async (pageIndex, pageSize) => {
  try {
    const res = await api.get(
      `//product/get-all-product?pageIndex=${pageIndex}&pageSize=${pageSize}`,
      []
    );
    return res.data;
  } catch (err) {
    return null;
  }
};
