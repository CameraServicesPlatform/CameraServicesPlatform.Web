import { useState } from "react";
import api from "../config/axios";

const callApi = async (method, endpoint, requestData) => {
  try {
    let response;
    switch (method) {
      case "GET":
        response = await api.get(endpoint);
        break;
      case "POST":
        response = await api.post(endpoint, requestData);
        break;
      case "PUT":
        response = await api.put(endpoint, requestData);
        break;
      case "DELETE":
        response = await api.delete(endpoint);
        break;
      default:
        throw new Error("Unsupported HTTP method");
    }
    return response.data;
  } catch (error) {
  
  } finally {
  }
};

export {  callApi};
