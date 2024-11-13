import { Card, Col, Descriptions, Row } from "antd";
import React from "react";

const OrderReview = ({
  product,
  form,
  deliveryMethod,
  supplierInfo,
  selectedVoucherDetails,
  totalAmount,
}) => (
  <div>
    <h3>Xem lại đơn hàng của bạn</h3>
    <Row gutter={16}>
      <Col span={12}>
        <Card
          title="Thông tin sản phẩm"
          bordered={false}
          style={{ marginBottom: "16px" }}
        >
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Mã sản phẩm">
              {product?.productID}
            </Descriptions.Item>
            {/* ...existing code... */}
          </Descriptions>
        </Card>
      </Col>
      <Col span={12}>
        <Card
          title="Thông tin giao hàng"
          bordered={false}
          style={{ marginBottom: "16px" }}
        >
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Phương thức giao hàng">
              {deliveryMethod === 0 ? "Nhận tại cửa hàng" : "Giao hàng tận nơi"}
            </Descriptions.Item>
            {deliveryMethod === 1 && (
              <Descriptions.Item label="Địa chỉ giao hàng">
                {form.getFieldValue("shippingAddress")}
              </Descriptions.Item>
            )}
            {deliveryMethod === 0 && supplierInfo && (
              <>
                <Descriptions.Item label="Tên nhà cung cấp">
                  {supplierInfo.supplierName}
                </Descriptions.Item>
                <Descriptions.Item label="Số điện thoại">
                  {supplierInfo.contactNumber}
                </Descriptions.Item>
                <Descriptions.Item label="Địa chỉ nhà cung cấp">
                  {supplierInfo.supplierAddress}
                </Descriptions.Item>
              </>
            )}
          </Descriptions>
        </Card>
      </Col>
    </Row>
    <Card
      title="Thông tin Voucher"
      bordered={false}
      style={{ marginTop: "16px" }}
    >
      {selectedVoucherDetails ? (
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Mã Voucher">
            {selectedVoucherDetails.voucherCode}
          </Descriptions.Item>
          <Descriptions.Item label="Mô tả">
            {selectedVoucherDetails.description}
          </Descriptions.Item>
          <Descriptions.Item label="Số tiền giảm">
            {selectedVoucherDetails.discountAmount}
          </Descriptions.Item>
        </Descriptions>
      ) : (
        <p>Không có voucher được chọn.</p>
      )}
    </Card>
    <Card
      title="Tổng kết đơn hàng"
      bordered={false}
      style={{ marginTop: "16px" }}
    >
      <Descriptions bordered column={1}>
        <Descriptions.Item label="Tổng số tiền">
          {totalAmount}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  </div>
);

export default OrderReview;
