import { Button, Form, Input, message, Select } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { createOrderBuy } from "../../../../api/orderApi";
import { getProductById } from "../../../../api/productApi";

const { Option } = Select;

const CreateOrderBuy = () => {
  const [form] = Form.useForm();
  const [product, setProduct] = useState(null);
  const location = useLocation();
  const accountID = useSelector((state) => state.user.accountID);
  const { productID, supplierID } = location.state || {};

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (productID) {
          console.log("Fetching product with ID:", productID);
          const productData = await getProductById(productID);
          console.log("Product Data:", productData);

          if (productData) {
            setProduct(productData);
            form.setFieldsValue({ supplierID });
            console.log("Product ID:", productData.productID);
            console.log("Supplier ID:", supplierID);
          } else {
            message.error("Product not found or could not be retrieved.");
          }
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        message.error("Failed to fetch product details.");
      }
    };

    fetchProduct();
  }, [productID, supplierID, form]);

  const onFinish = async (values) => {
    const orderData = {
      supplierID: values.supplierID,
      accountID: accountID,
      productID: product?.productID,
      orderDate: new Date().toISOString(),
      orderStatus: 0,
      products: [
        {
          productID: product?.productID,
          productName: product?.productName,
          productDescription: product?.productDescription,
          priceRent: product?.priceRent,
          priceBuy: product?.priceBuy,
          quality: values.quality,
        },
      ],
      totalAmount: product ? product.priceBuy : 0,
      orderType: values.orderType,
      shippingAddress: values.shippingAddress,
      orderDetailRequests: [
        {
          productID: product?.productID,
          productPrice: product?.priceBuy,
          discount: values.discount || 0,
          productPriceTotal:
            product?.priceBuy * (1 - (values.discount || 0) / 100),
        },
      ],
      deliveryMethod: values.deliveryMethod,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Create order
    const response = await createOrderBuy(orderData);
    if (response && response.isSuccess) {
      message.success("Order created successfully!");
      form.resetFields(); // Reset form fields
    } else {
      response.messages?.forEach((mess) => {
        message.error(mess); // Display error messages
      });
    }
  };

  return (
    <Form form={form} onFinish={onFinish} layout="vertical">
      <Form.Item name="supplierID"></Form.Item>

      {/* Product Information Section */}
      <Form.Item label="Product Information" className="mb-4">
        {product ? (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {/* Left Side: Product Information */}
            <div style={{ flex: 1, paddingRight: "20px" }}>
              <p>
                <strong>Product ID:</strong> {product.productID}
              </p>
              <p>
                <strong>Name:</strong> {product.productName}
              </p>
              <p>
                <strong>Description:</strong> {product.productDescription}
              </p>
              <p>
                <strong>Rent Price:</strong> {product.priceRent}
              </p>
              <p>
                <strong>Buy Price:</strong> {product.priceBuy}
              </p>
              <p>
                <strong>Quality:</strong> {product.quality}
              </p>
            </div>

            {/* Right Side: Product Images */}
            <div style={{ flex: 1 }}>
              <strong>Product Images:</strong>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  marginTop: "10px",
                }}
              >
                {product.listImage && product.listImage.length > 0 ? (
                  product.listImage.map((imageObj, index) => (
                    <img
                      key={imageObj.productImagesID} // Unique key from image object
                      src={imageObj.image}
                      alt={`Product Image ${index + 1}`}
                      style={{
                        width: "100px",
                        height: "100px",
                        marginRight: "10px",
                        objectFit: "cover", // Ensures the image covers the space
                      }}
                    />
                  ))
                ) : (
                  <p>No images available for this product.</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <p>Loading product information...</p>
        )}
      </Form.Item>

      <Form.Item
        name="shippingAddress"
        label="Shipping Address"
        rules={[{ required: true, message: "Please input shipping address!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="discount"
        label="Discount (%)"
        rules={[
          {
            type: "number",
            min: 0,
            max: 100,
            message: "Discount must be between 0 and 100!",
          },
        ]}
      >
        <Input type="number" />
      </Form.Item>
      <Form
        initialValues={{ orderType: 0 }} // Set default value for orderType
        onFinish={(values) => {
          console.log("Form Values:", values);
        }}
      >
        <Form.Item name="orderType"></Form.Item>
      </Form>

      <Form.Item
        name="deliveryMethod"
        label="Delivery Method"
        rules={[{ required: true, message: "Please select delivery method!" }]}
      >
        <Select placeholder="Select delivery method">
          <Option value={0}>Delivery</Option>
          <Option value={1}>Pickup</Option>
        </Select>
      </Form.Item>
      <Button type="primary" htmlType="submit">
        Create Order
      </Button>
    </Form>
  );
};

export default CreateOrderBuy;
