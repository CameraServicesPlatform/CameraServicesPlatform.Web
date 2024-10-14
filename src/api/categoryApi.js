import api from "../api/config";

export const getAllCategories = async (pageIndex = 1, pageSize = 10) => {
  try {
    const response = await api.get("/category/get-all-category", {
      params: { pageIndex, pageSize },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return null;
  }
};

export const getCategoryById = async (id) => {
  try {
    const response = await api.get("/category/get-category-by-id", {
      params: { id },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching category by ID:", error);
    return null;
  }
};

export const getCategoryByName = async (
  filter,
  pageIndex = 1,
  pageSize = 10
) => {
  try {
    const response = await api.get("/category/get-category-by-name", {
      params: { filter, pageIndex, pageSize },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching category by name:", error);
    return null;
  }
};

export const createCategory = async (categoryName, categoryDescription) => {
  try {
    const response = await api.post("/category/create-category", {
      categoryName,
      categoryDescription,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating category:", error);
    return null;
  }
};

export const updateCategory = async (
  categoryID,
  categoryName,
  categoryDescription
) => {
  try {
    const response = await api.put("/category/update-category", {
      categoryID,
      categoryName,
      categoryDescription,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating category:", error);
    return null;
  }
};

export const deleteCategory = async (categoryId) => {
  try {
    const response = await api.delete("/category/delete-category", {
      params: { productId: categoryId },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting category:", error);
    return null;
  }
};
