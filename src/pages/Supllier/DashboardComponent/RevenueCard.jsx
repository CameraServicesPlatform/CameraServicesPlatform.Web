import React from "react";
import { Card, Typography } from "antd";
import { DollarOutlined } from "@ant-design/icons";

const formatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});

const RevenueCard = ({ totalRevenue }) => (
  <Card
    title={
      <span>
        <DollarOutlined /> Tổng Doanh Thu
      </span>
    }
    className="shadow-sm"
  >
    <Typography.Text className="text-32 text-green-600">
      {formatter.format(totalRevenue)}
    </Typography.Text>
  </Card>
);

export default RevenueCard;
