import { Button, Card, Form, Input, message, Select, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { createOrderWithPayment } from "../../../../api/orderApi";
import { getProductById } from "../../../../api/productApi";
import {
  getProductVouchersByProductId,
  getVoucherById,
} from "../../../../api/voucherApi";

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
  const [selectedVoucherDetails, setSelectedVoucherDetails] = useState(null);

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
        const voucherData = await getProductVouchersByProductId(
          productID,
          1,
          10
        ); // Adjust pageIndex and pageSize as needed
        if (voucherData) {
          setVouchers(voucherData);
          if (voucherData.length > 0) {
            const firstVoucher = voucherData[0];
            setSelectedVoucher(firstVoucher.vourcherID);
            const voucherDetails = await getVoucherById(
              firstVoucher.vourcherID
            );
            setSelectedVoucherDetails(voucherDetails);
            calculateTotalAmount(firstVoucher.vourcherID);
          }
        } else {
          message.error("No vouchers available.");
        }
      } catch (error) {
        message.error("Failed to fetch vouchers.");
      }
      setLoadingVouchers(false);
    };

    fetchVouchers();
  }, [productID]);

  // Handle voucher selection
  const handleVoucherSelect = async (vourcherID) => {
    if (!vourcherID) {
      console.error("Invalid voucher ID:", vourcherID);
      return;
    }

    console.log("Selected Voucher ID:", vourcherID); // Log selected voucher ID

    setSelectedVoucher(vourcherID);
    console.log("Updated Selected Voucher:", vourcherID);

    try {
      // Fetch voucher details
      const voucherDetails = await getVoucherById(vourcherID);
      setSelectedVoucherDetails(voucherDetails);

      calculateTotalAmount(vourcherID);
    } catch (error) {
      console.error("Error fetching voucher details:", error);
    }
  };

  useEffect(() => {
    console.log("Updated Selected Voucher:", selectedVoucher);
  }, [selectedVoucher]);

  // Calculate total amount
  const calculateTotalAmount = async (vourcherID) => {
    if (!product) {
      console.error("Product is not defined");
      return;
    }

    let discountAmount = 0;
    if (vourcherID) {
      try {
        const voucherDetails = await getVoucherById(vourcherID);
        if (voucherDetails) {
          discountAmount = voucherDetails.discountAmount;
          console.log("Selected Voucher Details:", voucherDetails);
        } else {
          console.error("Voucher details not found");
        }
      } catch (error) {
        console.error("Error fetching voucher details:", error);
      }
    }

    const total = product.priceBuy - discountAmount;
    console.log("Product priceBuy:", product.priceBuy);
    console.log("Discount amount:", discountAmount);
    console.log("Total amount:", total);

    setTotalAmount(total);
  };

  const onFinish = async (values) => {
    if (!product) {
      message.error("Product information is incomplete.");
      return;
    }

    const orderData = {
      supplierID: supplierID || "",
      accountID: accountId || "",
      vourcherID: selectedVoucher,
      productID: product?.productID || "",
      orderDate: new Date().toISOString(),
      orderStatus: 0,
      products: [
        {
          productID: product?.productID || "",
          productName: product?.name || "",
          productDescription: product?.description || "",
          priceRent: product?.priceRent || 0,
          priceBuy: product?.priceBuy || 0,
          quality: product?.quality,
        },
      ],
      totalAmount: totalAmount || 0,
      orderType: 0,
      shippingAddress: values.shippingAddress || "",
      orderDetailRequests: [
        {
          productID: product?.productID || "",
          productPrice: product?.priceBuy || 0,
          productQuality: product?.quality,
          discount: selectedVoucher
            ? vouchers.find((voucher) => voucher.vourcherID === selectedVoucher)
                ?.discountAmount || 0
            : 0,
          productPriceTotal: totalAmount || 0,
        },
      ],
      deliveryMethod: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log(
      "Order Data before API call:",
      JSON.stringify(orderData, null, 2)
    );

    try {
      const response = await createOrderWithPayment(orderData);
      if (response.isSuccess && response.result) {
        message.success(
          "Order created successfully. Redirecting to payment..."
        );
        // Redirect to the payment URL
        window.location.href = response.result;
      } else {
        message.error("Failed to initiate payment.");
      }
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
                  title="Nhấn vào đây nhận ưu đãi"
                  bordered={false}
                  style={{
                    width: 300, // Set card width
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
                    title={voucher.vourcherCode} // Display voucher code directly from voucher object
                    description={voucher.description} // Display description directly from voucher object
                  />
                  {selectedVoucher === voucher.vourcherID &&
                    selectedVoucherDetails && (
                      <div style={{ marginTop: "10px" }}>
                        <p>
                          <strong>Mã:</strong>{" "}
                          {selectedVoucherDetails.vourcherCode}
                        </p>
                        <p>
                          <strong>Mô tả:</strong>{" "}
                          {selectedVoucherDetails.description}
                        </p>
                        <p>
                          <strong>Giảm giá:</strong>{" "}
                          {selectedVoucherDetails.discountAmount}
                        </p>
                      </div>
                    )}
                </Card>
              ))}
            </div>
          </Form.Item>

          <Form.Item label="Tổng số tiền">
            <Input value={totalAmount} disabled />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Tạo đơn hàng
          </Button>
        </Form>
      )}
    </Card>
  );
};

export default CreateOrderBuy;
