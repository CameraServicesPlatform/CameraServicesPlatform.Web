import { Button, Card, Form, Input, message, Select, Spin } from "antd";
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
  const [totalAmount, setTotalAmount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { productID, supplierID } = location.state || {};
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [loadingVouchers, setLoadingVouchers] = useState(true);
  const user = useSelector((state) => state.user.user || {});
  const accountId = user.id;
  console.log(accountId);
  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (productID) {
          const productData = await getProductById(productID);
          if (productData) {
            setProduct(productData);
            form.setFieldsValue({ supplierID });
          } else {
            message.error("Product not found or could not be retrieved.");
          }
        }
      } catch (error) {
        message.error("Failed to fetch product details.");
      }
      setLoadingProduct(false);
    };

    fetchProduct();
  }, [productID]);

  // Fetch vouchers by supplier ID
  useEffect(() => {
    const fetchVouchers = async () => {
      setLoadingVouchers(true);
      try {
        const voucherData = await getVouchersBySupplierId(supplierID, 1, 10); // Adjust pageIndex and pageSize as needed
        if (voucherData && voucherData.isSuccess) {
          setVouchers(voucherData.result || []);
        } else {
          message.error("No vouchers available.");
        }
      } catch (error) {
        message.error("Failed to fetch vouchers.");
      }
      setLoadingVouchers(false);
    };

    fetchVouchers();
  }, [supplierID]);

  // Handle voucher selection
  const handleVoucherSelect = (voucherID) => {
    setSelectedVoucher(voucherID);
    calculateTotalAmount(voucherID);
  };

  // Calculate total amount
  const calculateTotalAmount = (voucherID) => {
    if (!product) return;

    let discountAmount = 0;
    if (voucherID) {
      const selectedVoucher = vouchers.find(
        (voucher) => voucher.vourcherID === voucherID
      );
      if (selectedVoucher) {
        discountAmount = selectedVoucher.discountAmount;
      }
    }

    const total = product.priceBuy - discountAmount;
    setTotalAmount(total);
  };

  // Handle form submission
  const onFinish = async (values) => {
    // Log form values
    console.log("Form Values:", values);
    console.log("Selected Voucher:", selectedVoucher);
    console.log("Product Data:", product);
    console.log(accountId);

    // Construct orderData with checks
    const orderData = {
      supplierID: supplierID || "", // Ensure supplierID is populated
      accountID: accountId || "", // Ensure accountId is populated
      voucherID: selectedVoucher || null, // Ensure selectedVoucher is valid
      productID: product?.productID || "", // Ensure productID is valid
      orderDate: new Date().toISOString(),
      orderStatus: 0, // Adjust as necessary
      products: [
        {
          productID: product?.productID || "", // Ensure this is set
          productName: product?.name || "",
          productDescription: product?.description || "",
          priceRent: product?.priceRent || 0,
          priceBuy: product?.priceBuy || 0,
          quality: values.quality || 0,
        },
      ],
      totalAmount: totalAmount || 0,
      orderType: 0, // Adjust as necessary
      shippingAddress: values.shippingAddress || "",
      orderDetailRequests: [
        {
          productID: product?.productID || "", // Ensure this is set
          productPrice: product?.priceBuy || 0,
          productQuality: values.quality || 0,
          discount: selectedVoucher
            ? vouchers.find((voucher) => voucher.vourcherID === selectedVoucher)
                ?.discountAmount || 0
            : 0,
          productPriceTotal: totalAmount || 0,
        },
      ],
      deliveryMethod: 0, // Adjust as necessary
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Log the orderData to see if all fields are populated
    console.log("Order Data:", JSON.stringify(orderData, null, 2));

    try {
      const response = await createOrderBuy(orderData);
      message.success("Order created successfully!");
      navigate("/orders");
    } catch (error) {
      message.error(
        "Failed to create order. " + (error.response?.data?.title || "")
      );
      console.error(error);
    }
  };

  return (
    <Card title="Create Order Buy">
      {loadingProduct || loadingVouchers ? (
        <Spin />
      ) : (
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item label="Product Information" className="mb-4">
            {product ? (
              <div className="flex justify-between">
                {/* Left Side: Product Information */}
                <div className="flex-1 pr-4">
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
                <div className="flex-1">
                  <strong>Product Images:</strong>
                  <div className="flex flex-wrap mt-2">
                    {product.listImage && product.listImage.length > 0 ? (
                      product.listImage.map((imageObj, index) => (
                        <img
                          key={imageObj.productImagesID} // Unique key from image object
                          src={imageObj.image}
                          alt={`Product Image ${index + 1}`}
                          className="w-24 h-24 mr-2 mb-2 object-cover" // Tailwind CSS for styling
                        />
                      ))
                    ) : (
                      <p>No images available for this product.</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <p>Loading product information...</p> // Optionally add a loading spinner here
            )}
          </Form.Item>

          <Form.Item
            label="Shipping Address"
            name="shippingAddress"
            rules={[
              {
                required: true,
                message: "Please input the shipping address!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          {/* Voucher Selection as Card Items */}
          <Form.Item label="Voucher">
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {vouchers.map((voucher) => (
                <Card
                  key={voucher.vourcherID}
                  style={{
                    width: 200, // Set card width
                    cursor: "pointer", // Change cursor to pointer for better UX
                    border:
                      selectedVoucher === voucher.vourcherID
                        ? "2px solid #1890ff"
                        : "1px solid #d9d9d9", // Highlight selected card
                    transition: "border 0.3s",
                  }}
                  onClick={() => handleVoucherSelect(voucher.vourcherID)}
                >
                  <Card.Meta
                    title={voucher.vourcherCode}
                    description={voucher.description}
                  />
                </Card>
              ))}
            </div>
          </Form.Item>
          <Form.Item label="Total Amount">
            <Input value={totalAmount} disabled />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Create Order
          </Button>
        </Form>
      )}
    </Card>
  );
};

export default CreateOrderBuy;
