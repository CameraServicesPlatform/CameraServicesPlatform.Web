import { Button, Form, Input, message, Select } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { createOrderBuy } from "../../../../api/orderApi";
import { getProductById } from "../../../../api/productApi";

const { Option } = Select;

const CreateOrderBuy = () => {
  const [form] = Form.useForm();
  const [product, setProduct] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const { productID, supplierID } = location.state || {};
  const user = useSelector((state) => state.user.user || {});
  console.log("Account ID:", user.id);
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
    console.log("Form values submitted:", values);

    const discountValue = parseFloat(values.discount) || 0;

    const orderData = {
      supplierID: values.supplierID,
      accountID: user.id,
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
          quality: product?.quality,
        },
      ],
      totalAmount: product ? product.priceBuy : 0,
      orderType: values.orderType,
      shippingAddress: values.shippingAddress,
      orderDetailRequests: [
        {
          productID: product?.productID,
          productPrice: product?.priceBuy,
          discount: discountValue,
          productPriceTotal: product?.priceBuy * (1 - discountValue / 100),
        },
      ],
      deliveryMethod: values.deliveryMethod,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Create order
    try {
      const response = await createOrderBuy(orderData);
      if (response && response.isSuccess) {
        message.success("Order created successfully!");
        form.resetFields();
        navigate("/order-detail");
      } else {
        response.messages?.forEach((mess) => {
          message.error(mess);
        });
      }
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  return (
    <Form form={form} onFinish={onFinish} layout="vertical">
      <Form.Item
        name="supplierID"
        label="Supplier ID"
        initialValue={supplierID}
      >
        <Input disabled />
      </Form.Item>
      <Form.Item
        name="accountID"
        initialValue={user.id} // Use accountID from Redux directly
        rules={[{ required: true, message: "Please input the account ID!" }]}
      />

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
                style={{ display: "flex", flexWrap: "wrap", marginTop: "10px" }}
              >
                {product.listImage && product.listImage.length > 0 ? (
                  product.listImage.map((imageObj, index) => (
                    <img
                      key={imageObj.productImagesID}
                      src={imageObj.image}
                      alt={`Product Image ${index + 1}`}
                      style={{
                        width: "100px",
                        height: "100px",
                        marginRight: "10px",
                        objectFit: "cover",
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

      <Form.Item name="discount" label="Discount (%)">
        <Input
          type="number"
          min={0}
          max={100}
          placeholder="Enter discount percentage"
        />
      </Form.Item>

      <Form.Item name="orderType" label="Order Type" initialValue={0}>
        <Select>
          <Option value={0}>Mua</Option>
        </Select>
      </Form.Item>

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
