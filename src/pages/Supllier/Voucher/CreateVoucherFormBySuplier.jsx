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

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const result = await createVoucher({
        ...values,
        supplierID: supplierId, // Use supplierId from state
      });
      message.success("Voucher created successfully!");
      console.log("Created Voucher:", result);
      // Optionally reset the form after submission
    } catch (error) {
      message.error("Failed to create voucher. Please try again.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      layout="vertical"
      onFinish={handleSubmit}
      style={{ maxWidth: 600, margin: "0 auto" }} // Center the form
    >
      <h2>Create Voucher</h2>

      <Form.Item
        label="Supplier ID"
        name="supplierID"
        initialValue={supplierId} // Set initial value from state
        hidden // Hides the field from the UI
        rules={[{ required: true, message: "Please input the Supplier ID!" }]}
      >
        <Input placeholder="Supplier ID" value={supplierId} disabled />
        {/* Display supplierId but disabled */}
      </Form.Item>
      <Form.Item
        label="Voucher Code"
        name="voucherCode"
        rules={[{ required: true, message: "Please input the Voucher Code!" }]}
      >
        <Input placeholder="Enter Voucher Code" />
      </Form.Item>

      <Form.Item
        label="Description"
        name="description"
        rules={[{ required: true, message: "Please input the description!" }]}
      >
        <Input.TextArea rows={4} placeholder="Enter Description" />
      </Form.Item>

      <Form.Item
        label="Discount Amount"
        name="discountAmount"
        rules={[
          { required: true, message: "Please input the Discount Amount!" },
        ]}
      >
        <InputNumber
          min={0}
          placeholder="Enter Discount Amount"
          style={{ width: "100%" }}
        />
      </Form.Item>

      <Form.Item
        label="Discount Type"
        name="discountType"
        rules={[
          { required: true, message: "Please select the Discount Type!" },
        ]}
      >
        <InputNumber
          min={0}
          placeholder="Enter Discount Type (0 for percentage, 1 for fixed amount)"
          style={{ width: "100%" }}
        />
      </Form.Item>

      <Form.Item label="Max Usage Limit" name="maxUsageLimit">
        <InputNumber
          min={0}
          placeholder="Enter Max Usage Limit"
          style={{ width: "100%" }}
        />
      </Form.Item>

      <Form.Item label="Usage Per Customer" name="usagePerCustomer">
        <InputNumber
          min={0}
          placeholder="Enter Usage Per Customer"
          style={{ width: "100%" }}
        />
      </Form.Item>

      <Form.Item label="Min Order Amount" name="minOrderAmount">
        <InputNumber
          min={0}
          placeholder="Enter Min Order Amount"
          style={{ width: "100%" }}
        />
      </Form.Item>

      <Form.Item
        label="Valid From"
        name="validFrom"
        rules={[
          { required: true, message: "Please select the Valid From date!" },
        ]}
      >
        <DatePicker showTime style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item
        label="Expiration Date"
        name="expirationDate"
        rules={[
          { required: true, message: "Please select the Expiration Date!" },
        ]}
      >
        <DatePicker showTime style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          style={{ width: "100%" }}
        >
          Create Voucher
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreateVoucherFormBySuplier;
