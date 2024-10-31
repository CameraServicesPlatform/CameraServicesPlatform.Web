import { Button, Form, Input, message } from "antd";
import React, { useEffect, useState } from "react";
import { updateProductVoucher } from "../../../api/productApi";

const EditCreateProductForm = ({ voucher, onClose }) => {
  const [productVoucherID, setProductVoucherID] = useState("");
  const [productID, setProductID] = useState("");
  const [voucherID, setVoucherID] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (voucher) {
      setProductVoucherID(voucher.productVoucherID);
      setProductID(voucher.productID);
      setVoucherID(voucher.voucherID);
    }
  }, [voucher]);

  const handleSubmit = async (values) => {
    setLoading(true);

    const result = await updateProductVoucher(
      values.productVoucherID,
      values.productID,
      values.voucherID
    );

    setLoading(false);

    if (result) {
      message.success("Product voucher updated successfully!");
      onClose(); // Close the form after successful update
    } else {
      message.error("Failed to update product voucher.");
    }
  };

  return (
    <Form layout="vertical" onFinish={handleSubmit}>
      <Form.Item label="Product Voucher ID" required>
        <Input
          value={productVoucherID}
          disabled // Typically, ID fields are not editable
        />
      </Form.Item>
      <Form.Item label="Product ID" required>
        <Input
          value={productID}
          onChange={(e) => setProductID(e.target.value)}
          placeholder="Enter Product ID"
        />
      </Form.Item>
      <Form.Item label="Voucher ID" required>
        <Input
          value={voucherID}
          onChange={(e) => setVoucherID(e.target.value)}
          placeholder="Enter Voucher ID"
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Update Product Voucher
        </Button>
        <Button onClick={onClose} style={{ marginLeft: 8 }}>
          Cancel
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EditCreateProductForm;
