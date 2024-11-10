import { message } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  createOrderWithPayment,
  getOrderDetailsById,
  getOrdersByAccount,
} from "../../api/orderApi";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
import { orderLabels } from "../../utils/constant";
import { formatDateTime, formatPrice } from "../../utils/util";
import PersonalModal from "./Account/PersonalModal";
import "tailwindcss/tailwind.css";

const PersonalInformation = () => {
  const { user } = useSelector((state) => state.user || {});
  const [orders, setOrders] = useState([]);
  const [isOrderDetail, setIsOrderDetail] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await getOrdersByAccount(user.id, 1, 100);
      if (response) {
        setOrders(response.items || []);
      } else {
        message.error("Failed to fetch orders.");
      }
    } catch (error) {
      message.error("An error occurred, please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const userMap = {
    name: `${user.firstName} ${user.lastName}`,
    email: `${user.email}`,
    phone: `${user.phoneNumber}`,
  };

  useEffect(() => {
    if (user?.id) fetchOrders();
  }, [user]);

  const fetchOrderDetails = async (id) => {
    try {
      setIsLoading(true);
      const response = await getOrderDetailsById(id, 1, 100);
      if (response) {
        setData(response);
      } else {
        message.error("Failed to fetch order details.");
      }
    } catch (error) {
      message.error("An error occurred, please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClick = (order) => {
    setIsOrderDetail(true);
    fetchOrderDetails(order.id);
  };

  const renderOrderItems = (order) => (
    <tr
      key={order.id}
      className="cursor-pointer"
      onClick={() => handleClick(order)}
    >
      <td>{order.id}</td>
      <td>{orderLabels[order.status]}</td>
      <td>{formatPrice(order.total)}</td>
      <td>{formatDateTime(order.purchaseDate)}</td>
    </tr>
  );

  const handlePaymentAgain = async (orderId) => {
    try {
      setIsLoading(true);
      const response = await createOrderWithPayment(orderId);
      if (response) {
        window.location.href = response.paymentUrl;
      } else {
        message.error("Failed to initiate payment.");
      }
    } catch (error) {
      message.error("An error occurred, please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <LoadingComponent isLoading={isLoading} title="Loading data..." />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-teal-600">Thông tin cá nhân</h2>
            <button
              onClick={() => setIsUpdateModalOpen(true)}
              className="text-teal-600 hover:text-teal-800 focus:outline-none"
            >
              <i className="fa-solid fa-pen"></i>
            </button>
          </div>
          <div className="space-y-2">
            <p><strong>Họ và tên:</strong> {user.firstName} {user.lastName}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>SDT:</strong> {user.phoneNumber}</p>
          </div>
        </div>
        {!isOrderDetail ? (
          <div className="lg:col-span-3 bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-bold text-teal-600 mb-4 text-center">Đơn hàng</h2>
            {orders.length === 0 ? (
              <p className="text-center text-gray-500">Không tìm thấy đơn hàng nào.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b">Mã đơn hàng</th>
                      <th className="py-2 px-4 border-b">Trạng thái</th>
                      <th className="py-2 px-4 border-b">Tổng tiền</th>
                      <th className="py-2 px-4 border-b">Ngày đặt hàng</th>
                    </tr>
                  </thead>
                  <tbody>{orders.map(renderOrderItems)}</tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div className="lg:col-span-3 bg-white shadow-xl rounded-lg p-6">
            <button
              onClick={() => setIsOrderDetail(false)}
              className="text-teal-600 hover:text-teal-800 mb-4"
            >
              Quay lại
            </button>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-teal-600 text-center">Chi tiết đơn hàng</h3>
              <p><strong>Mã đơn hàng:</strong> {data.order?.id}</p>
              <p><strong>Số điện thoại:</strong> {data.order?.account?.phoneNumber}</p>
              <p><strong>Trạng thái:</strong> {orderLabels[data.order?.status]}</p>
              <p><strong>Tổng tiền:</strong> {formatPrice(data.order?.total)}</p>
              <p><strong>Ngày đặt hàng:</strong> {formatDateTime(data.order?.purchaseDate)}</p>
            </div>
            {data.order?.status === 0 && (
              <div className="flex justify-center mt-4">
                <button
                  className="bg-teal-600 text-white rounded-md py-2 px-4 hover:bg-teal-700"
                  onClick={() => handlePaymentAgain(data.order?.id)}
                >
                  Thanh toán ngay
                </button>
              </div>
            )}
          </div>
        )}
        {isUpdateModalOpen && (
          <PersonalModal onClose={() => setIsUpdateModalOpen(false)} />
        )}
      </div>
    </div>
  );
};

export default PersonalInformation;
