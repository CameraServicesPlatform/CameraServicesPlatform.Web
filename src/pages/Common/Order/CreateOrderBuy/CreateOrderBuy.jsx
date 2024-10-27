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
  const handleVoucherSelect = (vourcherID) => {
    console.log("Selected Voucher ID:", vourcherID); // Ghi lại ID voucher được chọn

    setSelectedVoucher(vourcherID);
    console.log("Updated Selected Voucher:", vourcherID);

    calculateTotalAmount(vourcherID);
  };
  useEffect(() => {
    console.log("Updated Selected Voucher:", selectedVoucher);
  }, [selectedVoucher]); // Theo dõi thay đổi của selectedVoucher

  // Calculate total amount
  const calculateTotalAmount = (vourcherID) => {
    if (!product) return;

    let discountAmount = 0;
    if (vourcherID) {
      const selectedVoucher = vouchers.find(
        (voucher) => voucher.vourcherID === vourcherID
      );
      if (selectedVoucher) {
        discountAmount = selectedVoucher.discountAmount;
      }
    }

    const total = product.priceBuy - discountAmount;
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
      const response = await createOrderBuy(orderData);
      message.success("Order created successfully!");
      navigate("/order-detail");
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
