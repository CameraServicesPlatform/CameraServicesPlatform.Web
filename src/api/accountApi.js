import axios from "axios";
import { baseUrl } from "./config";

export const loginWithEmailPass = async (email, password) => {
  try {
    const res = await axios.post(`${baseUrl}/account/login`, {
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
    const res = await axios.post(`${baseUrl}/account/create-account`, {
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
    const res = await axios.post(
      `${baseUrl}/account/send-email-for-activeCode/${email}`
    );
    return res.data;
  } catch (err) {
    return null;
  }
};

export const activeAccount = async (email, code) => {
  try {
    const res = await axios.put(
      `${baseUrl}/account/active-account?email=${email}&verifyCode=${code}`
    );
    return res.data;
  } catch (err) {
    return null;
  }
};

export const googleCallback = async (token) => {
  try {
    const res = await axios.post(
      `${baseUrl}/account/google-callback`,
      `${token}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  } catch (err) {
    return null;
  }
};

export const getNewToken = async (accountId, refreshToken) => {
  try {
    const res = await axios.post(
      `${baseUrl}/account/get-new-token?userId=${accountId}`,
      refreshToken
    );
    return res.data;
  } catch (err) {
    return null;
  }
};

export const getAccountById = async (accountId, token) => {
  try {
    const res = await axios.post(
      `${baseUrl}/account/get-account-by-userId/${accountId}`,
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
    const res = await axios.post(
      `${baseUrl}/account/send-email-forgot-password/${email}`
    );
    return res.data;
  } catch (err) {
    return null;
  }
};

export const submitOTPResetPass = async (email, recoveryCode, newPassword) => {
  try {
    const res = await axios.put(`${baseUrl}/account/forgot-password`, {
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
    const res = await axios.post(
      `${baseUrl}/account/get-all-account?pageIndex=${pageIndex}&pageSize=${pageSize}`,
      []
    );
    return res.data;
  } catch (err) {
    return null;
  }
};

export const updateAccount = async (data) => {
  try {
    const res = await axios.put(`${baseUrl}/account/update-account`, data);
    return res.data;
  } catch (err) {
    return null;
  }
};
