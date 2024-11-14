import { Card, Descriptions } from "antd";
import React from "react";

const OrderConfirmation = ({ totalAmount }) => (
  <div>
    <Card title="Xác nhận đơn hàng" bordered={false}>
      <Descriptions bordered column={1}>
        <Descriptions.Item label="Tổng số tiền">
          {totalAmount}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  </div>
);

export default OrderConfirmation;
