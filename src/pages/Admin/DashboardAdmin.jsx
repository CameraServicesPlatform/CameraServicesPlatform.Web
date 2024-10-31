import { DatePicker, message, Spin, Table } from "antd"; // Import DatePicker
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getVouchersBySupplierId } from "../../api/voucherApi"; // Adjust the import path as needed
import AccountOrderStatistics from "../Dashboard/AccountOrderStatistics";
import BestSellingCategories from "../Dashboard/BestSellingCategories";
import BestSellingCategoriesBySupplier from "../Dashboard/BestSellingCategoriesBySupplier";
import MonthlyOrderCostStatistics from "../Dashboard/MonthlyOrderCostStatistics";
import MonthlyRevenueBySupplier from "../Dashboard/MonthlyRevenueBySupplier";
import SupplierOrderStatistics from "../Dashboard/SupplierOrderStatistics";
import SupplierProductStatistics from "../Dashboard/SupplierProductStatistics";
import TotalRevenueBySupplier from "../Dashboard/TotalRevenueBySupplier";

const { RangePicker } = DatePicker; // Destructure RangePicker from DatePicker

const DashboardAdmin = () => {
  const user = useSelector((state) => state.user.user || {});
  const accountId = user.id;
  const supplierID = user.supplierID; // Assuming supplierID is part of the user object

  const [vouchers, setVouchers] = useState([]);
  const [loadingVouchers, setLoadingVouchers] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalVouchers, setTotalVouchers] = useState(0);
  const [dateRange, setDateRange] = useState([null, null]); // State for date range

  useEffect(() => {
    const fetchVouchers = async (page, size, startDate, endDate) => {
      setLoadingVouchers(true);
      try {
        const voucherData = await getVouchersBySupplierId(
          supplierID,
          page,
          size,
          startDate,
          endDate
        );
        if (voucherData && voucherData.isSuccess) {
          setVouchers(
            Array.isArray(voucherData.result) ? voucherData.result : []
          );
          setTotalVouchers(voucherData.totalCount || 0); // Assuming the API returns total count
        } else {
          message.error("No vouchers available.");
        }
      } catch (error) {
        message.error("Failed to fetch vouchers.");
      }
      setLoadingVouchers(false);
    };

    if (supplierID) {
      const [start, end] = dateRange;
      fetchVouchers(
        currentPage,
        pageSize,
        start ? start.format("YYYY-MM-DD") : null,
        end ? end.format("YYYY-MM-DD") : null
      );
    }
  }, [supplierID, currentPage, pageSize, dateRange]);

  const handleDateChange = (dates) => {
    setDateRange(dates);
    setCurrentPage(1); // Reset to the first page when dates change
  };

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

  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  return (
    <div>
      <h1>Dashboard Admin</h1>

      {/* Date Range Picker */}
      <RangePicker
        onChange={handleDateChange}
        format="YYYY-MM-DD"
        style={{ marginBottom: 16 }} // Add some margin for spacing
      />

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {/* Left Column for Statistics */}
        <div style={{ flex: 1, marginRight: "16px" }}>
          <BestSellingCategories
            startDate={dateRange[0]?.format("YYYY-MM-DD")}
            endDate={dateRange[1]?.format("YYYY-MM-DD")}
          />
          <BestSellingCategoriesBySupplier
            supplierId={supplierID}
            startDate={dateRange[0]?.format("YYYY-MM-DD")}
            endDate={dateRange[1]?.format("YYYY-MM-DD")}
          />
          <SupplierProductStatistics supplierId={supplierID} />
          <MonthlyOrderCostStatistics
            supplierId={supplierID}
            startDate={dateRange[0]?.format("YYYY-MM-DD")}
            endDate={dateRange[1]?.format("YYYY-MM-DD")}
          />
          <AccountOrderStatistics
            accountId={accountId}
            startDate={dateRange[0]?.format("YYYY-MM-DD")}
            endDate={dateRange[1]?.format("YYYY-MM-DD")}
          />
          <SupplierOrderStatistics
            supplierId={supplierID}
            startDate={dateRange[0]?.format("YYYY-MM-DD")}
            endDate={dateRange[1]?.format("YYYY-MM-DD")}
          />
          <TotalRevenueBySupplier supplierId={supplierID} />
          <MonthlyRevenueBySupplier
            supplierId={supplierID}
            startDate={dateRange[0]?.format("YYYY-MM-DD")}
            endDate={dateRange[1]?.format("YYYY-MM-DD")}
          />
        </div>

        {/* Right Column for Vouchers Table */}
        <div style={{ flex: 1 }}>
          <h2>Vouchers</h2>
          {loadingVouchers ? ( // Show loading spinner while fetching
            <Spin tip="Loading vouchers..." />
          ) : (
            <Table
              dataSource={vouchers}
              columns={columns}
              rowKey="id"
              pagination={{
                current: currentPage,
                pageSize: pageSize,
                total: totalVouchers,
                showSizeChanger: true,
              }}
              onChange={handleTableChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
