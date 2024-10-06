import api from "../api/config";

export const loginWithEmailPass = async (email, password) => {
  try {
    const res = await api.post(`/account/login`, {
      email,
      password,
    });
    console.log("Login response:", res.data); // Inspect the response

    // Check if the structure matches your expectations
    if (res.data && res.data.isSuccess) {
      return res.data; // Return the entire response object
    } else {
      console.error("Unexpected response structure:", res.data);
      return {
        isSuccess: false,
        messages: ["Unexpected response from server"],
      }; // Return a more explicit error
    }
  } catch (err) {
    console.error("Login error:", err);
    return {
      isSuccess: false,
      messages: [err.message || "An error occurred during login"],
    }; // Ensure there's a message to display
  }
};

export const createAccount = async (
  email,
  firstName,
  lastName,
  password,
  gender,
  phoneNumber,
  roleName
) => {
  try {
    const res = await api.post(`/account/create-account`, {
      email,
      firstName,
      lastName,
      password,
      gender,
      phoneNumber,
      roleName,
    });
    return res.data;
  } catch (err) {
    return null;
  }
};

export const sendOTP = async (email) => {
  try {
    const res = await api.post(`/account/send-email-for-activeCode/${email}`);
    return res.data;
  } catch (err) {
    return null;
  }
};

export const activeAccount = async (email, code) => {
  try {
    const res = await api.put(
      `/account/active-account?email=${email}&verifyCode=${code}`
    );
    return res.data;
  } catch (err) {
    return null;
  }
};

export const googleCallback = async (token) => {
  try {
    const res = await api.post(`/account/google-callback`, `${token}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (err) {
    return null;
  }
};

export const getNewToken = async (accountId, refreshToken) => {
  try {
    const res = await api.post(
      `/account/get-new-token?userId=${accountId}`,
      refreshToken
    );
    return res.data;
  } catch (err) {
    return null;
  }
};

export const getAccountById = async (accountId, token) => {
  try {
    const res = await api.post(
      `/account/get-account-by-userId/${accountId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    return res.data;
  } catch (err) {
    console.error("Error fetching account by ID:", err);
    return null;
  }
};

export const sendResetPassOTP = async (email) => {
  try {
    const res = await api.post(`/account/send-email-forgot-password/${email}`);
    return res.data;
  } catch (err) {
    return null;
  }
};

export const submitOTPResetPass = async (email, recoveryCode, newPassword) => {
  try {
    const res = await api.put(`/account/forgot-password`, {
      email,
      recoveryCode,
      newPassword,
    });
    return res.data;
  } catch (err) {
    return null;
  }
};

export const getAllAccount = async (pageIndex, pageSize) => {
  try {
    const res = await api.get(
      `/account/get-all-account?pageIndex=${pageIndex}&pageSize=${pageSize}`,
      []
    );
    return res.data;
  } catch (err) {
    return null;
  }
};

export const updateAccount = async (data) => {
  try {
    const res = await api.put(`/account/update-account`, data);
    return res.data;
  } catch (err) {
    return null;
  }
};
// Function to assign a role to a user

export const assignRoleToUser = async (userId, roleName) => {
  try {
    const res = await api.post(
      `/account/assign-role?userId=${userId}&roleName=${roleName}`
    );
    return res.data;
  } catch (err) {}
};

export const assignUserIntoOrganization = async (userId, organizationId) => {
  try {
    const res = await api.post(
      `/account/assign-user-into-organization?userId=${userId}&organizationId=${organizationId}`
    );
    return res.data;
  } catch (err) {}
};
