import {
  DollarOutlined,
  FileTextOutlined,
  InfoCircleOutlined,
  TagOutlined,
} from "@ant-design/icons";
import { Card, Col, Descriptions, Row } from "antd";
import React from "react";

const OrderReviewBuy = ({
  product,
  form,
  deliveryMethod,
  supplierInfo,
  selectedVoucherDetails,
  totalAmount,
}) => {
  return (
    <Card title="Xem lại đơn hàng" bordered={false}>
      <Row gutter={16}>
        <Col span={12}>
          <Descriptions column={1} bordered>
            <Descriptions.Item
              label={
                <span>
                  <TagOutlined /> Mã sản phẩm
                </span>
              }
            >
              {product.productID}
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <span>
                  <InfoCircleOutlined /> Tên
                </span>
              }
            >
              {product.productName}
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <span>
                  <FileTextOutlined /> Mô tả
                </span>
              }
            >
              {product.productDescription}
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <span>
                  <DollarOutlined /> Giá
                </span>
              }
            >
              <div style={{ color: "#52c41a" }}>
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(product.price)}
              </div>
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <span>
                  <InfoCircleOutlined /> Chất lượng
                </span>
              }
            >
              {product.quality}
            </Descriptions.Item>
          </Descriptions>
        </Col>
        <Col span={12}>
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Phương thức giao hàng">
              {deliveryMethod === 0 ? "Giao hàng tận nơi" : "Nhận tại cửa hàng"}
            </Descriptions.Item>
            <Descriptions.Item label="Thông tin nhà cung cấp">
              {supplierInfo ? supplierInfo.name : "Không có thông tin"}
            </Descriptions.Item>
            <Descriptions.Item label="Voucher đã chọn">
              {selectedVoucherDetails
                ? `${selectedVoucherDetails.vourcherCode} - Giảm giá: ${selectedVoucherDetails.discountAmount}`
                : "Không có voucher"}
            </Descriptions.Item>
            <Descriptions.Item label="Tổng số tiền">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(totalAmount)}
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>
    </Card>
  );
};

export default OrderReviewBuy;
