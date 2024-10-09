import api from "../api/config";

export const loginWithEmailPass = async (email, password) => {
  try {
    const res = await api.post(`/account/login`, {
      email,
      password,
    });
    return res.data;
  } catch (err) {
    return null;
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

export const registerSupplier = async (
  email,
  password,
  firstName,
  lastName,
  supplierName,
  supplierDescription,
  supplierAddress,
  contactNumber,
  phoneNumber
) => {
  try {
    const res = await api.post("/account/register/supplier", {
      email,
      password,
      firstName,
      lastName,
      supplierName,
      supplierDescription,
      supplierAddress,
      contactNumber,
      phoneNumber,
    });
    return res.data;
  } catch (err) {
    console.error("Error registering supplier:", err);
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
    // Correctly format the URL to include the email and verifyCode in the path
    const res = await api.put(
      `/account/active-account/${encodeURIComponent(
        email
      )}/${encodeURIComponent(code)}`
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

export const assignRoleToUser = async (userId, roleName) => {
  try {
    const res = await api.post(
      `/account/assign-role?userId=${userId}&roleName=${roleName}`
    );
    return res.data;
  } catch (err) {}
};
