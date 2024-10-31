import { Table, message } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getVouchersBySupplierId } from "../api/dashboard"; // Adjust the import path as needed
import AccountOrderStatistics from "./AccountOrderStatistics";
import BestSellingCategories from "./BestSellingCategories";
import BestSellingCategoriesBySupplier from "./BestSellingCategoriesBySupplier";
import MonthlyOrderCostStatistics from "./MonthlyOrderCostStatistics";
import MonthlyRevenueBySupplier from "./MonthlyRevenueBySupplier";
import SupplierOrderStatistics from "./SupplierOrderStatistics";
import SupplierProductStatistics from "./SupplierProductStatistics";
import TotalRevenueBySupplier from "./TotalRevenueBySupplier";

const DashboardSupplier = () => {
  const user = useSelector((state) => state.user.user || {});
  const accountId = user.id;
  const supplierID = user.supplierID; // Assuming supplierID is part of the user object

  const [vouchers, setVouchers] = useState([]);
  const [loadingVouchers, setLoadingVouchers] = useState(false);

  useEffect(() => {
    const fetchVouchers = async () => {
      setLoadingVouchers(true);
      try {
        const voucherData = await getVouchersBySupplierId(supplierID, 1, 10); // Adjust pageIndex and pageSize as needed
        if (voucherData && voucherData.isSuccess) {
          setVouchers(voucherData.result || []);
        } else {
          message.error("No vouchers available.");
        }
      } catch (error) {
        message.error("Failed to fetch vouchers.");
      }
      setLoadingVouchers(false);
    };

    if (supplierID) {
      fetchVouchers();
    }
  }, [supplierID]);

  const startDate = "2023-01-01";
  const endDate = "2023-12-31";

  // Define columns for the Table component
  const columns = [
    {
      title: "Voucher ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Voucher Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Voucher Value",
      dataIndex: "value",
      key: "value",
    },
    // Add more columns as needed based on your voucher data structure
  ];

  return (
    <div>
      <h1>Dashboard Admin</h1>
      <BestSellingCategories startDate={startDate} endDate={endDate} />
      <BestSellingCategoriesBySupplier
        supplierId={supplierID}
        startDate={startDate}
        endDate={endDate}
      />
      <SupplierProductStatistics supplierId={supplierID} />
      <MonthlyOrderCostStatistics
        supplierId={supplierID}
        startDate={startDate}
        endDate={endDate}
      />
      <AccountOrderStatistics
        accountId={accountId}
        startDate={startDate}
        endDate={endDate}
      />
      <SupplierOrderStatistics
        supplierId={supplierID}
        startDate={startDate}
        endDate={endDate}
      />
      <TotalRevenueBySupplier supplierId={supplierID} />
      <MonthlyRevenueBySupplier
        supplierId={supplierID}
        startDate={startDate}
        endDate={endDate}
      />

      {/* Render vouchers in a Table component */}
      <h2>Vouchers</h2>
      <Table
        dataSource={vouchers}
        columns={columns}
        rowKey="id"
        loading={loadingVouchers}
      />
    </div>
  );
};

export default DashboardSupplier;
