import api from "../api/config";

export const getAllProduct = async (pageIndex, pageSize) => {
  try {
    const res = await api.get(
      `/product/get-all-product?pageIndex=${pageIndex}&pageSize=${pageSize}`
    );
    return res.data;
  } catch (err) {
    return null;
  }
};

export const getProductById = async (id, pageIndex, pageSize) => {
  try {
    const response = await fetch(
      `/product/get-product-by-id?id=${id}&pageIndex=${pageIndex}&pageSize=${pageSize}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return {
      result: "",
      isSuccess: false,
      messages: [error.message],
    };
  }
};

export const getProductByName = async (filter, pageIndex, pageSize) => {
  try {
    const response = await fetch(
      `/product/get-product-by-name?filter=${encodeURIComponent(
        filter
      )}&pageIndex=${pageIndex}&pageSize=${pageSize}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching product by name:", error);
    return {
      result: { items: [] }, // Default to an empty items array
      isSuccess: false,
      messages: [error.message],
    };
  }
};

export const getProductByCategoryName = async (
  filter,
  pageIndex = 1,
  pageSize = 10
) => {
  try {
    const response = await fetch(
      `/product/get-product-by-category-name?filter=${encodeURIComponent(
        filter
      )}&pageIndex=${pageIndex}&pageSize=${pageSize}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching product by category name:", error);
    return {
      result: { items: [], totalPages: 0 },
      isSuccess: false,
      messages: [error.message],
    };
  }
};
export const deleteProduct = async (productId) => {
  try {
    const response = await api.delete(`/product/delete-product`, {
      params: { productId },
    });

    return response.data;
  } catch (error) {
    console.error("Error deleting product:", error);
    return null;
  }
};
export const createProduct = async (
  serialNumber,
  supplierID,
  categoryID,
  productName,
  productDescription,
  priceRent,
  priceBuy,
  brand,
  status
) => {
  try {
    const response = await api.post("/product/create-product", {
      SerialNumber: serialNumber,
      SupplierID: supplierID,
      CategoryID: categoryID,
      ProductName: productName,
      ProductDescription: productDescription,
      PriceRent: priceRent,
      PriceBuy: priceBuy,
      Brand: brand,
      Status: status,
    });

    return response.data;
  } catch (error) {
    console.error("Error creating product:", error);
    return null;
  }
};
