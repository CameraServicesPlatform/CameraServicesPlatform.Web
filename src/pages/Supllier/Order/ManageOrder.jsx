import { Card, message, Table, Tabs, Typography, DatePicker } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import { getSupplierIdByAccountId } from "../../../api/accountApi";
import {
  getCalculateTotalRevenueBySupplier,
  getMonthOrderCostStatistics,
  getSupplierOrderStatistics,
} from "../../../api/dashboardApi";
import OrderBuyListBySuplier from "../Order/OrderBuy/OrderBuyListBySuplier";
import OrderListBySuplier from "../Order/OrderListBySuplier";
import OrderRentListBySuplier from "../Order/OrderRent/OrderRentListBySuplier";

const { Text } = Typography;

const ManageOrder = () => {
  const [refreshList, setRefreshList] = useState(false);
  const user = useSelector((state) => state.user.user || {});
  const [supplierId, setSupplierId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    orderCostStatistics: [],
    orderStatistics: {},
    totalRevenue: 0,
  });
  const [startDate, setStartDate] = useState(() => dayjs().subtract(1, 'month'));
  const [endDate, setEndDate] = useState(() => dayjs());

  const fetchSupplierId = async () => {
    if (user.id) {
      try {
        const response = await getSupplierIdByAccountId(user.id);
        if (response?.isSuccess) {
          setSupplierId(response.result);
        } else {
          message.error("Không thể lấy ID nhà cung cấp.");
        }
      } catch {
        message.error("Lỗi khi lấy ID nhà cung cấp.");
      }
    }
  };

  const fetchDashboardData = async () => {
    if (supplierId) {
      try {
        setLoading(true);
        const [orderCostStatistics, orderStatistics, totalRevenue] =
          await Promise.all([
            getMonthOrderCostStatistics(supplierId, startDate, endDate),
            getSupplierOrderStatistics(supplierId, startDate, endDate),
            getCalculateTotalRevenueBySupplier(supplierId),
          ]);
        setData({
          orderCostStatistics: Array.isArray(orderCostStatistics)
            ? orderCostStatistics
            : [],
          orderStatistics: orderStatistics || {},
          totalRevenue: totalRevenue || 0,
        });
      } catch {
        message.error("Lỗi khi tải dữ liệu thống kê.");
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchSupplierId();
  }, [user]);

  useEffect(() => {
    fetchDashboardData();
  }, [supplierId, startDate, endDate]);

  const orderCostColumns = useMemo(
    () => [
      {
        title: "Tháng",
        dataIndex: "month",
        key: "month",
        render: (text) => new Date(text).toLocaleDateString(),
      },
      {
        title: "Tổng Chi Phí",
        dataIndex: "totalCost",
        key: "totalCost",
      },
    ],
    []
  );

  const orderStatisticsColumns = useMemo(
    () => [
      { title: "Tổng Bán", dataIndex: "totalSales", key: "totalSales" },
      { title: "Tổng Đơn", dataIndex: "totalOrders", key: "totalOrders" },
      {
        title: "Đơn Đang Chờ",
        dataIndex: "pendingOrders",
        key: "pendingOrders",
      },
      {
        title: "Đơn Hoàn Thành",
        dataIndex: "completedOrders",
        key: "completedOrders",
      },
      { title: "Đơn Hủy", dataIndex: "canceledOrders", key: "canceledOrders" },
    ],
    []
  );

  const tabItems = [
    {
      key: "1",
      label: (
        <span className="font-medium text-lg text-gray-700">
          Danh sách đơn hàng
        </span>
      ),
      children: <OrderListBySuplier refresh={refreshList} />,
    },
    {
      key: "2",
      label: (
        <span className="font-medium text-lg text-gray-700">
          Danh sách đơn hàng mua
        </span>
      ),
      children: <OrderBuyListBySuplier refresh={refreshList} />,
    },
    {
      key: "3",
      label: (
        <span className="font-medium text-lg text-gray-700">
          Danh sách đơn hàng thuê
        </span>
      ),
      children: <OrderRentListBySuplier refresh={refreshList} />,
    },
  ];

  return (
    <div className="p-8 bg-gradient-to-br from-blue-50 to-white rounded-lg shadow-lg max-w-1xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
        TRANG QUẢN LÍ ĐƠN HÀNG
      </h1>
      <div className="flex justify-between mb-4">
        <DatePicker 
          placeholder="Chọn ngày bắt đầu" 
          onChange={(date) => setStartDate(date)} 
          defaultValue={startDate}
        />
        <DatePicker 
          placeholder="Chọn ngày kết thúc" 
          onChange={(date) => setEndDate(date)} 
          defaultValue={endDate}
        />
      </div>
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
      <Tabs
        defaultActiveKey="1"
        items={tabItems}
        className="custom-tabs"
        tabBarStyle={{
          padding: "1rem",
          backgroundColor: "#f1f5f9",
          borderRadius: "4px",
          fontSize: "1rem",
        }}
        tabBarExtraContent={<span className="text-gray-500 italic"></span>}
      />

      <style jsx>{`
        @media (forced-colors: active) {
          /* Styles for forced colors mode */
          body {
            background-color: Window;
            color: WindowText;
          }
          .custom-tabs {
            background-color: Window;
            border-color: WindowText;
          }
          .ant-tabs-card {
            background-color: Window;
          }
        }
      `}</style>
    </div>
  );
};

export default ManageOrder;
