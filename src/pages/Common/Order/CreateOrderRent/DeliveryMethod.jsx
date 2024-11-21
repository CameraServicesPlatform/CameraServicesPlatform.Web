import { Card, Descriptions, Form, Input, Radio } from "antd";
import React from "react";

const DeliveryMethod = ({
  shippingAddress,
  setShippingAddress,
  deliveryMethod,
  setDeliveryMethod,
  supplierInfo,
}) => {
  const handleDeliveryMethodChange = (e) => {
    console.log("Selected delivery method:", e.target.value);
    setDeliveryMethod(e.target.value);
  };
  const handleShippingAddressChange = (e) => {
    setShippingAddress(e.target.value);
  };
  return (
    <Card title="Phương thức giao hàng" bordered={false}>
      <Form.Item
        label="Chọn phương thức giao hàng"
        rules={[
          {
            required: true,
            message: "Vui lòng chọn phương thức giao hàng!",
          },
        ]}
      >
        <Radio.Group
          onChange={handleDeliveryMethodChange}
          value={deliveryMethod}
        >
          <Radio value={0}>Nhận tại cửa hàng</Radio>
          <Radio value={1}>Giao hàng tận nơi</Radio>
        </Radio.Group>
      </Form.Item>
      {deliveryMethod === 1 && (
        <Form.Item
          label="Địa chỉ giao hàng"
          name="shippingAddress"
          rules={[
            {
              required: true,
              message: "Vui lòng nbsp địa chỉ giao hàng!",
            },
          ]}
        >
          <Input
            value={shippingAddress}
            onChange={handleShippingAddressChange}
          />
        </Form.Item>
      )}

      {deliveryMethod === 0 && supplierInfo && (
        <Descriptions bordered>
          <Descriptions.Item label="Tên nhà cung cấp">
            {supplierInfo.supplierName}
          </Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">
            {supplierInfo.contactNumber}
          </Descriptions.Item>
          <Descriptions.Item label="Địa chỉ nhà cung cấp">
            {supplierInfo.supplierAddress}
          </Descriptions.Item>
        </Descriptions>
      )}
    </Card>
  );
};

export default DeliveryMethod;
