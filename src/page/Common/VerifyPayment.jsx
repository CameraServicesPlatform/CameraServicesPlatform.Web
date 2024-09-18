import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
// import Home from "../Home";
import paymentSuccess from "../../images/payment-success.gif";
import paymentFailed from "../../images/payment-failed.gif";
import {
  purchaseOrder,
  sendTicketEmail,
  updateStatusOrder,
} from "../../api/orderApi";
import Home from "../Common/Home";
import { message } from "antd";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
const VerifyPayment = () => {
  const location = useLocation();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false); // Corrected state declaration
  const [isVNPAY, setIsVNPAY] = useState(false); // Corrected state declaration
  const [isLoading, setIsLoading] = useState(false); // Corrected state declaration
  const handlePayment = async () => {
    try {
      setIsLoading(true);
      const searchParams = new URLSearchParams(location.search);
      const vnpResponseCode = searchParams.get("vnp_ResponseCode");
      const partnerCode = searchParams.get("partnerCode");
      const resultCode = searchParams.get("resultCode");
      const vnp_TxnRef = searchParams.get("vnp_TxnRef");
      debugger;
      if (vnpResponseCode) {
        setIsVNPAY(true);
        const vnpOrderInfo = decodeURIComponent(
          searchParams.get("vnp_OrderInfo")
        );
        if (vnpResponseCode === "00") {
          const data = await updateStatusOrder(vnp_TxnRef);
          // const emailResponse = await sendTicketEmail(vnp_TxnRef);
          // const data = await updateStatusOrder(vnp_TxnRef);
          if (data.isSuccess) {
            // const emailResponse = await sendTicketEmail(vnp_TxnRef);
            // if (emailResponse.isSuccess) {
            //   message.success("Bạn vui lòng kiểm tra email để nhận mã QR vé");
            // } else {
            //   message.error(
            //     `Hệ thống đã xảy ra lỗi khi gửi email vé. Chúng tôi sẽ khắc phục sớm nhất`
            //   );
            // }
            setModalMessage(`Thanh toán thành công cho ${vnpOrderInfo}`);
            setIsSuccess(true);
          }
        } else {
          setModalMessage(
            `Thanh toán VNPay thất bại cho đơn hàng: ${vnpOrderInfo}. Vui lòng thanh toán lại`
          );
          setIsSuccess(false);
        }
        setModalIsOpen(true);
      } else if (partnerCode === "MOMO") {
        // Hiển thị thông báo Momo
        const orderInfo = decodeURIComponent(searchParams.get("orderInfo"));
        if (resultCode === "0") {
          setModalMessage(`Thanh toán thành công cho ${orderInfo}`);
          setIsSuccess(true);
        } else {
          setModalMessage(
            `Thanh toán Momo thất bại cho đơn hàng: ${orderInfo}. Vui lòng thanh toán lại`
          );
          setIsSuccess(false);
        }
        setModalIsOpen(true);
      }
    } catch (err) {
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
                  alt="Payment Success"
                />
              </div>
              <p className="text-center font-bold">
                Thanh toán {isSuccess ? "thành công" : "thất bại"} với{" "}
                {isVNPAY ? "VNPAY" : "MOMO"}
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
