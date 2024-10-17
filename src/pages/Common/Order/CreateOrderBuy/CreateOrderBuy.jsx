import { Button, Form, Input, message, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { createOrderBuy } from "../../../../api/orderApi";
import { getProductById } from "../../../../api/productApi"; // Ensure this path is correct

const CreateOrderBuy = () => {
  const [loading, setLoading] = useState(false);
  const [productData, setProductData] = useState(null);
  const [isLoadingProduct, setIsLoadingProduct] = useState(true);
  const location = useLocation();
  const { product } = location.state || {};

  // Fetch product details when the component mounts or when productID changes
  useEffect(() => {
    const fetchProductData = async () => {
      if (product?.productID) {
        try {
          const fetchedProduct = await getProductById(product.productID, 1, 10); // Assuming you have the necessary pagination
          setProductData(fetchedProduct);
        } catch (error) {
          message.error("Failed to fetch product data.");
        } finally {
          setIsLoadingProduct(false);
        }
      }
    };

    fetchProductData();
  }, [product]);

  const onFinish = async (values) => {
    setLoading(true);
    const orderData = {
      supplierID: productData?.supplierID || values.supplierID, // Use productData.supplierID if available
      memberID: values.memberID,
      orderDate: new Date().toISOString(),
      orderStatus: 0, // Example status, can be dynamic
      totalAmount: values.totalAmount,
      orderType: 0, // Example type, can be dynamic
      shippingAddress: values.shippingAddress,
      orderDetailRequests: values.orderDetailRequests.map((detail) => ({
        orderID: detail.orderID,
        productID: detail.productID,
        productPrice: detail.productPrice || productData?.price,
        productQuality: detail.productQuality,
        discount: detail.discount,
        productPriceTotal: detail.productPriceTotal,
      })),
      deliveryMethod: 0, // Example delivery method, can be dynamic
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const response = await createOrderBuy(orderData);
      if (response) {
        message.success("Order created successfully!");
      } else {
        message.error("Failed to create order.");
      }
    } catch (error) {
      message.error("Failed to create order.");
    } finally {
      setLoading(false);
    }
  };

  if (isLoadingProduct) {
    return <Spin size="large" />;
  }

  return (
    <Form layout="vertical" onFinish={onFinish}>
      <Form.Item
        label="Supplier ID"
        name="supplierID"
        initialValue={productData?.supplierID || ""} // Set initial value if available
        rules={[{ required: true, message: "Please input the supplier ID!" }]}
        style={{ display: "none" }} // Hides the Form.Item
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Member ID"
        name="memberID"
        rules={[{ required: true, message: "Please input the member ID!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Total Amount"
        name="totalAmount"
        rules={[{ required: true, message: "Please input the total amount!" }]}
        initialValue={productData?.price || 0} // Default value from productData
      >
        <Input type="number" />
      </Form.Item>

      <Form.Item
        label="Shipping Address"
        name="shippingAddress"
        rules={[
          { required: true, message: "Please input the shipping address!" },
        ]}
      >
        <Input />
      </Form.Item>

      {/* Example of order detail input */}
      <Form.List name="orderDetailRequests">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, fieldKey, ...restField }) => (
              <div key={key}>
                <Form.Item
                  {...restField}
                  name={[name, "orderID"]}
                  label="Order ID"
                  fieldKey={[fieldKey, "orderID"]}
                  rules={[{ required: true, message: "Please input Order ID" }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, "productID"]}
                  label="Product ID"
                  fieldKey={[fieldKey, "productID"]}
                  rules={[
                    { required: true, message: "Please input Product ID" },
                  ]}
                >
                  <Input defaultValue={productData?.id || ""} disabled />{" "}
                  {/* Display fetched Product ID */}
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, "productPrice"]}
                  label="Product Price"
                  fieldKey={[fieldKey, "productPrice"]}
                  rules={[
                    { required: true, message: "Please input Product Price" },
                  ]}
                >
                  <Input
                    type="number"
                    defaultValue={productData?.price || ""}
                    disabled
                  />{" "}
                  {/* Display fetched Product Price */}
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, "productQuality"]}
                  label="Product Quality"
                  fieldKey={[fieldKey, "productQuality"]}
                  rules={[
                    { required: true, message: "Please input Product Quality" },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, "discount"]}
                  label="Discount"
                  fieldKey={[fieldKey, "discount"]}
                  rules={[{ required: true, message: "Please input Discount" }]}
                >
                  <Input type="number" />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, "productPriceTotal"]}
                  label="Product Price Total"
                  fieldKey={[fieldKey, "productPriceTotal"]}
                  rules={[
                    {
                      required: true,
                      message: "Please input Product Price Total",
                    },
                  ]}
                >
                  <Input type="number" />
                </Form.Item>
                <Button onClick={() => remove(name)}>Remove Product</Button>
              </div>
            ))}
            <Button onClick={() => add()} block>
              Add Product
            </Button>
          </>
        )}
      </Form.List>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Create Order
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreateOrderBuy;
