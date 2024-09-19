import axios from "axios";
import { baseUrl } from "./config";

export const getAllEvent = async (pageNumber, pageSize) => {
    try {
      const res = await axios.get(`${baseUrl}/api/Event/get-all-event?pageNumber=${pageNumber}&pageSize=${pageSize}`);
      return res.data;
    } catch (err) {
      return null;
    }
  };
  
  export const getEventById = async (id) => {
    try {
      const res = await axios.get(`${baseUrl}/api/Event/get-event-by-id/${id}`);
      return res.data;
    } catch (err) {
      return null;
    }
  }