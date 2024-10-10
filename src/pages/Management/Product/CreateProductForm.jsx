import { Button, Form, Input, Modal, Select, message } from "antd";
import React, { useEffect, useState } from "react";
import { getAllCategories } from "../../../api/categoryApi";
import { createProduct } from "../../../api/productApi";

const { Option } = Select;

const CreateProductForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await getAllCategories(1, 100);
      if (data?.result?.items) {
        setCategories(data.result.items);
      } else {
        message.error("Failed to load categories.");
      }
    } catch (error) {
      message.error("An error occurred while fetching categories.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (values) => {
    console.log("Submitting product with values:", values);

    const {
      SerialNumber,
      SupplierID,
      CategoryID,
      ProductName,
      ProductDescription,
      PriceRent,
      PriceBuy,
      Brand,
      Status,
    } = values;

    try {
      const result = await createProduct(
        SerialNumber,
        SupplierID,
        CategoryID,
        ProductName,
        ProductDescription,
        PriceRent,
        PriceBuy,
        Brand,
        Status
      );

      if (result) {
        message.success("Product created successfully!");
        fetchProducts();
        setIsModalVisible(false);
        form.resetFields();
      } else {
        message.error("Failed to create product.");
      }
    } catch (error) {
      console.error("Error creating product:", error);
      message.error("An error occurred while creating the product.");
    }
  };

  return (
    <>
      <Button type="primary" onClick={() => setIsModalVisible(true)}>
        Create Product
      </Button>

      <Modal
        title="Create Product"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleCreateProduct}>
          <Form.Item
            name="SerialNumber"
            label="Serial Number"
            rules={[
              { required: true, message: "Please input the serial number!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="SupplierID"
            label="Supplier ID"
            rules={[
              { required: true, message: "Please input the supplier ID!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="CategoryID"
            label="Category"
            rules={[{ required: true, message: "Please select a category!" }]}
          >
            <Select placeholder="Select a category">
              {categories.map((category) => (
                <Option key={category.categoryID} value={category.categoryID}>
                  {category.categoryName}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="ProductName"
            label="Product Name"
            rules={[
              { required: true, message: "Please input the product name!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="ProductDescription"
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
            name="PriceRent"
            label="Price (Rent)"
            rules={[
              { required: true, message: "Please input the rental price!" },
            ]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="PriceBuy"
            label="Price (Buy)"
            rules={[
              { required: true, message: "Please input the purchase price!" },
            ]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="Brand"
            label="Brand"
            rules={[{ required: true, message: "Please select a brand" }]}
          >
            <Select placeholder="Select a brand">
              <Option value={0}>Canon</Option>
              <Option value={1}>Nikon</Option>
              <Option value={2}>Sony</Option>
              <Option value={3}>Fujifilm</Option>
              <Option value={4}>Olympus</Option>
              <Option value={5}>Panasonic</Option>
              <Option value={6}>Leica</Option>
              <Option value={7}>Pentax</Option>
              <Option value={8}>Hasselblad</Option>
              <Option value={9}>Sigma</Option>
              <Option value={10}>Another</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="Status"
            label="Status"
            rules={[{ required: true, message: "Please select a status" }]}
          >
            <Select placeholder="Select a status">
              <Option value={0}>Both</Option>
              <Option value={1}>Rented</Option>
              <Option value={2}>Sold</Option>
              <Option value={3}>Shipping</Option>
              <Option value={4}>Discontinued Product</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CreateProductForm;
