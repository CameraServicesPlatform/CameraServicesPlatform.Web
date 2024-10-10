import { Button, Form, Input, Modal, Select } from "antd";
import React, { useEffect } from "react";

const { Option } = Select;

const EditProductForm = ({
  isVisible,
  setIsVisible,
  initialValues,
  onSubmit,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        productName: initialValues.productName,
        productDescription: initialValues.productDescription,
        priceRent: initialValues.priceRent,
        priceBuy: initialValues.priceBuy,
        // Add other fields as needed
      });
    }
  }, [initialValues, form]);

  const handleEditSubmit = (values) => {
    onSubmit(values); // Call the parent function with the form values
  };

  return (
    <Modal
      title="Edit Product"
      visible={isVisible}
      onCancel={() => setIsVisible(null)} // Close the modal
      footer={null}
    >
      <Form form={form} onFinish={handleEditSubmit}>
        <Form.Item
          name="productName"
          label="Product Name"
          rules={[
            { required: true, message: "Please input the product name!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="productDescription"
          label="Description"
          rules={[
            {
              required: true,
              message: "Please input the product description!",
            },
          ]}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          name="priceRent"
          label="Price (Rent)"
          rules={[
            { required: true, message: "Please input the rental price!" },
          ]}
        >
          <Input type="number" />
        </Form.Item>
        <Form.Item
          name="priceBuy"
          label="Price (Buy)"
          rules={[
            { required: true, message: "Please input the purchase price!" },
          ]}
        >
          <Input type="number" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Update
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditProductForm;
