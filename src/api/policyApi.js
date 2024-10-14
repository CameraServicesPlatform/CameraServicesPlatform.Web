import api from "../api/config";

export const createPolicy = async (policyData) => {
  try {
    const res = await api.post(`/policy/create-policy`, policyData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (err) {
    console.error("Error creating policy:", err);
    return null;
  }
};

export const updatePolicyById = async (policyID, policyData) => {
  try {
    const res = await api.put(
      `/policy/update-policy-by-id?PolicyID=${policyID}`,
      policyData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  } catch (err) {
    console.error("Error updating policy:", err);
    return null;
  }
};

export const deletePolicyById = async (policyID) => {
  try {
    const res = await api.delete(
      `/policy/delete-policy-by-id?PolicyID=${policyID}`,
      {
        headers: {
          accept: "*/*",
        },
      }
    );
    return res.data;
  } catch (err) {
    console.error("Error deleting policy:", err);
    return null;
  }
};

export const getPolicyById = async (policyID) => {
  try {
    const res = await api.get(`/policy/get-policy-by-id?PolicyID=${policyID}`, {
      headers: {
        accept: "*/*",
      },
    });
    return res.data;
  } catch (err) {
    console.error("Error retrieving policy:", err);
    return null;
  }
};

export const getAllPolicies = async (pageIndex, pageSize) => {
  try {
    const res = await api.get(
      `/policy/get-all-policy?pageIndex=${pageIndex}&pageSize=${pageSize}`,
      {
        headers: {
          accept: "text/plain",
        },
      }
    );
    return res.data;
  } catch (err) {
    console.error("Error retrieving policies:", err);
    return null;
  }
};

export const getPoliciesByApplicableObject = async (
  type,
  pageIndex,
  pageSize
) => {
  try {
    const res = await api.get(
      `/policy/get-policy-by-applicable-object?type=${type}&pageIndex=${pageIndex}&pageSize=${pageSize}`,
      {
        headers: {
          accept: "*/*",
        },
      }
    );
    return res.data;
  } catch (err) {
    console.error("Error retrieving policies by applicable object:", err);
    return null;
  }
};
