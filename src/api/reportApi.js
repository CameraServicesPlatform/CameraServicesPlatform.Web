import api from "../api/config";

// Create a new report
export const createReport = async (data) => {
  try {
    const res = await api.post("/report/create-Report", data);
    return res.data;
  } catch (err) {
    console.error("Error creating report:", err);
    return null;
  }
};
// Update an existing report by ID
export const updateReport = async (reportId, data) => {
  try {
    const res = await api.put(`/report/update-report-by-id?reportId=${reportId}`, data);
    return res.data;
  } catch (err) {
    console.error("Error updating report:", err);
    return null;
  }
};
// Delete a report by ID
export const deleteReport = async (reportId) => {
  try {
    const res = await api.delete(`/report/delete-report-by-id?reportId=${reportId}`);
    return res.data;
  } catch (err) {
    console.error("Error deleting report:", err);
    return null;
  }
};
// Get a report by ID
export const getReportById = async (reportId) => {
  try {
    const res = await api.get(`/report/get-report-by-id?reportId=${reportId}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching report by ID:", err);
    return null;
  }
};
// Get all reports with pagination
export const getAllReports = async (pageIndex = 1, pageSize = 10) => {
  try {
    const res = await api.get(`/report/get-all-reports`, {
      params: { pageIndex, pageSize },
    });
    return res.data;
  } catch (err) {
    console.error("Error fetching all reports:", err);
    return null;
  }
};
