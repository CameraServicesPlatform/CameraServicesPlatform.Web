import { Button, DatePicker, Form, Input, InputNumber, message } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getSupplierIdByAccountId } from "../../../api/accountApi";
import { createVoucher } from "../../../api/voucherApi";

const CreateVoucherFormBySuplier = () => {
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.user.user || {});
  const [supplierId, setSupplierId] = useState(null);

  useEffect(() => {
    const fetchSupplierId = async () => {
      if (user.id) {
        try {
          const response = await getSupplierIdByAccountId(user.id);
          if (response?.isSuccess) {
            setSupplierId(response.result);
          } else {
            message.error("Failed to get Supplier ID.");
          }
        } catch (error) {
          message.error("Error fetching Supplier ID.");
        }
      }
    };

    fetchSupplierId();
  }, [user.id]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await createVoucher({
        supplierID: supplierId,
        vourcherCode: values.voucherCode,
        discountAmount: values.discountAmount,
        description: values.description,
        validFrom: values.validFrom,
        expirationDate: values.expirationDate,
      });
      if (response.isSuccess) {
        message.success("Voucher created successfully!");
      } else {
        message.error(response.messages.join(", "));
      }
    } catch (error) {
      message.error("Error creating voucher.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onFinish={onFinish}>
      <Form.Item
        name="voucherCode"
        label="Voucher Code"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="discountAmount"
        label="Discount Amount"
        rules={[{ required: true }]}
      >
        <InputNumber min={0} />
      </Form.Item>
      <Form.Item
        name="description"
        label="Description"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="validFrom"
        label="Valid From"
        rules={[{ required: true }]}
      >
        <DatePicker showTime />
      </Form.Item>
      <Form.Item
        name="expirationDate"
        label="Expiration Date"
        rules={[{ required: true }]}
      >
        <DatePicker showTime />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Create Voucher
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreateVoucherFormBySuplier;
