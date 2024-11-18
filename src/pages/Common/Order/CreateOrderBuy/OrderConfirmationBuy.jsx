import { Card, Descriptions } from "antd";
import React from "react";

const OrderConfirmationBuy = ({ totalAmount }) => (
  <div>
    <Card title="Xác nhận đơn hàng" bordered={false}>
      <Descriptions bordered column={1}>
        <Descriptions.Item label="Tổng số tiền">
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(totalAmount)}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  </div>
);

export default OrderConfirmationBuy;
