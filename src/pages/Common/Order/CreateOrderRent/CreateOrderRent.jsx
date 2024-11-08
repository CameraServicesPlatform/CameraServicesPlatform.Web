import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  message,
  Select,
  Spin,
  Table,
} from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { createOrderRent } from "../../../../api/orderApi";
import { getProductById } from "../../../../api/productApi";
import {
  getProductVouchersByProductId,
  getVoucherById,
} from "../../../../api/voucherApi";
const { Option } = Select;

const CreateOrderRent = () => {
  const [form] = Form.useForm();
  const [product, setProduct] = useState(null);
  const [vouchers, setVouchers] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [calculatedReturnDate, setCalculatedReturnDate] = useState(null);
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [durationUnit, setDurationUnit] = useState("hour");
  const [durationValue, setDurationValue] = useState(2);
  const location = useLocation();
  const navigate = useNavigate();
  const { productID, supplierID } = location.state || {};
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [loadingVouchers, setLoadingVouchers] = useState(true);
  const user = useSelector((state) => state.user.user || {});
  const accountId = user.id;
  console.log(accountId);
  const [selectedVoucherDetails, setSelectedVoucherDetails] = useState(null);

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
  const handleVoucherSelect = async (voucherID) => {
    console.log("Selected Voucher ID:", voucherID); // Ghi lại ID voucher được chọn

    setSelectedVoucher(vourcherID);
    console.log("Updated Selected Voucher:", vourherID);

    // Fetch voucher details
    const voucherDetails = await getVoucherById(vourherID);
    setSelectedVoucherDetails(voucherDetails);

    calculateTotalAmount(voucherID);
  };

  useEffect(() => {
    console.log("Updated Selected Voucher:", selectedVoucher);
  }, [selectedVoucher]); // Watch for changes to selectedVoucher

  // Calculate total amount
  const calculateTotalAmount = (voucherID) => {
    if (!product) return;

    let discountAmount = 0;
    if (voucherID) {
      const selectedVoucher = vouchers.find(
        (voucher) => voucher.voucherID === voucherID
      );
      if (selectedVoucher) {
        discountAmount = selectedVoucher.discountAmount;
      }
    }

    const total = calculatedPrice - discountAmount;
    setTotalAmount(total);
  };

  // Handle rental start date change
  const handleRentalStartDateChange = (date) => {
    if (date && durationUnit && durationValue) {
      let returnDate;
      let price = 0;

      switch (durationUnit) {
        case "day":
          returnDate = moment(date).add(durationValue, "days");
          price = product.pricePerDay * durationValue;
          break;
        case "hour":
          returnDate = moment(date).add(durationValue, "hours");
          price = product.pricePerHour * durationValue;
          break;
        case "week":
          returnDate = moment(date).add(durationValue, "weeks");
          price = product.pricePerWeek * durationValue;
          break;
        case "month":
          returnDate = moment(date).add(durationValue, "months");
          price = product.pricePerMonth * durationValue;
          break;
        default:
          returnDate = date;
      }

      setCalculatedReturnDate(returnDate);
      setCalculatedPrice(price);
    }
  };

  // Handle duration unit change
  const handleDurationUnitChange = (value) => {
    setDurationUnit(value);
    handleRentalStartDateChange(form.getFieldValue("rentalStartDate"));
    showDurationAlert(value);
  };

  // Handle duration value change
  const handleDurationValueChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setDurationValue(value);
    handleRentalStartDateChange(form.getFieldValue("rentalStartDate"));
  };

  const onFinish = async (values) => {
    if (!product) {
      message.error("Product information is incomplete.");
      return;
    }

    const orderData = {
      supplierID: supplierID || "",
      accountID: accountId || "",
      productID: product?.productID || "",
      voucherID: selectedVoucher,
      orderDate: new Date().toISOString(),
      orderStatus: 0,
      totalAmount: totalAmount || 0,
      products: [
        {
          productID: product?.productID || "",
          productName: product?.productName || "",
          productDescription: product?.productDescription || "",
          priceRent: product?.priceRent || 0,
          priceBuy: product?.priceBuy || 0,
          quality: product?.quality,
        },
      ],
      orderType: 0,
      shippingAddress: values.shippingAddress || "",
      rentalStartDate: values.rentalStartDate.toISOString(),
      rentalEndDate: values.rentalEndDate.toISOString(),
      durationUnit: values.durationUnit || 0,
      durationValue: values.durationValue || 0,
      returnDate: calculatedReturnDate.toISOString(),
      orderDetailRequests: [
        {
          productID: product?.productID || "",
          productPrice: product?.priceBuy || 0,
          productQuality: product?.quality,
          discount: selectedVoucher
            ? vouchers.find((voucher) => voucher.voucherID === selectedVoucher)
                ?.discountAmount || 0
            : 0,
          productPriceTotal: totalAmount || 0,
        },
      ],
      contractRequest: {
        contractTemplateId: values.contractTemplateId || "",
        orderID: "", // This will be filled by the backend
        contractTerms: values.contractTerms || "",
        penaltyPolicy: values.penaltyPolicy || "",
      },
      deliveryMethod: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log(
      "Order Data before API call:",
      JSON.stringify(orderData, null, 2)
    );

    try {
      const response = await createOrderRent(orderData);
      message.success("Order created successfully!");
      navigate("/order-detail");
    } catch (error) {
      message.error(
        "Failed to create order. " + (error.response?.data?.title || "")
      );
      console.error(error);
    }
  };

  const durationOptions = {
    hour: { min: 2, max: 8 },
    day: { min: 1, max: 3 },
    week: { min: 1, max: 2 },
    month: { min: 1, max: 1 },
  };
  const generateTableData = () => {
    if (!product) return [];

    const data = [];

    for (let unit in durationOptions) {
      const { min, max } = durationOptions[unit];
      for (let value = min; value <= max; value++) {
        let price = 0;
        switch (unit) {
          case "day":
            price = product.pricePerDay ? product.pricePerDay * value : null;
            break;
          case "hour":
            price = product.pricePerHour ? product.pricePerHour * value : null;
            break;
          case "week":
            price = product.pricePerWeek ? product.pricePerWeek * value : null;
            break;
          case "month":
            price = product.pricePerMonth
              ? product.pricePerMonth * value
              : null;
            break;
          default:
            break;
        }
        if (price !== null) {
          data.push({
            key: `${unit}-${value}`,
            durationUnit: unit.charAt(0).toUpperCase() + unit.slice(1),
            durationValue: value,
            price: price,
          });
        }
      }
    }

    return data;
  };
  const columns = [
    {
      title: "Duration Unit",
      dataIndex: "durationUnit",
      key: "durationUnit",
    },
    {
      title: "Duration Value",
      dataIndex: "durationValue",
      key: "durationValue",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
  ];

  const tableData = generateTableData();
  const showDurationAlert = (unit) => {
    const { min, max } = durationOptions[unit];
    message.info(
      `You can rent for a minimum of ${min} ${unit}(s) and a maximum of ${max} ${unit}(s).`
    );
  };
  return (
    <Card title="Create Order Rent">
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

          <Form.Item
            label="Rental Start Date"
            name="rentalStartDate"
            rules={[
              {
                required: true,
                message: "Please select the rental start date!",
              },
            ]}
          >
            <DatePicker showTime onChange={handleRentalStartDateChange} />
          </Form.Item>

          <Form.Item
            label="Duration Unit"
            name="durationUnit"
            rules={[
              {
                required: true,
                message: "Please input the duration unit!",
              },
            ]}
          >
            <Select onChange={handleDurationUnitChange}>
              <Option value="hour">Hour</Option>
              <Option value="day">Day</Option>
              <Option value="week">Week</Option>
              <Option value="month">Month</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Duration Value"
            name="durationValue"
            rules={[
              {
                required: true,
                message: "Please input the duration value!",
                type: "number",
                min: durationOptions[durationUnit].min,
                max: durationOptions[durationUnit].max,
              },
            ]}
          >
            <Input
              type="number"
              min={durationOptions[durationUnit].min}
              max={durationOptions[durationUnit].max}
              onChange={handleDurationValueChange}
            />
          </Form.Item>

          <Form.Item
            label="Rental End Date"
            name="rentalEndDate"
            rules={[
              {
                required: true,
                message: "Please select the rental end date!",
              },
            ]}
          >
            <DatePicker showTime value={calculatedReturnDate} />
          </Form.Item>

          <Form.Item
            label="Return Date"
            name="returnDate"
            rules={[
              {
                required: true,
                message: "Please select the return date!",
              },
            ]}
          >
            <DatePicker showTime value={calculatedReturnDate} />
          </Form.Item>
          <Form.Item label="Price Calculation">
            <Table
              columns={columns}
              dataSource={tableData}
              pagination={false}
            />
          </Form.Item>

          <Form.Item
            label="Contract Template ID"
            name="contractTemplateId"
            rules={[
              {
                required: true,
                message: "Please input the contract template ID!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Contract Terms"
            name="contractTerms"
            rules={[
              {
                required: true,
                message: "Please input the contract terms!",
              },
            ]}
          >
            <Input.TextArea />
          </Form.Item>

          <Form.Item
            label="Penalty Policy"
            name="penaltyPolicy"
            rules={[
              {
                required: true,
                message: "Please input the penalty policy!",
              },
            ]}
          >
            <Input.TextArea />
          </Form.Item>

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
                    title={selectedVoucherDetails.vourcherCode}
                    description={selectedVoucherDetails.description}
                  />
                </Card>
              ))}
            </div>
          </Form.Item>

          <Form.Item label="Total Amount">
            <Input value={calculatedPrice} disabled />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Create Order
          </Button>
        </Form>
      )}
    </Card>
  );
};

export default CreateOrderRent;
