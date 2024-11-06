import { Table } from "antd";
import React, { useEffect, useState } from "react";
import { getSupplierProductStatistics } from "../../api/dashboardApi";

const SupplierProductStatistics = ({ supplierId }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getSupplierProductStatistics(supplierId);
        setProducts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [supplierId]);

  const columns = [
    {
      title: "Product Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Sales",
      dataIndex: "sales",
      key: "sales",
    },
  ];

  return loading ? (
    <div>Loading...</div>
  ) : (
    <Table dataSource={products} columns={columns} />
  );
};

export default SupplierProductStatistics;
