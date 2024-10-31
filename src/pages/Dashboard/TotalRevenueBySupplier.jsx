import React, { useEffect, useState } from "react";
import { getCalculateTotalRevenueBySupplier } from "../../api/dashboardApi";

const TotalRevenueBySupplier = ({ supplierId }) => {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTotalRevenue = async () => {
      try {
        const revenue = await getCalculateTotalRevenueBySupplier(supplierId);
        setTotalRevenue(revenue);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTotalRevenue();
  }, [supplierId]);

  return loading ? (
    <div>Loading...</div>
  ) : (
    <div>Total Revenue: {totalRevenue}</div>
  );
};

export default TotalRevenueBySupplier;
