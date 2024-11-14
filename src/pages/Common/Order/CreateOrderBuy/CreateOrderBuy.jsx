import { Button, Card, Form, message, Select, Spin, Steps } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { getProductById } from "../../../../api/productApi";
import {
  getProductVouchersByProductId,
  getVoucherById,
} from "../../../../api/voucherApi";
import DeliveryMethodBuy from "./DeliveryMethodBuy";
import OrderConfirmationBuy from "./OrderConfirmationBuy";
import OrderReviewBuy from "./OrderReviewBuy";
import ProductDetailsInfoBuy from "./ProductDetailsInfoBuy";
import VoucherSelectionBuy from "./VoucherSelectionBuy";

const { Option } = Select;
const { Step } = Steps;

const CreateOrderBuy = () => {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [product, setProduct] = useState(null);
  const [vouchers, setVouchers] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [deliveryMethod, setDeliveryMethod] = useState(0);
  const [supplierInfo, setSupplierInfo] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { productID, supplierID } = location.state || {};
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [loadingVouchers, setLoadingVouchers] = useState(true);
  const [selectedVoucherDetails, setSelectedVoucherDetails] = useState(null);
  const user = useSelector((state) => state.user.user || {});
  const accountId = user.id;

  useEffect(() => {
    const fetchProduct = async () => {
      setLoadingProduct(true);
      try {
        const productData = await getProductById(productID);
        if (productData) {
          setProduct(productData);
        } else {
          message.error("Không tìm thấy sản phẩm.");
        }
      } catch (error) {
        message.error("Không thể lấy thông tin sản phẩm.");
      }
      setLoadingProduct(false);
    };

    fetchProduct();
  }, [productID]);

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

  const calculateTotalAmount = (voucherDetails) => {
    if (!product) return;

    let discountAmount = 0;
    if (voucherDetails) {
      discountAmount = voucherDetails.discountAmount;
    }

    const total = product.price - discountAmount;
    setTotalAmount(total);
  };

  const onFinish = async (values) => {
    const orderData = {
      supplierID: supplierID || "",
      accountID: accountId || "",
      productID: product?.productID || "",
      vourcherID: selectedVoucher,
      productPrice: product.price || 0,
      orderDate: new Date().toISOString(),
      orderStatus: 0,
      totalAmount: totalAmount || 0,
      products: [
        {
          productID: product?.productID || "",
          productName: product?.productName || "",
          productDescription: product?.productDescription || "",
          price: product.price || 0,
          quality: product?.quality,
        },
      ],
      orderType: 1,
      shippingAddress: values.shippingAddress || "",
      deliveryMethod: deliveryMethod,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const response = await createOrderBuy(orderData);
      if (response.isSuccess && response.result) {
        message.success(
          "Tạo đơn hàng thành công. Đang chuyển hướng đến thanh toán..."
        );
        window.location.href = response.result;
      } else {
        message.error("Không thể khởi tạo thanh toán.");
      }
    } catch (error) {
      message.error(
        "Không thể tạo đơn hàng. " + (error.response?.data?.title || "")
      );
      console.error(error);
    }
  };

  const steps = [
    {
      title: "Chi tiết sản phẩm",
      content: (
        <ProductDetailsInfoBuy product={product} loading={loadingProduct} />
      ),
    },
    {
      title: "Phương thức giao hàng",
      content: (
        <DeliveryMethodBuy
          deliveryMethod={deliveryMethod}
          setDeliveryMethod={setDeliveryMethod}
          supplierInfo={supplierInfo}
        />
      ),
    },
    {
      title: "Chọn Voucher",
      content: (
        <VoucherSelectionBuy
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
        <OrderReviewBuy
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
      content: <OrderConfirmationBuy totalAmount={totalAmount} />,
    },
  ];

  const next = () => {
    setCurrentStep(currentStep + 1);
  };

  const prev = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <Card title="Tạo đơn hàng mua">
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

export default CreateOrderBuy;

// import {
//   Button,
//   Card,
//   Col,
//   Descriptions,
//   Form,
//   Input,
//   message,
//   Radio,
//   Row,
//   Select,
//   Spin,
//   Steps,
// } from "antd";
// import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { useLocation, useNavigate } from "react-router-dom";
// import { createOrderWithPayment } from "../../../../api/orderApi";
// import { getProductById } from "../../../../api/productApi";
// import { getSupplierById } from "../../../../api/supplierApi";
// import {
//   getProductVouchersByProductId,
//   getVoucherById,
// } from "../../../../api/voucherApi";

// const { Option } = Select;
// const { Step } = Steps;

// const CreateOrderBuy = () => {
//   const [form] = Form.useForm();
//   const [currentStep, setCurrentStep] = useState(0);
//   const [product, setProduct] = useState(null);
//   const [vouchers, setVouchers] = useState([]);
//   const [selectedVoucher, setSelectedVoucher] = useState(null);
//   const [totalAmount, setTotalAmount] = useState(0);
//   const [deliveryMethod, setDeliveryMethod] = useState(0);
//   const [supplierInfo, setSupplierInfo] = useState(null);
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { productID, supplierID } = location.state || {};
//   const [loadingProduct, setLoadingProduct] = useState(true);
//   const [loadingVouchers, setLoadingVouchers] = useState(true);

//   const [selectedVoucherDetails, setSelectedVoucherDetails] = useState(null);
// const user = useSelector((state) => state.user.user || {});
//   const accountId = user.id;

//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         if (productID) {
//           const productData = await getProductById(productID);
//           if (productData) {
//             setProduct(productData);
//             form.setFieldsValue({ supplierID });
//             setTotalAmount(productData.priceBuy); // Set initial total amount to product price
//           } else {
//             message.error(
//               "Không tìm thấy sản phẩm hoặc không thể lấy dữ liệu."
//             );
//           }
//         }
//       } catch (error) {
//         message.error("Không thể lấy chi tiết sản phẩm.");
//       }
//       setLoadingProduct(false);
//     };

//     fetchProduct();
//   }, [productID, form, supplierID]);

//   useEffect(() => {
//     const fetchVouchers = async () => {
//       setLoadingVouchers(true);
//       try {
//         const voucherData = await getProductVouchersByProductId(
//           productID,
//           1,
//           10
//         );
//         if (voucherData) {
//           setVouchers(voucherData);
//         } else {
//           message.error("Không có voucher khả dụng.");
//         }
//       } catch (error) {
//         message.error("Không thể lấy voucher.");
//       }
//       setLoadingVouchers(false);
//     };

//     fetchVouchers();
//   }, [productID]);

//   useEffect(() => {
//     const fetchSupplierInfo = async () => {
//       if (deliveryMethod === 0 && supplierID) {
//         const supplierData = await getSupplierById(supplierID);
//         if (
//           supplierData &&
//           supplierData.result &&
//           supplierData.result.items.length > 0
//         ) {
//           setSupplierInfo(supplierData.result.items[0]);
//         } else {
//           message.error("Không thể lấy thông tin nhà cung cấp.");
//         }
//       }
//     };

//     fetchSupplierInfo();
//   }, [deliveryMethod, supplierID]);

//   const handleVoucherSelect = async (e) => {
//     const vourcherID = e.target.value;
//     setSelectedVoucher(vourcherID);
//     try {
//       const voucherDetails = await getVoucherById(vourcherID);
//       setSelectedVoucherDetails(voucherDetails);
//       calculateTotalAmount(vourcherID);
//     } catch (error) {
//       console.error("Lỗi khi lấy chi tiết voucher:", error);
//     }
//   };

//   const calculateTotalAmount = async (vourcherID) => {
//     if (!product) {
//       console.error("Sản phẩm không được xác định");
//       return;
//     }

//     let discountAmount = 0;
//     if (vourcherID) {
//       try {
//         const voucherDetails = await getVoucherById(vourcherID);
//         if (voucherDetails) {
//           discountAmount = voucherDetails.discountAmount;
//         } else {
//           console.error("Không tìm thấy chi tiết voucher");
//         }
//       } catch (error) {
//         console.error("Lỗi khi lấy chi tiết voucher:", error);
//       }
//     }

//     const total = product.priceBuy - discountAmount;
//     setTotalAmount(total);
//   };

//   const onFinish = async (values) => {
//     if (!product) {
//       message.error("Thông tin sản phẩm không đầy đủ.");
//       return;
//     }

//     const orderData = {
//       supplierID: supplierID || "",
//       accountID: accountId || "",
//       vourcherID: selectedVoucher,
//       productID: product?.productID || "",
//       orderDate: new Date().toISOString(),
//       orderStatus: 0,
//       products: [
//         {
//           productID: product?.productID || "",
//           productName: product?.name || "",
//           productDescription: product?.description || "",
//           priceRent: product?.priceRent || 0,
//           priceBuy: product?.priceBuy || 0,
//           quality: product?.quality,
//         },
//       ],
//       totalAmount: totalAmount || 0,
//       orderType: 0,
//       shippingAddress: values.shippingAddress || "",
//       orderDetailRequests: [
//         {
//           productID: product?.productID || "",
//           productPrice: product?.priceBuy || 0,
//           productQuality: product?.quality,
//           discount: selectedVoucher
//             ? vouchers.find((voucher) => voucher.vourcherID === selectedVoucher)
//                 ?.discountAmount || 0
//             : 0,
//           productPriceTotal: totalAmount || 0,
//         },
//       ],
//       deliveryMethod: deliveryMethod,
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//     };

//     try {
//       const response = await createOrderWithPayment(orderData);
//       if (response.isSuccess && response.result) {
//         message.success(
//           "Tạo đơn hàng thành công. Đang chuyển hướng đến thanh toán..."
//         );
//         window.location.href = response.result;
//       } else {
//         message.error("Không thể khởi tạo thanh toán.");
//       }
//     } catch (error) {
//       message.error(
//         "Không thể tạo đơn hàng. " + (error.response?.data?.title || "")
//       );
//       console.error(error);
//     }
//   };

//   const steps = [
//     {
//       title: "Chi tiết sản phẩm",
//       content: (
//         <Form.Item label="Thông tin sản phẩm" className="mb-4">
//           {product ? (
//             <Row gutter={16}>
//               <Col span={12}>
//                 <Descriptions column={1}>
//                   <Descriptions.Item label="Mã sản phẩm">
//                     {product.productID}
//                   </Descriptions.Item>
//                   <Descriptions.Item label="Tên">
//                     {product.productName}
//                   </Descriptions.Item>
//                   <Descriptions.Item label="Mô tả">
//                     {product.productDescription}
//                   </Descriptions.Item>
//                   <Descriptions.Item label="Giá mua">
//                     {product.priceBuy}
//                   </Descriptions.Item>
//                   <Descriptions.Item label="Chất lượng">
//                     {product.quality}
//                   </Descriptions.Item>
//                 </Descriptions>
//               </Col>
//               <Col span={12}>
//                 <strong>Hình ảnh sản phẩm:</strong>
//                 <div className="flex flex-wrap mt-2">
//                   {product.listImage && product.listImage.length > 0 ? (
//                     product.listImage.map((imageObj, index) => (
//                       <img
//                         key={imageObj.productImagesID}
//                         src={imageObj.image}
//                         alt={`Hình ảnh sản phẩm ${index + 1}`}
//                         className="w-24 h-24 mr-2 mb-2 object-cover"
//                       />
//                     ))
//                   ) : (
//                     <p>Không có hình ảnh cho sản phẩm này.</p>
//                   )}
//                 </div>
//               </Col>
//             </Row>
//           ) : (
//             <p>Đang tải thông tin sản phẩm...</p>
//           )}
//         </Form.Item>
//       ),
//     },
//     {
//       title: "Phương thức giao hàng",
//       content: (
//         <>
//           <Form.Item
//             label="Phương thức giao hàng"
//             name="deliveryMethod"
//             rules={[
//               {
//                 required: true,
//                 message: "Vui lòng chọn phương thức giao hàng!",
//               },
//             ]}
//           >
//             <Radio.Group onChange={(e) => setDeliveryMethod(e.target.value)}>
//               <Radio value={0}>Nhận tại cửa hàng</Radio>
//               <Radio value={1}>Giao hàng tận nơi</Radio>
//             </Radio.Group>
//           </Form.Item>

//           {deliveryMethod === 1 && (
//             <Form.Item
//               label="Địa chỉ giao hàng"
//               name="shippingAddress"
//               rules={[
//                 {
//                   required: true,
//                   message: "Vui lòng nhập địa chỉ giao hàng!",
//                 },
//               ]}
//             >
//               <Input />
//             </Form.Item>
//           )}

//           {deliveryMethod === 0 && supplierInfo && (
//             <Descriptions bordered>
//               <Descriptions.Item label="Tên nhà cung cấp">
//                 {supplierInfo.supplierName}
//               </Descriptions.Item>
//               <Descriptions.Item label="Số điện thoại">
//                 {supplierInfo.contactNumber}
//               </Descriptions.Item>
//               <Descriptions.Item label="Địa chỉ nhà cung cấp">
//                 {supplierInfo.supplierAddress}
//               </Descriptions.Item>
//             </Descriptions>
//           )}
//         </>
//       ),
//     },
//     {
//       title: "Chọn Voucher",
//       content: (
//         <Form.Item label="Chọn Voucher">
//           <Radio.Group
//             onChange={handleVoucherSelect}
//             value={selectedVoucher}
//             style={{ width: "100%" }}
//           >
//             <Row gutter={[16, 16]}>
//               {vouchers.map((voucher) => (
//                 <Col span={8} key={voucher.vourcherID}>
//                   <Card
//                     title={voucher.vourcherCode}
//                     bordered={false}
//                     style={{
//                       cursor: "pointer",
//                       borderColor:
//                         selectedVoucher === voucher.vourcherID
//                           ? "#1890ff"
//                           : "#f0f0f0",
//                       backgroundColor:
//                         selectedVoucher === voucher.vourcherID
//                           ? "#e6f7ff"
//                           : "#ffffff",
//                       borderWidth:
//                         selectedVoucher === voucher.vourcherID ? 2 : 1,
//                       boxShadow:
//                         selectedVoucher === voucher.vourcherID
//                           ? "0 4px 8px rgba(0, 0, 0, 0.1)"
//                           : "none",
//                       transition: "all 0.3s ease",
//                     }}
//                     onClick={() => setSelectedVoucher(voucher.vourcherID)}
//                   >
//                     <p>{voucher.description}</p>
//                     {selectedVoucher === voucher.vourcherID &&
//                       selectedVoucherDetails && (
//                         <>
//                           <p>
//                             <strong>Giảm giá:</strong>{" "}
//                             {selectedVoucherDetails.discountAmount}
//                           </p>
//                         </>
//                       )}
//                   </Card>
//                 </Col>
//               ))}
//             </Row>
//           </Radio.Group>
//         </Form.Item>
//       ),
//     },
//     {
//       title: "Xem lại đơn hàng",
//       content: (
//         <div>
//           <h3>Xem lại đơn hàng của bạn</h3>
//           <Row gutter={16}>
//             <Col span={12}>
//               <Card
//                 title="Thông tin sản phẩm"
//                 bordered={false}
//                 style={{ marginBottom: "16px" }}
//               >
//                 <Descriptions bordered column={1}>
//                   <Descriptions.Item label="Mã sản phẩm">
//                     {product?.productID}
//                   </Descriptions.Item>
//                   <Descriptions.Item label="Tên">
//                     {product?.productName}
//                   </Descriptions.Item>
//                   <Descriptions.Item label="Mô tả">
//                     {product?.productDescription}
//                   </Descriptions.Item>
//                   <Descriptions.Item label="Giá mua">
//                     {product?.priceBuy}
//                   </Descriptions.Item>
//                   <Descriptions.Item label="Chất lượng">
//                     {product?.quality}
//                   </Descriptions.Item>
//                 </Descriptions>
//               </Card>
//             </Col>
//             <Col span={12}>
//               <Card
//                 title="Thông tin giao hàng"
//                 bordered={false}
//                 style={{ marginBottom: "16px" }}
//               >
//                 <Descriptions bordered column={1}>
//                   <Descriptions.Item label="Phương thức giao hàng">
//                     {deliveryMethod === 0
//                       ? "Nhận tại cửa hàng"
//                       : "Giao hàng tận nơi"}
//                   </Descriptions.Item>
//                   {deliveryMethod === 1 && (
//                     <Descriptions.Item label="Địa chỉ giao hàng">
//                       {form.getFieldValue("shippingAddress")}
//                     </Descriptions.Item>
//                   )}
//                   {deliveryMethod === 0 && supplierInfo && (
//                     <>
//                       <Descriptions.Item label="Tên nhà cung cấp">
//                         {supplierInfo.supplierName}
//                       </Descriptions.Item>
//                       <Descriptions.Item label="Số điện thoại">
//                         {supplierInfo.contactNumber}
//                       </Descriptions.Item>
//                       <Descriptions.Item label="Địa chỉ nhà cung cấp">
//                         {supplierInfo.supplierAddress}
//                       </Descriptions.Item>
//                     </>
//                   )}
//                 </Descriptions>
//               </Card>
//             </Col>
//           </Row>
//           <Card
//             title="Thông tin Voucher"
//             bordered={false}
//             style={{ marginTop: "16px" }}
//           >
//             {selectedVoucherDetails ? (
//               <Descriptions bordered column={1}>
//                 <Descriptions.Item label="Mã Voucher">
//                   {selectedVoucherDetails.vourcherCode}
//                 </Descriptions.Item>
//                 <Descriptions.Item label="Mô tả">
//                   {selectedVoucherDetails.description}
//                 </Descriptions.Item>
//                 <Descriptions.Item label="Số tiền giảm">
//                   {selectedVoucherDetails.discountAmount}
//                 </Descriptions.Item>
//               </Descriptions>
//             ) : (
//               <p>Không có voucher được chọn.</p>
//             )}
//           </Card>
//           <Card
//             title="Tổng kết đơn hàng"
//             bordered={false}
//             style={{ marginTop: "16px" }}
//           >
//             <Descriptions bordered column={1}>
//               <Descriptions.Item label="Tổng số tiền">
//                 {totalAmount}
//               </Descriptions.Item>
//             </Descriptions>
//           </Card>
//         </div>
//       ),
//     },
//     {
//       title: "Xác nhận",
//       content: (
//         <div>
//           <Card title="Xác nhận đơn hàng" bordered={false}>
//             <Descriptions bordered column={1}>
//               <Descriptions.Item label="Tổng số tiền">
//                 {totalAmount}
//               </Descriptions.Item>
//             </Descriptions>
//             <Form.Item style={{ marginTop: "16px" }}>
//               <Button type="primary" htmlType="submit">
//                 Tạo đơn hàng
//               </Button>
//             </Form.Item>
//           </Card>
//         </div>
//       ),
//     },
//   ];

//   const next = () => {
//     setCurrentStep(currentStep + 1);
//   };

//   const prev = () => {
//     setCurrentStep(currentStep - 1);
//   };

//   return (
//     <Card title="Tạo đơn hàng mua">
//       {loadingProduct || loadingVouchers ? (
//         <Spin />
//       ) : (
//         <Form form={form} layout="vertical" onFinish={onFinish}>
//           <Steps current={currentStep} style={{ marginBottom: "24px" }}>
//             {steps.map((item) => (
//               <Step key={item.title} title={item.title} />
//             ))}
//           </Steps>
//           <div className="steps-content">{steps[currentStep].content}</div>
//           <div className="steps-action" style={{ marginTop: "24px" }}>
//             {currentStep > 0 && (
//               <Button style={{ margin: "0 8px" }} onClick={() => prev()}>
//                 Quay lại
//               </Button>
//             )}
//             {currentStep < steps.length - 1 && (
//               <Button type="primary" onClick={() => next()}>
//                 Tiếp theo
//               </Button>
//             )}
//           </div>
//         </Form>
//       )}
//     </Card>
//   );
// };

// export default CreateOrderBuy;
