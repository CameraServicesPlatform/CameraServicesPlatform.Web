import { message } from "antd";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { createReport } from "../../../api/reportApi"; // Adjust the import based on your project structure

const CreateReportSystemForm = () => {
  const user = useSelector((state) => state.user);
  const [reportType, setReportType] = useState(1); // Default to Supplier
  const [reportDetails, setReportDetails] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const data = {
      accountId: user.id,
      reportType,
      reportDetails,
    };

    try {
      const response = await createReport(data);
      if (response.isSuccess) {
        message.success("Report created successfully.");
      } else {
        message.error("Failed to create report.");
      }
    } catch (error) {
      console.error("Error creating report:", error);
      message.error("An error occurred, please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>Create System Report</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="reportType">Report Type:</label>
          <select
            id="reportType"
            value={reportType}
            onChange={(e) => setReportType(Number(e.target.value))}
          >
            <option value={1}>Supplier</option>
            <option value={2}>System</option>
          </select>
        </div>
        <div>
          <label htmlFor="reportDetails">Report Details:</label>
          <textarea
            id="reportDetails"
            value={reportDetails}
            onChange={(e) => setReportDetails(e.target.value)}
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Submitting..." : "Submit Report"}
        </button>
      </form>
    </div>
  );
};

export default CreateReportSystemForm;
