import { Card, List, message } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getSupplierIdByAccountId } from "../../../api/accountApi";
import { getProductReportBySupplierId } from "../../../api/ProductVoucherApi";

const ReportListBySupplierId = () => {
  const user = useSelector((state) => state.user.user || {});
  const [supplierId, setSupplierId] = useState(null);
  const [reportData, setReportData] = useState([]);

  const fetchSupplierId = async () => {
    if (user.id) {
      try {
        const response = await getSupplierIdByAccountId(user.id);
        console.log("Supplier ID Response:", response);
        if (response?.isSuccess) {
          setSupplierId(response.result);
        } else {
          message.error("Failed to get Supplier ID.");
        }
      } catch (error) {
        message.error("Error fetching Supplier ID.");
      }
    }
  };

  const fetchProductReport = async (supplierId) => {
    try {
      const response = await getProductReportBySupplierId(supplierId);
      console.log("Product Report Response:", response);
      if (response?.isSuccess) {
        setReportData(response.result);
      } else {
        message.error("Failed to get Product Report.");
      }
    } catch (error) {
      message.error("Error fetching Product Report.");
    }
  };

  useEffect(() => {
    fetchSupplierId();
  }, [user.id]);

  useEffect(() => {
    if (supplierId) {
      fetchProductReport(supplierId);
    }
  }, [supplierId]);

  return (
    <div className="p-4">
      {reportData.length > 0 ? (
        <List
          grid={{ gutter: 16, column: 1 }}
          dataSource={reportData}
          renderItem={(report) => (
            <List.Item>
              <Card title={`Product ID: ${report.productID}`}>
                <p>Supplier ID: {report.supplierID}</p>
                <p>Status Type: {report.statusType}</p>
                <p>Start Date: {report.startDate}</p>
                <p>End Date: {report.endDate}</p>
                <p>Reason: {report.reason}</p>
                <p>Account ID: {report.accountID}</p>
              </Card>
            </List.Item>
          )}
        />
      ) : (
        <p className="text-center text-gray-500">No reports available.</p>
      )}
    </div>
  );
};

export default ReportListBySupplierId;
