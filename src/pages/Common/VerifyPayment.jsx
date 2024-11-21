import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { purchaseOrder } from "../../api/orderApi";
import { createSupplierPaymentPurchuse } from "../../api/transactionApi";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
import paymentFailed from "../../images/payment-failed.gif";
import paymentSuccess from "../../images/payment-success.gif";
import Home from "../Common/Home";

const VerifyPayment = () => {
  const location = useLocation();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isVNPAY, setIsVNPAY] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setIsLoading(true);
      const searchParams = new URLSearchParams(location.search);
      const vnpResponseCode = searchParams.get("vnp_ResponseCode");
      const vnp_TxnRef = searchParams.get("vnp_TxnRef");
      const vnpOrderInfo = decodeURIComponent(
        searchParams.get("vnp_OrderInfo")
      );

      console.log("vnpResponseCode:", vnpResponseCode);
      console.log("vnp_TxnRef:", vnp_TxnRef);
      console.log("vnpOrderInfo:", vnpOrderInfo);

      if (vnpResponseCode) {
        setIsVNPAY(true);
        if (vnpResponseCode === "00") {
          const data =
            (await purchaseOrder(vnp_TxnRef)) ||
            (await createSupplierPaymentPurchuse(vnp_TxnRef));
          console.log("purchaseOrder data:", data);
          setModalMessage(`Thanh toán thành công cho ${vnpOrderInfo}`);
          setIsSuccess(true);
        } else {
          setModalMessage(
            `Thanh toán VNPay thất bại cho đơn hàng: ${vnpOrderInfo}. Vui lòng thanh toán lại`
          );
          setIsSuccess(false);
        }
      } else {
        setModalMessage(
          `Thanh toán VNPay thất bại cho đơn hàng: ${vnpOrderInfo}. Vui lòng thanh toán lại`
        );
        setIsSuccess(false);
      }
      setModalIsOpen(true);
    } catch (err) {
      console.error("Error handling payment:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handlePayment();
  }, [location]);

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <>
      <LoadingComponent isLoading={isLoading} />
      <Home />
      {modalIsOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="modal modal-open shadow-lg">
            <div className="modal-box p-6">
              <div className="grid grid-cols-1 text-center">
                <h2 className="font-bold text-lg">Thông báo thanh toán</h2>
                <img
                  src={isSuccess ? paymentSuccess : paymentFailed}
                  alt="Payment Status"
                />
              </div>
              <p className="text-center font-bold">
                Thanh toán {isSuccess ? "thành công" : "thất bại"} với VNPAY
              </p>
              <p className="py-4">{modalMessage}</p>
              <div className="modal-action flex justify-end">
                <button
                  className="bg-primary text-white px-4 py-2 rounded-md"
                  onClick={closeModal}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VerifyPayment;
