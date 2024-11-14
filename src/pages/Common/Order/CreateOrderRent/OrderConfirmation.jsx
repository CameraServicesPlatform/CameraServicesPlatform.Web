import { Button, Card, Descriptions, Form } from "antd";
import React from "react";

const OrderConfirmation = ({ totalAmount }) => (
  <div>
    <Card title="Xác nhận đơn hàng" bordered={false}>
      <Descriptions bordered column={1}>
        <Descriptions.Item label="Tổng số tiền">
          {totalAmount}
        </Descriptions.Item>
      </Descriptions>
      <Form.Item style={{ marginTop: "16px" }}>
        <Button type="primary" htmlType="submit">
          Tạo đơn hàng
        </Button>
      </Form.Item>
    </Card>
  </div>
);

export default OrderConfirmation;
