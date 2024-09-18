import React, { useEffect, useState } from "react";

const PaymentMethod = ({ log }) => {
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  useEffect(() => {
    log(paymentMethod);
  }, [paymentMethod]);

  return (
    <div className=" shadow-lg rounded-box p-6">
      <h2 className="text-xl font-bold mb-4">Phương thức thanh toán</h2>
      <div className="form-control">
        <label className="label cursor-pointer justify-start gap-4">
          <input
            type="radio"
            name="paymentMethod"
            className="radio radio-primary"
            checked={paymentMethod === "cod"}
            onChange={() => handlePaymentMethodChange("cod")}
          />
          <span className="label-text">Thanh toán khi nhận hàng (COD)</span>
        </label>
      </div>
      {/* <div className="form-control">
        <label className="label cursor-pointer justify-start gap-4">
          <input
            type="radio"
            name="paymentMethod"
            className="radio radio-primary"
            checked={paymentMethod === "vnpay"}
            onChange={() => handlePaymentMethodChange("vnpay")}
          />
          <span className="label-text">VNPay</span>
        </label>
      </div> */}
    </div>
  );
};

export default PaymentMethod;
