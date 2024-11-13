import { Button, Card, Form, Spin, Steps, message } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import { getProductById } from "../../../../api/productApi";
import {
  getProductVouchersByProductId,
  getVoucherById,
} from "../../../../api/voucherApi";
import { getContractTemplateByProductId } from "../../../../api/contractTemplateApi"; // Import the function
import { createOrderRentWithPayment } from "../../../../api/orderApi"; // Import the function

import DeliveryMethod from "./DeliveryMethod";
import OrderConfirmation from "./OrderConfirmation";
import OrderReview from "./OrderReview";
import ProductDetailsInfoRent from "./ProductDetailsInfoRent";
import VoucherSelection from "./VoucherSelection";

const { Step } = Steps;

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
  const [selectedVoucherDetails, setSelectedVoucherDetails] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [deliveryMethod, setDeliveryMethod] = useState(0);
  const [supplierInfo, setSupplierInfo] = useState(null);
  const [contractTemplate, setContractTemplate] = useState([]); // Initialize as an array

  // Fetch product details and contract template
  useEffect(() => {
    const fetchProductAndContractTemplate = async () => {
      try {
        if (productID) {
          const productData = await getProductById(productID);
          if (productData) {
            setProduct(productData);
            form.setFieldsValue({ supplierID });

            // Fetch contract template
            const contractTemplateData = await getContractTemplateByProductId(
              productID
            );
            console.log("Contract Template Data:", contractTemplateData); // Log the contract template data
            setContractTemplate(contractTemplateData);
          } else {
            message.error("Product not found or could not be retrieved.");
          }
        }
      } catch (error) {
        message.error("Failed to fetch product details or contract template.");
      }
      setLoadingProduct(false);
    };

    fetchProductAndContractTemplate();
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
        );
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
    setSelectedVoucher(voucherID);
    const voucherDetails = await getVoucherById(voucherID);
    setSelectedVoucherDetails(voucherDetails);
    calculateTotalAmount(voucherID);
  };

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
      productPriceRent: product?.priceRent || 0,
      orderDate: new Date().toISOString(),
      orderStatus: 0,
      totalAmount: totalAmount || 0,
      products: [
        {
          productID: product?.productID || "",
          productName: product?.productName || "",
          productDescription: product?.productDescription || "",
          priceRent: product?.priceRent || 0,
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
      deliveryMethod: deliveryMethod,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const response = await createOrderRentWithPayment(orderData);
      message.success("Order created successfully!");
      navigate("/order-detail");
    } catch (error) {
      message.error(
        "Failed to create order. " + (error.response?.data?.title || "")
      );
    }
  };

  const steps = [
    {
      title: "Chi tiết sản phẩm",
      content: (
        <ProductDetailsInfoRent
          product={product}
          contractTemplate={contractTemplate}
        />
      ),
    },
    {
      title: "Phương thức giao hàng",
      content: (
        <DeliveryMethod
          deliveryMethod={deliveryMethod}
          setDeliveryMethod={setDeliveryMethod}
          supplierInfo={supplierInfo}
        />
      ),
    },
    {
      title: "Chọn Voucher",
      content: (
        <VoucherSelection
          vouchers={vouchers}
          selectedVoucher={selectedVoucher}
          setSelectedVoucher={handleVoucherSelect}
        />
      ),
    },
    {
      title: "Xem lại đơn hàng",
      content: (
        <OrderReview
          product={product}
          form={form}
          deliveryMethod={deliveryMethod}
          supplierInfo={supplierInfo}
          selectedVoucherDetails={selectedVoucherDetails}
          totalAmount={totalAmount}
        />
      ),
    },
    {
      title: "Xác nhận",
      content: <OrderConfirmation totalAmount={totalAmount} />,
    },
  ];

  const next = () => {
    setCurrentStep(currentStep + 1);
  };

  const prev = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <Card title="Tạo đơn hàng thuê">
      {loadingProduct || loadingVouchers ? (
        <Spin />
      ) : (
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Steps current={currentStep}>
            {steps.map((item) => (
              <Step key={item.title} title={item.title} />
            ))}
          </Steps>
          <div className="steps-content" style={{ marginTop: "16px" }}>
            {steps[currentStep].content}
          </div>
          <div className="steps-action" style={{ marginTop: "16px" }}>
            {currentStep > 0 && (
              <Button style={{ margin: "0 8px" }} onClick={() => prev()}>
                Quay lại
              </Button>
            )}
            {currentStep < steps.length - 1 && (
              <Button type="primary" onClick={() => next()}>
                Tiếp theo
              </Button>
            )}
            {currentStep === steps.length - 1 && (
              <Button type="primary" htmlType="submit">
                Tạo đơn hàng
              </Button>
            )}
          </div>
        </Form>
      )}
    </Card>
  );
};

export default CreateOrderRent;
