import api from "../api/config";

export const getAllProduct = async (pageIndex, pageSize) => {
  try {
    const res = await api.get(
      `/product/get-all-product?pageIndex=${pageIndex}&pageSize=${pageSize}`
    );

    if (res.status === 200 && res.data) {
      return res.data.result;
    }

    return [];
  } catch (err) {
    console.error("Error fetching products:", err);
    return null;
  }
};

export const createProductBuy = async (data) => {
  const formData = new FormData();
  formData.append("SerialNumber", data.SerialNumber);
  formData.append("SupplierID", data.SupplierID);
  formData.append("CategoryID", data.CategoryID);
  formData.append("ProductName", data.ProductName);
  formData.append("ProductDescription", data.ProductDescription);
  formData.append("PriceRent", data.PriceRent);
  formData.append("PriceBuy", data.PriceBuy);
  formData.append("Brand", data.Brand);
  formData.append("Status", data.Status);
  formData.append("File", data.File);

  // Append each specification to the formData
  data.listProductSpecification.forEach((spec, index) => {
    formData.append(`listProductSpecification[${index}]`, spec);
  });

  try {
    const response = await api.post(`/product/create-product-buy`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error creating product for buy:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};
export const createProductRent = async (data) => {
  const formData = new FormData();
  formData.append("SerialNumber", data.SerialNumber);
  formData.append("SupplierID", data.SupplierID);
  formData.append("CategoryID", data.CategoryID);
  formData.append("ProductName", data.ProductName);
  formData.append("ProductDescription", data.ProductDescription);
  formData.append("Quality", data.Quality);
  formData.append("PricePerHour", data.PricePerHour);
  formData.append("PricePerDay", data.PricePerDay);
  formData.append("PricePerWeek", data.PricePerWeek);
  formData.append("PricePerMonth", data.PricePerMonth);
  formData.append("Brand", data.Brand);
  formData.append("File", data.File);

  data.listProductSpecification.forEach((spec, index) => {
    formData.append(`listProductSpecification[${index}]`, spec);
  });

  try {
    const response = await api.post(`/product/create-product-rent`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error creating product for rent:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};
export const getProductById = async (id, pageIndex = 1, pageSize = 1) => {
  try {
    const res = await api.get(
      `/product/get-product-by-id?id=${id}&pageIndex=${pageIndex}&pageSize=${pageSize}`
    );

    if (res.status === 200 && res.data) {
      if (res.data.isSuccess) {
        return res.data.result;
      } else {
        console.error("API error:", res.data.message);
        return null;
      }
    }

    console.error("Unexpected response format:", res);
    return null;
  } catch (err) {
    console.error("Error fetching product by ID:", err);
    return null;
  }
};

export const getProductBySupplierId = async (
  supplierId,
  filter,
  pageIndex,
  pageSize
) => {
  try {
    const response = await api.get(
      `/product/get-product-by-supplierId?supplierId=${supplierId}&filter=${filter}&pageIndex=${pageIndex}&pageSize=${pageSize}`
    );

    if (response.status === 200 && response.data && response.data.isSuccess) {
      return response.data.result;
    }

    return null;
  } catch (error) {
    console.error("Error fetching products by supplier ID:", error);
    return null;
  }
};
export const getProductByName = async (
  filter,
  pageIndex = 1,
  pageSize = 20
) => {
  try {
    const response = await api.get(`/product/get-product-by-name`, {
      params: {
        filter,
        pageIndex,
        pageSize,
      },
    });

    if (response.status === 200 && response.data && response.data.isSuccess) {
      return response.data.result; // Returning result which contains items
    }

    return null;
  } catch (error) {
    console.error("Error fetching products by name:", error);
    return null;
  }
};

export const getProductByCategoryName = async (
  filter,
  pageIndex = 1,
  pageSize = 20
) => {
  try {
    const response = await api.get(
      `/product/get-product-by-category-name?filter=${filter}&pageIndex=${pageIndex}&pageSize=${pageSize}`
    );

    if (response.status === 200 && response.data && response.data.isSuccess) {
      return response.data.result;
    }

    return null;
  } catch (error) {
    console.error("Error fetching products by category name:", error);
    return null;
  }
};
export const getProductByCategoryId = async (filter, pageIndex, pageSize) => {
  try {
    const response = await api.get(
      `/product/get-product-by-category-id?filter=${filter}&pageIndex=${pageIndex}&pageSize=${pageSize}`
    );

    if (response.status === 200 && response.data && response.data.isSuccess) {
      return response.data.result;
    }

    return null;
  } catch (error) {
    console.error("Error fetching products by category ID:", error);
    return null;
  }
};

export const updateProduct = async (product, file) => {
  try {
    const formData = new FormData();

    formData.append("ProductID", product.productID);
    formData.append("SerialNumber", product.serialNumber);
    formData.append("CategoryID", product.categoryID);
    formData.append("ProductName", product.productName);
    formData.append("ProductDescription", product.productDescription);
    formData.append("PriceRent", product.priceRent);
    formData.append("PriceBuy", product.priceBuy);
    formData.append("Brand", product.brand);
    formData.append("Quality", product.quality);
    formData.append("Status", product.status);

    if (file) {
      formData.append("File", file);
    }

    const response = await api.put("/product/update-product", formData, {
      headers: {
        accept: "text/plain",
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.status === 200 && response.data.isSuccess) {
      return response.data.result;
    }

    console.error("Failed to update product:", response.data.messages);
    return null;
  } catch (error) {
    console.error("Error updating product:", error);
    return null;
  }
};
export const deleteProduct = async (productId) => {
  try {
    if (!productId) {
      console.error("Product ID is required to delete a product.");
      return false;
    }

    const response = await api.delete("/product/delete-product", {
      params: { productId },
    });

    if (response.status === 200) {
      console.log("Product deleted successfully.");
      return true;
    }

    console.error("Failed to delete product:", response.data.messages);
    return false;
  } catch (error) {
    console.error("Error deleting product:", error);
    return false;
  }
};
