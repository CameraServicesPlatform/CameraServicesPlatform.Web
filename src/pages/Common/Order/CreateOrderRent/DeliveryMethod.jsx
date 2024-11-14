import { Descriptions, Form, Input, Radio } from "antd";
import React from "react";

const DeliveryMethod = ({
  deliveryMethod,
  setDeliveryMethod,
  supplierInfo,
}) => (
  <>
    <Form.Item
      label="Phương thức giao hàng"
      name="deliveryMethod"
      rules={[
        {
          required: true,
          message: "Vui lòng chọn phương thức giao hàng!",
        },
      ]}
    >
      <Radio.Group onChange={(e) => setDeliveryMethod(e.target.value)}>
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
            message: "Vui lòng nhập địa chỉ giao hàng!",
          },
        ]}
      >
        <Input />
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
  </>
);

export default DeliveryMethod;
