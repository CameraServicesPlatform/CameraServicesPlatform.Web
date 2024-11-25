import { Card, DatePicker, message, Spin, Table } from "antd";
import React, { useEffect, useState, useMemo, useCallback } from "react"; // Added useMemo, useCallback
import { useSelector } from "react-redux";
import { getSupplierIdByAccountId } from "../../api/accountApi";
import {
  getBestSellingCategoriesBySupplier,
  getCalculateMonthlyRevenueBySupplier,
  getCalculateTotalRevenueBySupplier,
  getMonthOrderCostStatistics,
  getSupplierOrderStatistics,
  getSupplierProductStatistics,
  getSupplierRatingStatistics,
} from "../../api/dashboardApi";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, PieChart, Pie } from 'recharts'; // Add chart components

const { RangePicker } = DatePicker;

const DashboardSupplier = () => {
  const user = useSelector((state) => state.user.user || {});
  const accountId = user.id;
  const [supplierId, setSupplierId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    bestSellingCategories: [],
    productStatistics: [],
    orderCostStatistics: [],
    orderStatistics: {},
    totalRevenue: 0,
    monthlyRevenue: [],
    ratingStatistics: [],
  });
  const [dateRange, setDateRange] = useState([]);

  useEffect(() => {
    const fetchSupplierId = async () => {
      if (user.id) {
        try {
          const response = await getSupplierIdByAccountId(user.id);
          if (response?.isSuccess) {
            setSupplierId(response.result);
          } else {
            message.error("Không thể lấy ID nhà cung cấp."); // Translated 'Failed to fetch supplier ID.'
          }
        } catch (error) {
          message.error("Lỗi khi lấy ID nhà cung cấp."); // Translated 'Error fetching supplier ID.'
        }
      }
    };

    fetchSupplierId();
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      if (supplierId && dateRange.length === 2) {
        setLoading(true);
        try {
          const [startDate, endDate] = dateRange;
          const bestSellingCategories =
            await getBestSellingCategoriesBySupplier(
              supplierId,
              startDate,
              endDate
            );
          const productStatistics = await getSupplierProductStatistics(
            supplierId
          );
          const orderCostStatistics = await getMonthOrderCostStatistics(
            supplierId,
            startDate,
            endDate
          );
          const orderStatistics = await getSupplierOrderStatistics(
            supplierId,
            startDate,
            endDate
          );
          const totalRevenue = await getCalculateTotalRevenueBySupplier(
            supplierId
          );
          const monthlyRevenue = await getCalculateMonthlyRevenueBySupplier(
            supplierId,
            startDate,
            endDate
          );
          const ratingStatistics = await getSupplierRatingStatistics(
            supplierId
          );

          setData({
            bestSellingCategories: Array.isArray(bestSellingCategories)
              ? bestSellingCategories
              : [],
            productStatistics: Array.isArray(productStatistics)
              ? productStatistics
              : [],
            orderCostStatistics: Array.isArray(orderCostStatistics)
              ? orderCostStatistics
              : [],
            orderStatistics: orderStatistics || {},
            totalRevenue: totalRevenue || 0,
            monthlyRevenue: Array.isArray(monthlyRevenue) ? monthlyRevenue : [],
            ratingStatistics: Array.isArray(ratingStatistics)
              ? ratingStatistics
              : [],
          });
        } catch (error) {
          message.error("Lỗi khi lấy dữ liệu."); // Translated 'Error fetching data.'
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [supplierId, dateRange]);

  const handleDateChange = useCallback((dates) => { // Wrapped with useCallback
    if (dates) {
      setDateRange([dates[0].format("MM-DD-YY"), dates[1].format("MM-DD-YY")]);
    } else {
      setDateRange([]);
    }
  }, []);

  const columns = useMemo(() => [ // Wrapped with useMemo
    {
      title: "Product ID",
      dataIndex: "productId",
      key: "productId",
    },
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
    },
  ], []);

  const orderCostColumns = useMemo(() => [ // Wrapped with useMemo
    {
      title: "Month",
      dataIndex: "month",
      key: "month",
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Total Cost",
      dataIndex: "totalCost",
      key: "totalCost",
    },
  ], []);

  const orderStatisticsColumns = useMemo(() => [ // Wrapped with useMemo
    {
      title: "Total Sales",
      dataIndex: "totalSales",
      key: "totalSales",
    },
    {
      title: "Total Orders",
      dataIndex: "totalOrders",
      key: "totalOrders",
    },
    {
      title: "Pending Orders",
      dataIndex: "pendingOrders",
      key: "pendingOrders",
    },
    {
      title: "Completed Orders",
      dataIndex: "completedOrders",
      key: "completedOrders",
    },
    {
      title: "Canceled Orders",
      dataIndex: "canceledOrders",
      key: "canceledOrders",
    },
  ], []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Bảng Điều Khiển Nhà Cung Cấp</h1> {/* Translated 'Dashboard Supplier' */}
      <Card className="mb-4">
        <RangePicker onChange={handleDateChange} />
      </Card>
      {loading ? (
        <Spin className="flex justify-center items-center h-64" />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          <Card title="Các Danh Mục Bán Chạy Nhất"> {/* Translated 'Best Selling Categories' */}
            <Table
              dataSource={data.bestSellingCategories}
              columns={columns}
              pagination={false}
            />
          </Card>
          <Card title="Thống Kê Sản Phẩm"> {/* Translated 'Product Statistics' */}
            <Table
              dataSource={data.productStatistics}
              columns={columns}
              pagination={false}
            />
          </Card>
          <Card title="Thống Kê Chi Phí Đơn Hàng"> {/* Translated 'Order Cost Statistics' */}
            <Table
              dataSource={data.orderCostStatistics}
              columns={orderCostColumns}
              pagination={false}
            />
          </Card>
          <Card title="Thống Kê Đơn Hàng"> {/* Translated 'Order Statistics' */}
            <Table
              dataSource={[data.orderStatistics]}
              columns={orderStatisticsColumns}
              pagination={false}
            />
          </Card>
          <Card title="Tổng Doanh Thu"> {/* Translated 'Total Revenue' */}
            <p className="text-lg">{data.totalRevenue}</p>
          </Card>
          <Card title="Doanh Thu Hàng Tháng"> {/* Translated 'Monthly Revenue' */}
            <Table
              dataSource={data.monthlyRevenue}
              columns={orderCostColumns}
              pagination={false}
            />
          </Card>
          <Card title="Thống Kê Đánh Giá"> {/* Translated 'Rating Statistics' */}
            <Table
              dataSource={data.ratingStatistics}
              columns={columns}
              pagination={false}
            />
          </Card>
          {/* Add a new card with a line chart for Monthly Revenue */}
          <Card title="Biểu Đồ Doanh Thu Hàng Tháng"> {/* Translated 'Monthly Revenue Chart' */}
            <LineChart width={500} height={300} data={data.monthlyRevenue}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="totalRevenue" stroke="#8884d8" />
            </LineChart>
          </Card>
          {/* Add a new card with a pie chart for Rating Statistics */}
          <Card title="Biểu Đồ Thống Kê Đánh Giá"> {/* Translated 'Rating Statistics Chart' */}
            <PieChart width={400} height={400}>
              <Pie
                data={data.ratingStatistics}
                dataKey="rating"
                nameKey="productName"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#82ca9d"
                label
              />
              <Tooltip />
            </PieChart>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DashboardSupplier;
