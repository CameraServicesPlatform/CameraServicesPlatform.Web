import { Card, Descriptions, Typography } from "antd";
import React from "react";

const OrderConfirmation = ({
  totalAmount,
  depositProduct,
  productPriceRent,
  selectedVoucherDetails,
  reservationMoney,
}) => {
  return (
    <Card title="Xác nhận đơn hàng" bordered={false}>
      <Descriptions bordered column={1}>
        <Descriptions.Item label="Giá thuê sản phẩm">
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(productPriceRent)}
        </Descriptions.Item>
        <Descriptions.Item label="Tiền cọc sản phẩm">
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(depositProduct)}
        </Descriptions.Item>
        {selectedVoucherDetails && (
          <Descriptions.Item label="Mã Voucher">
            {selectedVoucherDetails.vourcherCode}
          </Descriptions.Item>
        )}
        {selectedVoucherDetails && (
          <Descriptions.Item label="Số tiền giảm">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(selectedVoucherDetails.discountAmount)}
          </Descriptions.Item>
        )}
         <Descriptions.Item label="Tiền giữ sản phẩm">
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(reservationMoney)}
        </Descriptions.Item>
       
        {/* Other Descriptions.Items */}
         <Descriptions.Item label="Tổng số tiền">
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(totalAmount)}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default OrderConfirmation;
