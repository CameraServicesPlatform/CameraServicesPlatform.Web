import { Button, Form, Input, Modal, Select, message } from "antd";
import React, { useEffect, useState } from "react";
import { getAllCategories } from "../../../api/categoryApi"; // Adjust the import based on your project structure
import { updateProduct } from "../../../api/productApi"; // Adjust the import based on your project structure

const { Option } = Select;

const EditProductForm = ({ visible, onClose, product, onUpdateSuccess }) => {
  const [form] = Form.useForm();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(
    product?.categoryID || null
  );
  const [isLoading, setIsLoading] = useState(false);

  // Fetch categories when modal is opened
  useEffect(() => {
    if (visible) {
      fetchCategories();
    }
  }, [visible]);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const data = await getAllCategories(1, 100); // Adjust pageIndex and pageSize if needed
      if (data && data.result) {
        setCategories(data.result); // Correctly set categories from the result
      } else {
        message.error("Failed to load categories. Please try again later.");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      message.error("An error occurred while fetching categories.");
    } finally {
      setIsLoading(false);
    }
  };

  // Set form fields with product data when modal is opened
  useEffect(() => {
    if (product) {
      form.setFieldsValue({
        productName: product.productName,
        productDescription: product.productDescription,
        priceRent: product.priceRent,
        priceBuy: product.priceBuy,
        brand: product.brand,
        quality: product.quality,
        status: product.status,
        serialNumber: product.serialNumber,
        CategoryID: product.categoryID,
      });
      setSelectedCategory(product.categoryID);
    }
  }, [product, form]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("ProductID", product.productID);
      formData.append("SerialNumber", values.serialNumber);
      formData.append("CategoryID", selectedCategory);
      formData.append("ProductName", values.productName);
      formData.append("ProductDescription", values.productDescription);
      formData.append("PriceRent", (values.priceRent = 0));
      formData.append("PriceBuy", values.priceBuy);
      formData.append("Brand", values.brand);
      formData.append("Quality", values.quality);
      formData.append("Status", values.status);

      if (file) {
        formData.append("File", file);
      }

      const result = await updateProduct(formData);

      if (result) {
        onUpdateSuccess(result);
        message.success("Product updated successfully!");
        form.resetFields();
        onClose();
      } else {
        message.error("Failed to update product.");
      }
    } catch (error) {
      console.error("Update failed:", error);
      message.error("Update failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const filterOption = (inputValue, option) =>
    option.children.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title="Edit Product"
      visible={visible}
      onCancel={handleClose}
      footer={null}
    >
      <Form form={form} onFinish={handleSubmit}>
        <Form.Item
          name="productName"
          label="Product Name"
          rules={[{ required: true, message: "Please enter the product name" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="productDescription" label="Description">
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          name="priceRent"
          label="Price (Rent)"
          rules={[{ required: true, message: "Please enter the rent price" }]}
        >
          <Input type="number" />
        </Form.Item>
        <Form.Item
          name="priceBuy"
          label="Price (Buy)"
          rules={[{ required: true, message: "Please enter the buy price" }]}
        >
          <Input type="number" />
        </Form.Item>
        <Form.Item
          name="brand"
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
            <Option value={8}>Sigma</Option>
            <Option value={9}>Another</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="quality"
          label="Quality"
          rules={[{ required: true, message: "Please select the quality" }]}
        >
          <Select placeholder="Select quality">
            <Option value="High">High</Option>
            <Option value="Medium">Medium</Option>
            <Option value="Low">Low</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="status"
          label="Status"
          rules={[
            { required: true, message: "Please select the product status" },
          ]}
        >
          <Select placeholder="Select status">
            <Option value={0}>Sẵn Bán</Option>
            <Option value={1}>Có sẳn để thuê</Option>
            <Option value={4}>Sản phẩm ngừng kinh doanh</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="serialNumber"
          label="Serial Number"
          rules={[
            { required: true, message: "Please enter the serial number" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="CategoryID"
          label="Category"
          rules={[{ required: true, message: "Please select a category!" }]}
        >
          <Select
            showSearch
            placeholder="Select a category"
            filterOption={filterOption}
            loading={isLoading}
            onChange={(value) => setSelectedCategory(value)}
            value={selectedCategory}
          >
            {categories.map((category) => (
              <Option key={category.categoryID} value={category.categoryID}>
                {category.categoryName}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Upload Image">
          <Input type="file" accept="image/*" onChange={handleFileChange} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Update Product
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditProductForm;
