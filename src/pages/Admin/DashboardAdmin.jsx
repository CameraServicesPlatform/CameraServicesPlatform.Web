import { Col, DatePicker, message, Row, Spin, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getVouchersBySupplierId } from "../../api/voucherApi";
import AccountOrderStatistics from "../Dashboard/AccountOrderStatistics";
import BestSellingCategories from "../Dashboard/BestSellingCategories";
import BestSellingCategoriesBySupplier from "../Dashboard/BestSellingCategoriesBySupplier";
import MonthlyOrderCostStatistics from "../Dashboard/MonthlyOrderCostStatistics";
import MonthlyRevenueBySupplier from "../Dashboard/MonthlyRevenueBySupplier";
import SupplierOrderStatistics from "../Dashboard/SupplierOrderStatistics";
import SupplierProductStatistics from "../Dashboard/SupplierProductStatistics";
import TotalRevenueBySupplier from "../Dashboard/TotalRevenueBySupplier";

const { RangePicker } = DatePicker;
const DashboardAdmin = () => {
  const user = useSelector((state) => state.user.user || {});
  const accountId = user.id;
  const supplierID = user.supplierID;

  const [vouchers, setVouchers] = useState([]);
  const [loadingVouchers, setLoadingVouchers] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalVouchers, setTotalVouchers] = useState(0);
  const [dateRange, setDateRange] = useState([null, null]);

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
          setTotalVouchers(voucherData.totalCount || 0);
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
        start ? start.format("DD-MM-YYYY") : null,
        end ? end.format("DD-MM-YYYY") : null
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
        format="DD-MM-YYYY"
        style={{ marginBottom: 16 }} // Add some margin for spacing
      />

      {/* Dashboard Sections */}
      <Row gutter={16}>
        {" "}
        {/* Use Row with gutter for spacing */}
        <Col span={12}>
          {" "}
          {/* Left column - Adjust span as necessary */}
          <BestSellingCategories
            startDate={dateRange[0]?.format("DD-MM-YYYY")}
            endDate={dateRange[1]?.format("DD-MM-YYYY")}
          />
          <BestSellingCategoriesBySupplier
            supplierId={supplierID}
            startDate={dateRange[0]?.format("DD-MM-YYYY")}
            endDate={dateRange[1]?.format("DD-MM-YYYY")}
          />
          <SupplierProductStatistics supplierId={supplierID} />
        </Col>
        <Col span={12}>
          {" "}
          {/* Right column - Adjust span as necessary */}
          <MonthlyOrderCostStatistics
            supplierId={supplierID}
            startDate={dateRange[0]?.format("DD-MM-YYYY")}
            endDate={dateRange[1]?.format("DD-MM-YYYY")}
          />
          <AccountOrderStatistics
            accountId={accountId}
            startDate={dateRange[0]?.format("DD-MM-YYYY")}
            endDate={dateRange[1]?.format("DD-MM-YYYY")}
          />
          <SupplierOrderStatistics
            supplierId={supplierID}
            startDate={dateRange[0]?.format("DD-MM-YYYY")}
            endDate={dateRange[1]?.format("DD-MM-YYYY")}
          />
          <TotalRevenueBySupplier supplierId={supplierID} />
          <MonthlyRevenueBySupplier
            supplierId={supplierID}
            startDate={dateRange[0]?.format("DD-MM-YYYY")}
            endDate={dateRange[1]?.format("DD-MM-YYYY")}
          />
        </Col>
      </Row>

      {/* Render vouchers in a Table component */}
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
  );
};

export default DashboardAdmin;
