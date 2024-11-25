import { Table, message } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getSupplierIdByAccountId } from "../../api/accountApi";
import { getSupplierProductStatistics } from "../../api/dashboardApi";

const SupplierProductStatistics = () => {
  const user = useSelector((state) => state.user.user || {});
  const [supplierId, setSupplierId] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSupplierId = async () => {
    if (user.id) {
      try {
        const response = await getSupplierIdByAccountId(user.id);
        if (response?.isSuccess) {
          setSupplierId(response.result);
        } else {
          message.error("Không lấy được ID nhà cung cấp.");
        }
      } catch (error) {
        message.error("Có lỗi xảy ra khi lấy ID nhà cung cấp.");
      }
    }
  };

  useEffect(() => {
    fetchSupplierId();
  }, [user]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (supplierId) {
        try {
          const data = await getSupplierProductStatistics(supplierId);
          setProducts(data);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProducts();
  }, [supplierId]);

  const columns = [
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Product ID",
      dataIndex: "productId",
      key: "productId",
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={products}
      loading={loading}
      rowKey="productId"
    />
  );
};

export default SupplierProductStatistics;
