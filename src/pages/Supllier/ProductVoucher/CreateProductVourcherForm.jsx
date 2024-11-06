import { Button, Form, Input, message } from "antd";
import React, { useState } from "react";
import { createProductVoucher } from "../../../api/ProductVoucherApi";

const CreateProductVoucherForm = ({ onClose, fetchVouchers }) => {
  const [productID, setProductID] = useState("");
  const [voucherID, setVoucherID] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);

    try {
      const result = await createProductVoucher(
        values.productID,
        values.voucherID
      );

      if (result) {
        message.success("Product voucher created successfully!");
        fetchVouchers(); // Refresh the vouchers after creation
        onClose(); // Close the form
      } else {
        message.error("Failed to create product voucher.");
      }
    } catch (error) {
      message.error("An error occurred while creating the product voucher.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form layout="vertical" onFinish={handleSubmit}>
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
          Create Product Voucher
        </Button>
        <Button onClick={onClose} style={{ marginLeft: 8 }}>
          Cancel
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreateProductVoucherForm;
