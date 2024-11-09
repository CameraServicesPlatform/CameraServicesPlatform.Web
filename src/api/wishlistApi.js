import api from "../api/config";

// Create a new wishlist
export const createWishlist = async (data) => {
  try {
    const res = await api.post("/wishlist/create-wishlist", data);
    return res.data;
  } catch (err) {
    console.error("Error creating wishlist:", err);
    return null;
  }
};

// Update a wishlist by ID
export const updateWishlist = async (wishlistID, data) => {
  try {
    const res = await api.put(
      `/wishlist/update-wish-list-by-id?wishlistID=${wishlistID}`,
      data
    );
    return res.data;
  } catch (err) {
    console.error("Error updating wishlist:", err);
    return null;
  }
};

// Delete a wishlist item by ID
export const deleteWishlistItem = async (wishlistId) => {
  try {
    const res = await api.delete(
      `/wishlist/delete-wish-list-detail-by-id?wishlistId=${wishlistId}`
    );
    return res.data;
  } catch (err) {
    console.error("Error deleting wishlist item:", err);
    return null;
  }
};

// Get a wishlist by its ID
export const getWishlistById = async (wishlistId) => {
  try {
    const res = await api.get(
      `/wishlist/get-wish-list-by-id?wishlistId=${wishlistId}`
    );
    return res.data;
  } catch (err) {
    console.error("Error fetching wishlist by ID:", err);
    return null;
  }
};

// Get all wishlists with pagination
export const getAllWishlists = async (pageIndex = 1, pageSize = 10) => {
  try {
    const res = await api.get(
      `/wishlist/get-all-wish-list?pageIndex=${pageIndex}&pageSize=${pageSize}`
    );
    return res.data;
  } catch (err) {
    console.error("Error fetching all wishlists:", err);
    return null;
  }
};

// Get wishlist by member ID (AccountID)
export const getWishlistByMemberId = async (
  accountID,
  pageIndex = 1,
  pageSize = 10
) => {
  try {
    const res = await api.get(
      `/wishlist/get-wish-list-by-member-id?AccountID=${accountID}&pageIndex=${pageIndex}&pageSize=${pageSize}`
    );
    return res.data;
  } catch (err) {
    console.error("Error fetching wishlist by member ID:", err);
    return null;
  }
};
