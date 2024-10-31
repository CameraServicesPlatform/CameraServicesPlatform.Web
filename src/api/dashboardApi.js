import api from "../api/config";

// Get best selling categories
export const getBestSellingCategories = async (startDate, endDate) => {
  try {
    const response = await api.get("/dashboard/best-selling-categories", {
      params: { startDate, endDate },
    });
    return response.data; // Array of categories
  } catch (error) {
    console.error("Error fetching best selling categories:", error);
    throw error; // Rethrow to handle it in the component
  }
};

// Get best selling categories by supplier
export const getBestSellingCategoriesBySupplier = async (
  supplierId,
  startDate,
  endDate
) => {
  try {
    const response = await api.get(
      `/dashboard/best-selling-categories-by-supplier/${supplierId}`,
      {
        params: { startDate, endDate },
      }
    );
    return response.data; // Array of categories
  } catch (error) {
    console.error(
      `Error fetching best selling categories for supplier ${supplierId}:`,
      error
    );
    throw error;
  }
};

// Get supplier product statistics
export const getSupplierProductStatistics = async (supplierId) => {
  try {
    const response = await api.get(
      `/dashboard/get-supplier-product-statistics/${supplierId}`
    );
    return response.data; // Array of products
  } catch (error) {
    console.error(
      `Error fetching product statistics for supplier ${supplierId}:`,
      error
    );
    throw error;
  }
};

// Get month order cost statistics
export const getMonthOrderCostStatistics = async (
  supplierId,
  startDate,
  endDate
) => {
  try {
    const response = await api.get(
      `/dashboard/get-month-order-cost-statistics/${supplierId}`,
      {
        params: { startDate, endDate },
      }
    );
    return response.data; // Array of month cost statistics
  } catch (error) {
    console.error(
      `Error fetching month order cost statistics for supplier ${supplierId}:`,
      error
    );
    throw error;
  }
};

// Get account order statistics
export const getAccountOrderStatistics = async (
  accountId,
  startDate,
  endDate
) => {
  try {
    const response = await api.get(
      `/dashboard/get-account-order-statistics/${accountId}`,
      {
        params: { startDate, endDate },
      }
    );
    return response.data; // Order statistics object
  } catch (error) {
    console.error(
      `Error fetching order statistics for account ${accountId}:`,
      error
    );
    throw error;
  }
};

// Get supplier order statistics
export const getSupplierOrderStatistics = async (
  supplierId,
  startDate,
  endDate
) => {
  try {
    const response = await api.get(
      `/dashboard/get-supplier-order-statistics/${supplierId}`,
      {
        params: { startDate, endDate },
      }
    );
    return response.data; // Order statistics object
  } catch (error) {
    console.error(
      `Error fetching order statistics for supplier ${supplierId}:`,
      error
    );
    throw error;
  }
};

// Get calculate total revenue by supplier
export const getCalculateTotalRevenueBySupplier = async (supplierId) => {
  try {
    const response = await api.get(
      `/dashboard/get-calculate-total-revenue-by-supplier/${supplierId}`
    );
    return response.data; // Total revenue
  } catch (error) {
    console.error(
      `Error calculating total revenue for supplier ${supplierId}:`,
      error
    );
    throw error;
  }
};

// Get calculate monthly revenue by supplier
export const getCalculateMonthlyRevenueBySupplier = async (
  supplierId,
  startDate,
  endDate
) => {
  try {
    const response = await api.get(
      `/dashboard/get-calculate-monthly-revenue-by-supplier/${supplierId}`,
      {
        params: { startDate, endDate },
      }
    );
    return response.data; // Array of monthly revenue statistics
  } catch (error) {
    console.error(
      `Error calculating monthly revenue for supplier ${supplierId}:`,
      error
    );
    throw error;
  }
};

// Get supplier rating statistics
export const getSupplierRatingStatistics = async (supplierId) => {
  try {
    const response = await api.get(
      `/dashboard/supplier-rating-statistics/${supplierId}`
    );
    return response.data; // Rating statistics
  } catch (error) {
    console.error(
      `Error fetching rating statistics for supplier ${supplierId}:`,
      error
    );
    throw error;
  }
};
