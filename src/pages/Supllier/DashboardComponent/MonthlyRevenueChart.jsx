import React from "react";
import { Card } from "antd";
import { BarChartOutlined } from "@ant-design/icons";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts";

const MonthlyRevenueChart = ({ monthlyRevenue }) => (
  <Card
    title={
      <span>
        <BarChartOutlined /> Biểu Đồ Doanh Thu Hàng Tháng
      </span>
    }
    className="shadow-sm"
  >
    <LineChart width="100%" height={300} data={monthlyRevenue}>
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="totalRevenue" stroke="#8884d8" />
    </LineChart>
  </Card>
);

export default MonthlyRevenueChart;
