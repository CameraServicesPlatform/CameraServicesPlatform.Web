import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { getBestSellingCategories } from "../../api/dashboardApi";

const BestSellingCategories = ({ startDate, endDate }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getBestSellingCategories(startDate, endDate);
        setCategories(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (startDate && endDate) {
      fetchCategories();
    }
  }, [startDate, endDate]);

  const chartData = {
    labels: categories.map((cat) => cat.name),
    datasets: [
      {
        label: "Sales",
        data: categories.map((cat) => cat.sales),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  return loading ? <div>Loading...</div> : <Bar data={chartData} />;
};

export default BestSellingCategories;
