import api from "../api/config";

export const updateStaffById = async (staffId, staffData) => {
  try {
    const res = await api.put(
      `/staff/update-staff-by-id?StaffID=${staffId}`,
      staffData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  } catch (err) {
    console.error("Error updating staff by ID:", err);
    return null;
  }
};

export const deleteStaffById = async (staffId) => {
  try {
    const res = await api.put(`/staff/delete-staff-by-id?StaffID=${staffId}`);
    return res.data;
  } catch (err) {
    console.error("Error deleting staff by ID:", err);
    return null;
  }
};

export const getStaffById = async (staffId, pageIndex = 1, pageSize = 1) => {
  try {
    const res = await api.get(
      `/staff/get-staff-by-id?StaffID=${staffId}&pageIndex=${pageIndex}&pageSize=${pageSize}`
    );
    return res.data;
  } catch (err) {
    console.error("Error fetching staff by ID:", err);
    return null;
  }
};

export const getStaffByName = async (name, pageIndex = 1, pageSize = 10) => {
  try {
    const res = await api.get(
      `/staff/get-staff-by-staff-name?pageIndex=${pageIndex}&pageSize=${pageSize}`,
      {
        data: name,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  } catch (err) {
    console.error("Error fetching staff by name:", err);
    return null;
  }
};

export const getAllStaff = async (pageIndex = 1, pageSize = 10) => {
  try {
    const res = await api.get(
      `/staff/get-all-staff?pageIndex=${pageIndex}&pageSize=${pageSize}`
    );
    return res.data;
  } catch (err) {
    console.error("Error fetching all staff:", err);
    return null;
  }
};

export const getAllInactiveAccounts = async (pageIndex = 1, pageSize = 10) => {
  try {
    const res = await api.get(
      `/staff/get-all-account-inactive?pageIndex=${pageIndex}&pageSize=${pageSize}`
    );
    return res.data;
  } catch (err) {
    console.error("Error fetching all inactive accounts:", err);
    return null;
  }
};

export const getAllActiveAccounts = async (pageIndex = 1, pageSize = 10) => {
  try {
    const res = await api.get(
      `/staff/get-all-account-active?pageIndex=${pageIndex}&pageSize=${pageSize}`
    );
    return res.data;
  } catch (err) {
    console.error("Error fetching all active accounts:", err);
    return null;
  }
};
