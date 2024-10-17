import { UploadOutlined } from "@ant-design/icons";
import { Button, Form, Input, Select, Upload, message } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getSupplierIdByAccountId } from "../../../api/accountApi"; // Make sure this is the correct import path
import { getAllCategories } from "../../../api/categoryApi";
import { createProduct } from "../../../api/productApi";

const { Option } = Select;

const CreateProductForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [file, setFile] = useState(null);
  const user = useSelector((state) => state.user.user || {});
  const [supplierId, setSupplierId] = useState(null);
  const fetchSupplierId = async () => {
    if (user.id) {
      // Use user.id for accountId
      try {
        const response = await getSupplierIdByAccountId(user.id); // Pass accountId
        if (response?.isSuccess) {
          setSupplierId(response.result); // Set supplierId from the API response
        } else {
          message.error("Failed to get Supplier ID.");
        }
      } catch (error) {
        message.error("Error fetching Supplier ID.");
      }
    }
  };
  useEffect(() => {
    fetchCategories();
  }, []);
  useEffect(() => {
    fetchSupplierId(); // Fetch supplier ID when component mounts
  }, [user]);

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

  const handleFileChange = (info) => {
    if (info.file.status === "done" || info.file.status === "uploading") {
      setFile(info.file.originFileObj); // Set the file when uploaded
    }
  };

  const handleCreateProduct = async (values) => {
    const {
      SerialNumber,
      CategoryID,
      ProductName,
      ProductDescription,
      PriceRent,
      PriceBuy,
      Brand,
      Status,
    } = values;

    // Check if supplierId is valid
    if (!supplierId) {
      message.error("Supplier ID is missing or invalid.");
      return; // Ensure to return to stop further execution
    }

    try {
      setLoading(true); // Start the loading state
      const product = {
        serialNumber: SerialNumber,
        supplierID: supplierId, // Use the supplierId from the state
        categoryID: CategoryID,
        productName: ProductName,
        productDescription: ProductDescription,
        priceRent: PriceRent,
        priceBuy: PriceBuy,
        brand: Brand,
        status: Status,
      };

      const result = await createProduct(product, file); // Pass product and file to API

      if (result) {
        message.success("Product created successfully!");
        form.resetFields();
        setFile(null); // Clear the file state
      } else {
        message.error("Failed to create product.");
      }
    } catch (error) {
      console.error("Error creating product:", error);
      message.error("An error occurred while creating the product.");
    } finally {
      setLoading(false); // Stop the loading state
    }
  };

  return (
    <Form form={form} onFinish={handleCreateProduct}>
      <Form.Item
        name="SerialNumber"
        label="Serial Number"
        rules={[{ required: true, message: "Please input the serial number!" }]}
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
        rules={[{ required: true, message: "Please input the product name!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="ProductDescription"
        label="Description"
        rules={[
          { required: true, message: "Please input the product description!" },
        ]}
      >
        <Input.TextArea />
      </Form.Item>

      <Form.Item name="PriceRent" label="Price (Rent)">
        <Input type="number" />
      </Form.Item>

      <Form.Item name="PriceBuy" label="Price (Buy)">
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

      {/* Upload field for file */}
      <Form.Item label="Upload File">
        <Upload
          name="file"
          accept=".png,.jpg,.jpeg,.pdf" // Customize file types
          showUploadList={false}
          onChange={handleFileChange}
        >
          <Button icon={<UploadOutlined />}>Click to Upload</Button>
        </Upload>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreateProductForm;
