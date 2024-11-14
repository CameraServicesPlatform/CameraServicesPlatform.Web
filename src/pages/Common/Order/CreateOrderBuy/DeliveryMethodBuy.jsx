import { Card, Form, Radio } from "antd";
import React from "react";

const DeliveryMethodBuy = ({
  deliveryMethod,
  setDeliveryMethod,
  supplierInfo,
}) => {
  const handleDeliveryMethodChange = (e) => {
    setDeliveryMethod(e.target.value);
  };

  return (
    <Card title="Phương thức giao hàng" bordered={false}>
      <Form.Item label="Chọn phương thức giao hàng">
        <Radio.Group
          onChange={handleDeliveryMethodChange}
          value={deliveryMethod}
        >
          <Radio value={0}>Giao hàng tận nơi</Radio>
          <Radio value={1}>Nhận tại cửa hàng</Radio>
        </Radio.Group>
      </Form.Item>
      {deliveryMethod === 1 && supplierInfo && (
        <Card title="Thông tin nhà cung cấp" bordered={false}>
          <p>
            <strong>Tên nhà cung cấp:</strong> {supplierInfo.name}
          </p>
          <p>
            <strong>Địa chỉ:</strong> {supplierInfo.address}
          </p>
          <p>
            <strong>Số điện thoại:</strong> {supplierInfo.phone}
          </p>
        </Card>
      )}
    </Card>
  );
};

export default DeliveryMethodBuy;
