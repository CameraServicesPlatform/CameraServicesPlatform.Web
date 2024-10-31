import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { getBestSellingCategoriesBySupplier } from "../../api/dashboardApi";

const BestSellingCategoriesBySupplier = ({
  supplierId,
  startDate,
  endDate,
}) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getBestSellingCategoriesBySupplier(
          supplierId,
          startDate,
          endDate
        );
        setCategories(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [supplierId, startDate, endDate]);

  const chartData = {
    labels: categories.map((cat) => cat.name),
    datasets: [
      {
        label: "Sales",
        data: categories.map((cat) => cat.sales),
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  };

  return loading ? <div>Loading...</div> : <Bar data={chartData} />;
};

export default BestSellingCategoriesBySupplier;
