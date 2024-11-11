import api from "../api/config";

// Fetch all categories with pagination
export const getAllCategories = async (pageIndex, pageSize) => {
  try {
    const response = await api.get("/category/get-all-category", {
      params: { pageIndex, pageSize },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

// Fetch a category by ID
export const getCategoryById = async (id) => {
  try {
    const response = await api.get(`/category/get-category-by-id`, {
      params: { id },
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch category with ID ${id}:`, error);
    return {
      isSuccess: false,
      messages: [`Failed to fetch category by ID: ${id}`],
    };
  }
};

// Search categories by name with pagination
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
    console.error(
      `Failed to search categories with filter "${filter}":`,
      error
    );
    return {
      isSuccess: false,
      messages: [`Failed to search categories by name: ${filter}`],
    };
  }
};

// Create a new category
export const createCategory = async (categoryName, categoryDescription) => {
  try {
    const response = await api.post("/category/create-category", {
      categoryName,
      categoryDescription,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to create category:", error);
    return { isSuccess: false, messages: ["Failed to create category"] };
  }
};

// Update an existing category
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
    console.error(`Failed to update category with ID ${categoryID}:`, error);
    return {
      isSuccess: false,
      messages: [`Failed to update category with ID: ${categoryID}`],
    };
  }
};

// Delete a category by ID
export const deleteCategory = async (categoryId) => {
  try {
    const response = await api.delete("/category/delete-category", {
      params: { CategoryId: categoryId },
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to delete category with ID ${categoryId}:`, error);
    return {
      isSuccess: false,
      messages: [`Failed to delete category with ID: ${categoryId}`],
    };
  }
};
