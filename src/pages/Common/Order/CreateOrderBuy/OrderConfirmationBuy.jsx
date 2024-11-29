import { Card, Descriptions } from "antd";
import React from "react";

const OrderConfirmationBuy = ({ totalAmount, selectedVoucherDetails }) => {
  return (
    <div>
      <Card title="Xác nhận đơn hàng" bordered={false}>
        <Descriptions bordered column={1}>
          {selectedVoucherDetails && (
            <>
              <Descriptions.Item label="Mã Voucher">
                {selectedVoucherDetails.vourcherCode}
              </Descriptions.Item>
              <Descriptions.Item label="Số tiền giảm">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(selectedVoucherDetails.discountAmount)}
              </Descriptions.Item>
            </>
          )}
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
};

export default OrderConfirmationBuy;
