import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
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
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMonthlyCosts();
  }, [supplierId, startDate, endDate]);

  const chartData = {
    labels: monthlyCosts.map((month) => month.month),
    datasets: [
      {
        label: "Order Cost",
        data: monthlyCosts.map((month) => month.cost),
        fill: false,
        borderColor: "rgba(255, 99, 132, 1)",
        tension: 0.1,
      },
    ],
  };

  return loading ? <div>Loading...</div> : <Line data={chartData} />;
};

export default MonthlyOrderCostStatistics;
