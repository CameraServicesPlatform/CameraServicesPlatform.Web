import { Button, Form, Input, message, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { createOrderBuy } from "../../../../api/orderApi";
import { getProductById } from "../../../../api/productApi";

const CreateOrderBuy = () => {
  const [loading, setLoading] = useState(false);
  const [productData, setProductData] = useState(null);
  const [isLoadingProduct, setIsLoadingProduct] = useState(true);
  const location = useLocation();
  const { product } = location.state || {};
  update - account;
  // Retrieve accountID from the Redux store
  const user = useSelector((state) => state.user.user || {});
  const accountID = user.accountID;

  // Fetch product details when the component mounts or when productID changes
  useEffect(() => {
    const fetchProductData = async () => {
      if (product?.productID) {
        try {
          const fetchedProduct = await getProductById(product.productID);
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
      supplierID: productData?.supplierID || values.supplierID,
      accountID: accountID,
      orderDate: new Date().toISOString(),
      orderStatus: 0,
      totalAmount: values.totalAmount,
      orderType: 0,
      shippingAddress: values.shippingAddress,
      orderDetailRequests: values.orderDetailRequests.map((detail) => ({
        orderID: detail.orderID,
        productID: detail.productID,
        productPrice: detail.productPrice || productData?.price,
        productQuality: detail.productQuality,
        discount: detail.discount,
        productPriceTotal: detail.productPriceTotal,
      })),
      deliveryMethod: 0,
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

  if (isLoadingProduct || !accountID) {
    return <Spin size="large" />; // or a message indicating loading
  }

  return (
    <Form layout="vertical" onFinish={onFinish}>
      <Form.Item
        label="Supplier ID"
        name="supplierID"
        initialValue={productData?.supplierID || ""}
        rules={[{ required: true, message: "Please input the supplier ID!" }]}
        style={{ display: "none" }}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="accountID"
        initialValue={accountID} // Use accountID from Redux directly
        rules={[{ required: true, message: "Please input the account ID!" }]}
      />

      <Form.Item
        label="Total Amount"
        name="totalAmount"
        rules={[{ required: true, message: "Please input the total amount!" }]}
        initialValue={productData?.price || 0}
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
                  <Input defaultValue={productData?.id || ""} disabled />
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
                  />
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
            <Button
              type="dashed"
              onClick={() => add()}
              style={{ width: "60%" }}
            >
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
