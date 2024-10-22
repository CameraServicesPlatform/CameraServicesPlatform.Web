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
    <div className="container mx-auto py-8">
      <LoadingComponent isLoading={isLoading} title="Loading data..." />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 bg-white shadow-md rounded-box p-6">
          <div className="flex justify-between">
            <h2 className="text-xl font-bold mb-4 text-primary">
              Thông tin cá nhân
            </h2>
            <span
              onClick={() => setIsUpdateModalOpen(true)}
              className="cursor-pointer"
            >
              <i className="fa-solid fa-pen text-primary mx-2"></i>
            </span>
          </div>
          <div>
            <p>
              <strong>Họ và tên:</strong> {user.firstName} {user.lastName}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>SDT:</strong> {user.phoneNumber}
            </p>
          </div>
        </div>
        {!isOrderDetail ? (
          <div className="col-span-3 bg-white shadow-lg rounded-box p-6">
            <h2 className="text-xl font-bold mb-4 text-primary text-center">
              Orders
            </h2>
            {orders.length === 0 ? (
              <p>No orders found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Status</th>
                      <th>Total</th>
                      <th>Order Date</th>
                    </tr>
                  </thead>
                  <tbody>{orders.map(renderOrderItems)}</tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div className="col-span-3 shadow-xl rounded-lg p-4">
            <span
              onClick={() => setIsOrderDetail(false)}
              className="text-primary cursor-pointer"
            >
              Back
            </span>
            <div>
              <h3 className="text-lg font-bold mb-2 text-primary text-center">
                Order Details
              </h3>
              <p>
                <strong>Order ID:</strong> {data.order?.id}
              </p>
              <p>
                <strong>Phone:</strong> {data.order?.account?.phoneNumber}
              </p>
              <p>
                <strong>Status:</strong> {orderLabels[data.order?.status]}
              </p>
              <p>
                <strong>Total:</strong> {formatPrice(data.order?.total)}
              </p>
              <p>
                <strong>Order Date:</strong>{" "}
                {formatDateTime(data.order?.purchaseDate)}
              </p>
            </div>
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Seat Rank</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {data.orderDetails?.map((item) => (
                  <tr key={item.id}>
                    <td>{item.seatRank?.event?.title}</td>
                    <td>{item.seatRank?.name}</td>
                    <td>{item.quantity}</td>
                    <td>{formatPrice(item.seatRank?.price)}</td>
                    <td>{formatPrice(item.seatRank?.price * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {data.order?.status === 0 && (
              <div className="flex justify-center">
                <button
                  className="bg-primary text-white rounded-md py-2 px-4 my-2"
                  onClick={() => handlePaymentAgain(data.order?.id)}
                >
                  Pay Now
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
