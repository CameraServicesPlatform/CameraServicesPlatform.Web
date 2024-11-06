import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2"; // Ensure you have installed chart.js and react-chartjs-2
import { getMonthOrderCostStatistics } from "../../api/dashboardApi";

const MonthlyOrderCostStatistics = ({ supplierId, startDate, endDate }) => {
  const [monthlyCosts, setMonthlyCosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMonthlyCosts = async () => {
      try {
        const data = await getMonthOrderCostStatistics(
          supplierId,
          startDate,
          endDate
        );
        setMonthlyCosts(data);
      } catch (error) {
        console.error("Error fetching monthly costs:", error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch data only if supplierId, startDate, and endDate are provided
    if (supplierId && startDate && endDate) {
      fetchMonthlyCosts();
    }
  }, [supplierId, startDate, endDate]);

  // Prepare data for the line chart
  const chartData = {
    labels: monthlyCosts.map((month) => month.month), // Extract month names for labels
    datasets: [
      {
        label: "Order Cost",
        data: monthlyCosts.map((month) => month.cost), // Extract cost data
        fill: false,
        borderColor: "rgba(255, 99, 132, 1)", // Color of the line
        tension: 0.1, // Curve of the line
      },
    ],
  };

  // Render loading state or chart
  return loading ? <div>Loading...</div> : <Line data={chartData} />;
};

export default MonthlyOrderCostStatistics;
