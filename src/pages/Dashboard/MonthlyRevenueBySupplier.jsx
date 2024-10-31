import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { getCalculateMonthlyRevenueBySupplier } from "../../api/dashboardApi";

const MonthlyRevenueBySupplier = ({ supplierId, startDate, endDate }) => {
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMonthlyRevenue = async () => {
      try {
        const data = await getCalculateMonthlyRevenueBySupplier(
          supplierId,
          startDate,
          endDate
        );
        setMonthlyRevenue(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMonthlyRevenue();
  }, [supplierId, startDate, endDate]);

  const chartData = {
    labels: monthlyRevenue.map((month) => month.month),
    datasets: [
      {
        label: "Revenue",
        data: monthlyRevenue.map((month) => month.revenue),
        fill: false,
        borderColor: "rgba(255, 206, 86, 1)",
        tension: 0.1,
      },
    ],
  };

  return loading ? <div>Loading...</div> : <Line data={chartData} />;
};

export default MonthlyRevenueBySupplier;
