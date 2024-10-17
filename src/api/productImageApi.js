import api from "./config";

// Function to get all product images with pagination
export const getAllProductImages = async (pageIndex = 1, pageSize = 10) => {
  try {
    const response = await api.get(`/productImage/get-all-product-image`, {
      params: {
        pageIndex,
        pageSize,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching product images:", error);
    throw error;
  }
};

// Function to create a new product image
export const createProductImage = async (productID, image) => {
  try {
    const response = await api.post(`/productImage/create-product-image`, {
      productID,
      image,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating product image:", error);
    throw error;
  }
};

// Function to update an existing product image
export const updateProductImage = async (productImagesID, productID, image) => {
  try {
    const response = await api.put(`/productImage/update--product-image`, {
      productImagesID,
      productID,
      image,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating product image:", error);
    throw error;
  }
};

// Function to delete a product image
export const deleteProductImage = async (productImageId) => {
  try {
    const response = await api.delete(`/productImage/delete--product-image`, {
      params: {
        productImageId,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting product image:", error);
    throw error;
  }
};
