import api from "../api/config";

export const updateContractById = async (contractId, contractData) => {
  try {
    const response = await api.put(
      "/contract/update-contract-by-id",
      contractData,
      {
        params: { contractId },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating contract by ID:", error);
    throw error;
  }
};

export const deleteContractById = async (contractId) => {
  try {
    const response = await api.delete("/contract/delete-contract-by-id", {
      params: { contractId },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting contract by ID:", error);
    throw error;
  }
};

export const getContractById = async (contractId) => {
  try {
    const response = await api.get("/contract/get-contract-by-id", {
      params: { contractId },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching contract by ID:", error);
    throw error;
  }
};

export const getAllContracts = async (pageIndex, pageSize) => {
  try {
    const response = await api.get("/contract/get-all-contracts", {
      params: { pageIndex, pageSize },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching all contracts:", error);
    throw error;
  }
};

export const getAllContractsByOrderId = async (
  orderID,
  pageIndex,
  pageSize
) => {
  try {
    const response = await api.get("/contract/get-all-contracts-by-order-id", {
      params: { orderID, pageIndex, pageSize },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching contracts by order ID:", error);
    throw error;
  }
};