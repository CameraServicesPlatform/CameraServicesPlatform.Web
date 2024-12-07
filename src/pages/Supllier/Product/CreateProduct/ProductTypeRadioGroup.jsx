import { Form, Radio } from "antd";
import React from "react";

const ProductTypeRadioGroup = ({ productType, setProductType }) => {
  return (
    <Form.Item label="Loại sản phẩm">
      <Radio.Group
        onChange={(e) => setProductType(e.target.value)}
        value={productType}
      >
        <Radio value="rent">Thuê</Radio>
        <Radio value="buy">Mua</Radio>
      </Radio.Group>
    </Form.Item>
  );
};

export default ProductTypeRadioGroup;
