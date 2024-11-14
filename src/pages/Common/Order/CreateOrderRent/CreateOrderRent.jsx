import { Button, Card, Form, Spin, Steps, message } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import { getContractTemplateByProductId } from "../../../../api/contractTemplateApi";
import { createOrderRentWithPayment } from "../../../../api/orderApi";
import { getProductById } from "../../../../api/productApi";
import {
  getProductVouchersByProductId,
  getVoucherById,
} from "../../../../api/voucherApi";

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
  const [productPriceRent, setProductPriceRent] = useState(0);
  const [rentalStartDate, setRentalStartDate] = useState(null);
  const [rentalEndDate, setRentalEndDate] = useState(null);
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
  const [contractTemplate, setContractTemplate] = useState([]);
  const [showContractTerms, setShowContractTerms] = useState(false);

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

  // Fetch vouchers by product ID
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
          message.error("Không có voucher khả dụng.");
        }
      } catch (error) {
        message.error("Không thể lấy voucher.");
      }
      setLoadingVouchers(false);
    };

    fetchVouchers();
  }, [productID]);

  // Handle voucher selection
  const handleVoucherSelect = async (e) => {
    const voucherID = e.target.value;
    setSelectedVoucher(voucherID);
    try {
      const voucherDetails = await getVoucherById(voucherID);
      setSelectedVoucherDetails(voucherDetails);
      calculateTotalAmount(voucherDetails);
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết voucher:", error);
    }
  };

  // Calculate total amount
  const calculateTotalAmount = (voucherDetails) => {
    if (!product) return;

    let discountAmount = 0;
    if (voucherDetails) {
      discountAmount = voucherDetails.discountAmount;
    }

    const total = productPriceRent - discountAmount;
    setTotalAmount(total);
  };

  const toggleContractTerms = () => {
    setShowContractTerms(!showContractTerms);
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
      vourcherID: selectedVoucher,
      productPriceRent: setProductPriceRent,
      orderDate: new Date().toISOString(),
      orderStatus: 0,
      totalAmount: totalAmount || 0,
      products: [
        {
          productID: product?.productID || "",
          productName: product?.productName || "",
          productDescription: product?.productDescription || "",
          priceRent: setProductPriceRent,
          quality: product?.quality,
        },
      ],
      orderType: 0,
      shippingAddress: setDeliveryMethod,
      rentalStartDate: setRentalStartDate,
      rentalEndDate: setRentalEndDate,
      durationUnit: setDurationValue,
      durationValue: setDurationValue,
      returnDate: setRentalEndDate,
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
          durationUnit={durationUnit}
          setDurationUnit={setDurationUnit}
          durationValue={durationValue}
          setDurationValue={setDurationValue}
          productPriceRent={productPriceRent}
          setProductPriceRent={setProductPriceRent}
          loading={loadingProduct}
          showContractTerms={showContractTerms}
          toggleContractTerms={toggleContractTerms}
          rentalStartDate={rentalStartDate}
          setRentalStartDate={setRentalStartDate}
          rentalEndDate={rentalEndDate}
          setRentalEndDate={setRentalEndDate}
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
          setSelectedVoucher={setSelectedVoucher}
          handleVoucherSelect={handleVoucherSelect}
          selectedVoucherDetails={selectedVoucherDetails}
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
          contractTemplate={contractTemplate}
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
