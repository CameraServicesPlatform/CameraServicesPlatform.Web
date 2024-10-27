import { Button, Card, Form, Input, message, Select, Spin, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { createOrderBuy } from "../../../../api/orderApi";
import { getProductById } from "../../../../api/productApi";
import { getVouchersBySupplierId } from "../../../../api/voucherApi";

const { Option } = Select;

const CreateOrderBuy = () => {
  const [form] = Form.useForm();
  const [product, setProduct] = useState(null);
  const [vouchers, setVouchers] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { productID, supplierID } = location.state || {};
  const user = useSelector((state) => state.user.user || {});

  const [loadingProduct, setLoadingProduct] = useState(true);
  const [loadingVouchers, setLoadingVouchers] = useState(true);

  // Fetch Product Data
  useEffect(() => {
    const fetchProduct = async () => {
      if (productID) {
        try {
          const productData = await getProductById(productID);
          setProduct(productData || null);
          if (!productData) message.error("Product not found.");
        } catch (error) {
          console.error("Error fetching product data:", error);
          message.error("Error fetching product data: " + error.message);
        } finally {
          setLoadingProduct(false);
        }
      }
    };

    fetchProduct();
  }, [productID]);

  // Fetch Vouchers
  useEffect(() => {
    const fetchVouchers = async () => {
      setLoadingVouchers(true);
      try {
        const response = await getVouchersBySupplierId(supplierID, 1, 10);
        if (response.isSuccess) {
          setVouchers(response.result);
        } else {
          message.error("Failed to fetch vouchers.");
        }
      } catch (error) {
        console.error("Error fetching vouchers:", error);
        message.error("Error fetching vouchers: " + error.message);
      } finally {
        setLoadingVouchers(false);
      }
    };

    fetchVouchers();
  }, [supplierID]);

  // Handle Form Submission
  const onFinish = async (values) => {
    if (!product) {
      message.error("Please ensure product is selected.");
      return;
    }

    // Ensure that a voucher is selected
    if (!selectedVoucher) {
      message.error("The Voucher ID field is required.");
      return;
    }

    // Calculate the total price after discount
    const discountValue = selectedVoucher?.discountAmount || 0;
    const discountedPrice = Math.max(0, product.priceBuy - discountValue);
    const currentDate = new Date().toISOString();

    const orderData = {
      supplierID,
      accountID: user.id,
      voucherID: selectedVoucher.voucherID, // Use selectedVoucher.voucherID
      productID: product.productID,
      orderDate: currentDate,
      orderStatus: 0,
      products: [
        {
          productID: product.productID,
          productName: product.productName,
          productDescription: product.productDescription,
          priceRent: 0,
          priceBuy: product.priceBuy,
          quality: product.quality,
        },
      ],
      totalAmount: discountedPrice,
      orderType: values.orderType,
      shippingAddress: values.shippingAddress,
      orderDetailRequests: [
        {
          productID: product.productID,
          productPrice: product.priceBuy,
          productQuality: product.quality,
          discount: discountValue,
          productPriceTotal: discountedPrice,
        },
      ],
      deliveryMethod: values.deliveryMethod,
      createdAt: currentDate,
      updatedAt: currentDate,
    };

    console.log("Order Data:", orderData); // Debugging line

    try {
      const response = await createOrderBuy(orderData);
      if (response.isSuccess) {
        message.success("Order created successfully!");
        navigate("/order-detail");
      } else {
        response.messages?.forEach((msg) => message.error(msg));
      }
    } catch (error) {
      message.error("Error creating order: " + error.message);
    }
  };

  return (
    <Form
      form={form}
      onFinish={onFinish}
      layout="vertical"
      initialValues={{ orderType: 0, supplierID }}
    >
      <Form.Item name="supplierID" label="Supplier ID">
        <Input disabled value={supplierID} />
      </Form.Item>

      <Form.Item label="Product Information">
        {loadingProduct ? (
          <Spin />
        ) : product ? (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
            }}
          >
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
                <strong>Buy Price:</strong> {product.priceBuy}
              </p>
              <p>
                <strong>Quality:</strong>{" "}
                <Tag color="blue">{product.quality}</Tag>
              </p>
            </div>
            <div style={{ flex: 1 }}>
              <strong>Product Images:</strong>
              <div
                style={{ display: "flex", flexWrap: "wrap", marginTop: "10px" }}
              >
                {product.listImage?.length ? (
                  product.listImage.map((img) => (
                    <img
                      key={img.productImagesID}
                      src={img.image}
                      alt="Product"
                      style={{
                        width: "100px",
                        height: "100px",
                        marginRight: "10px",
                        objectFit: "cover",
                      }}
                    />
                  ))
                ) : (
                  <p>No images available.</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <p>Product not found.</p>
        )}
      </Form.Item>
      <Form.Item>
        <Card
          style={{
            borderRadius: "8px",
            border: "1px solid #e6f7ff",
            padding: "10px",
          }}
        >
          {loadingVouchers ? (
            <Spin />
          ) : (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {vouchers.length > 0 ? (
                vouchers.map((voucher) => (
                  <Card
                    key={voucher.voucherID}
                    style={{
                      width: "150px",
                      border: "1px solid #d9d9d9",
                      cursor: "pointer",
                      backgroundColor:
                        selectedVoucher?.voucherID === voucher.voucherID
                          ? "#e6f7ff"
                          : "white",
                      transition: "background-color 0.3s ease",
                    }}
                    onClick={() => setSelectedVoucher(voucher)}
                  >
                    <p>
                      <strong>Discount:</strong> {voucher.discountAmount} VND
                    </p>
                    <p>
                      <strong>Description:</strong> {voucher.description}
                    </p>
                    <p>
                      <strong>Valid From:</strong>{" "}
                      {new Date(voucher.validFrom).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Expires on:</strong>{" "}
                      {new Date(voucher.validTo).toLocaleDateString()}
                    </p>
                  </Card>
                ))
              ) : (
                <p>No vouchers available</p>
              )}
            </div>
          )}
        </Card>
      </Form.Item>
      <Form.Item
        name="shippingAddress"
        label="Shipping Address"
        rules={[
          { required: true, message: "Please enter your shipping address!" },
        ]}
      >
        <Input.TextArea rows={4} placeholder="Enter shipping address" />
      </Form.Item>
      <Form.Item
        name="deliveryMethod"
        label="Delivery Method"
        rules={[
          { required: true, message: "Please select a delivery method!" },
        ]}
      >
        <Select placeholder="Select delivery method">
          <Option value="standard">Standard</Option>
          <Option value="express">Express</Option>
        </Select>
      </Form.Item>
      <Form.Item
        name="orderType"
        label="Order Type"
        rules={[{ required: true, message: "Please select order type!" }]}
      >
        <Select placeholder="Select order type">
          <Option value={0}>Normal</Option>
          <Option value={1}>Urgent</Option>
        </Select>
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={loadingProduct || loadingVouchers}
        >
          Create Order
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreateOrderBuy;
