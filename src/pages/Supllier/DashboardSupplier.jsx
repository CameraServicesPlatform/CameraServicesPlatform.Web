import { Card, DatePicker, message, Spin, Table, Typography } from "antd";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Legend, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";
import { getSupplierIdByAccountId } from "../../api/accountApi";
import {
  getBestSellingCategoriesBySupplier,
  getCalculateMonthlyRevenueBySupplier,
  getCalculateTotalRevenueBySupplier,
  getMonthOrderCostStatistics,
  getOrderStatusStatisticsBySupplier,
  getSupplierOrderStatistics,
  getSupplierPaymentStatistics,
  getSupplierProductStatistics,
  getSupplierRatingStatistics,
  getSupplierTransactionStatistics,
} from "../../api/dashboardApi";

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

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
    paymentStatistics: [],
    transactionStatistics: [],
    orderStatusStatistics: [],
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
            message.error("Không thể lấy ID nhà cung cấp.");
          }
        } catch (error) {
          message.error("Lỗi khi lấy ID nhà cung cấp.");
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
          const paymentStatistics = await getSupplierPaymentStatistics(
            supplierId,
            startDate,
            endDate
          );
          const transactionStatistics = await getSupplierTransactionStatistics(
            supplierId,
            startDate,
            endDate
          );
          const orderStatusStatistics =
            await getOrderStatusStatisticsBySupplier(supplierId);

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
            paymentStatistics: Array.isArray(paymentStatistics)
              ? paymentStatistics
              : [],
            transactionStatistics: Array.isArray(transactionStatistics)
              ? transactionStatistics
              : [],
            orderStatusStatistics: Array.isArray(orderStatusStatistics)
              ? orderStatusStatistics
              : [],
          });
        } catch (error) {
          message.error("Lỗi khi lấy dữ liệu.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [supplierId, dateRange]);

  const handleDateChange = useCallback((dates) => {
    if (dates) {
      setDateRange([
        dates[0].format("YYYY-MM-DD"),
        dates[1].format("YYYY-MM-DD"),
      ]);
    } else {
      setDateRange([]);
    }
  }, []);

  const columns = useMemo(
    () => [
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
    ],
    []
  );

  const orderCostColumns = useMemo(
    () => [
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
    ],
    []
  );

  const orderStatisticsColumns = useMemo(
    () => [
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
    ],
    []
  );

  return (
    <div className="container mx-auto p-4">
      <Title level={1} className="text-center mb-8">
        Bảng Điều Khiển Nhà Cung Cấp
      </Title>
      <Card className="mb-4">
        <RangePicker onChange={handleDateChange} />
      </Card>
      {loading ? (
        <Spin className="flex justify-center items-center h-64" />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          <Card title="Thống Kê Sản Phẩm">
            <Table
              dataSource={data.productStatistics}
              columns={columns}
              pagination={false}
            />
          </Card>
          <Card title="Thống Kê Chi Phí Đơn Hàng">
            <Table
              dataSource={data.orderCostStatistics}
              columns={orderCostColumns}
              pagination={false}
            />
          </Card>
          <Card title="Thống Kê Đơn Hàng">
            <Table
              dataSource={[data.orderStatistics]}
              columns={orderStatisticsColumns}
              pagination={false}
            />
          </Card>
          <Card title="Tổng Doanh Thu">
            <Text className="text-lg">{data.totalRevenue}</Text>
          </Card>

          <Card title="Biểu Đồ Doanh Thu Hàng Tháng">
            <LineChart width={500} height={300} data={data.monthlyRevenue}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="totalRevenue" stroke="#8884d8" />
            </LineChart>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DashboardSupplier;
