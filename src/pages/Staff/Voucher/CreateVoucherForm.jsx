import { Button, DatePicker, Form, Input, InputNumber, message } from "antd";
import React, { useState } from "react";
import { createVoucher } from "../../../api/voucherApi";

const CreateVoucherForm = () => {
  const [voucherData, setVoucherData] = useState({
    supplierID: "",
    vourcherCode: "",
    discountAmount: 0,
    description: "",
    validFrom: "",
    expirationDate: "",
  });

  const handleChange = (changedFields) => {
    setVoucherData((prev) => ({ ...prev, ...changedFields }));
  };

  const handleSubmit = async (values) => {
    try {
      const result = await createVoucher(values);
      message.success("Voucher created successfully!");
      setVoucherData({
        supplierID: "",
        vourcherCode: "",
        discountAmount: 0,
        description: "",
        validFrom: "",
        expirationDate: "",
      }); // Reset form
    } catch (error) {
      message.error("Failed to create voucher.");
      console.error("Failed to create voucher:", error);
    }
  };

  return (
    <Form
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={voucherData}
      style={{ maxWidth: "400px", margin: "auto" }}
    >
      <Form.Item
        label="Supplier ID"
        name="supplierID"
        rules={[{ required: true }]}
      >
        <Input onChange={(e) => handleChange({ supplierID: e.target.value })} />
      </Form.Item>
      <Form.Item
        label="Voucher Code"
        name="vourcherCode"
        rules={[{ required: true }]}
      >
        <Input
          onChange={(e) => handleChange({ vourcherCode: e.target.value })}
        />
      </Form.Item>
      <Form.Item
        label="Discount Amount"
        name="discountAmount"
        rules={[{ required: true }]}
      >
        <InputNumber
          onChange={(value) => handleChange({ discountAmount: value })}
          style={{ width: "100%" }}
        />
      </Form.Item>
      <Form.Item
        label="Description"
        name="description"
        rules={[{ required: true }]}
      >
        <Input
          onChange={(e) => handleChange({ description: e.target.value })}
        />
      </Form.Item>
      <Form.Item
        label="Valid From"
        name="validFrom"
        rules={[{ required: true }]}
      >
        <DatePicker
          showTime
          onChange={(date, dateString) =>
            handleChange({ validFrom: dateString })
          }
          style={{ width: "100%" }}
        />
      </Form.Item>
      <Form.Item
        label="Expiration Date"
        name="expirationDate"
        rules={[{ required: true }]}
      >
        <DatePicker
          showTime
          onChange={(date, dateString) =>
            handleChange({ expirationDate: dateString })
          }
          style={{ width: "100%" }}
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
          Create Voucher
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreateVoucherForm;
