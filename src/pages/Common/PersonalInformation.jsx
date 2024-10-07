import { message } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  getAllOrderByAccountId,
  getAllOrderDetailsByOrderId,
  purchaseOrder,
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
  const userMap = {
    name: `${user.firstName} ${user.lastName}`,
    email: `${user.email}`,
    phone: `${user.phoneNumber}`,
  };
  const fetchOrders = async () => {
    try {
      setIsLoading(true);

      const data = await getAllOrderByAccountId(user.id, 1, 100);
      if (data.isSuccess) {
        setOrders(data.result.items);
      }
    } catch (error) {
      message.error("Đã xảy ra lỗi, vui lòng thử lại sau");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);
  const fetchOrderDetails = async (id) => {
    try {
      setIsLoading(true);
      const data = await getAllOrderDetailsByOrderId(id, 1, 100);
      if (data.isSuccess) {
        setData(data.result);
      }
    } catch (error) {
      message.error("Đã xảy ra lỗi, vui lòng thử lại sau");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClick = (item) => {
    setIsOrderDetail(true);
    fetchOrderDetails(item.order?.id);
  };
  const renderOrderItems = (order) => {
    console.log(order);
    return (
      <tr
        key={order.order?.id}
        className="cursor-pointer"
        onClick={() => handleClick(order)}
      >
        <td>{order.order?.id}</td>
        <td>{orderLabels[order?.order?.status]}</td>
        <td>{formatPrice(order?.order?.total)}</td>
        <td>{formatDateTime(order?.order?.purchaseDate)}</td>
      </tr>
    );
  };

  const handlePaymentAgain = async (id) => {
    try {
      setIsLoading(true);
      debugger;
      const data = await purchaseOrder(id);
      if (data.isSuccess) {
        window.location.href = data.result;
      }
    } catch (error) {
      message.error("Đã xảy ra lỗi, vui lòng thử lại sau");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="container mx-auto py-8">
      <LoadingComponent isLoading={isLoading} title={"Đang tải dữ liệu"} />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 bg-white shadow-md rounded-box p-6">
          <div className="flex justify-between">
            <h2 className="text-xl font-bold mb-4 text-primary">
              Thông tin người dùng
            </h2>
            <span
              onClick={() => setIsUpdateModalOpen(true)}
              className="cursor-pointer"
            >
              <i className="fa-solid fa-pen text-primary mx-2"></i>
            </span>
          </div>

          <div style={{ wordBreak: "break-word", whiteSpace: "pre-wrap" }}>
            <p>
              <strong>Tên:</strong> {userMap?.name}
            </p>
            <p>
              <strong>Email:</strong> {userMap?.email}
            </p>
            <p>
              <strong>Số điện thoại:</strong> {userMap?.phone}
            </p>
          </div>
        </div>
        {!isOrderDetail ? (
          <>
            <div className="col-span-3 bg-white shadow-lg rounded-box p-6">
              <h2 className="text-xl font-bold mb-4 text-primary text-center">
                Đơn hàng
              </h2>
              {orders.length === 0 ? (
                <p>Bạn chưa có đơn hàng nào.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Mã đơn hàng</th>
                        <th>Trạng thái</th>
                        <th>Tổng tiền</th>
                        <th>Thời gian đặt</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders &&
                        orders.length > 0 &&
                        orders.map((order) => renderOrderItems(order))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="col-span-3 gap-4 shadow-xl rounded-lg p-4">
              <span
                onClick={() => setIsOrderDetail(!isOrderDetail)}
                className="text-primary cursor-pointer"
              >
                Back
              </span>
              <div>
                <div>
                  <h3 className="text-lg font-bold mb-2 text-primary text-center">
                    Thông tin đơn hàng
                  </h3>

                  <p>
                    <strong>Mã đơn hàng:</strong> {data.order?.id}
                  </p>

                  <p>
                    <strong>Số điện thoại:</strong>{" "}
                    {data.order?.account?.phoneNumber}
                  </p>
                  <p>
                    <strong>Trạng thái:</strong>{" "}
                    {orderLabels[data.order?.status]}
                  </p>
                  <p>
                    <strong>Tổng tiền:</strong> {formatPrice(data.order?.total)}
                  </p>
                  <p>
                    <strong>Thời gian đặt hàng:</strong>{" "}
                    {formatDateTime(data.order?.purchaseDate)}
                  </p>
                </div>
              </div>
              <div>
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>Tên event</th>
                      <th>Hạng ghế</th>
                      <th>Số lượng</th>
                      <th>Đơn giá</th>
                      <th>Tổng tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.orderDetails &&
                      data.orderDetails?.length > 0 &&
                      data.orderDetails.map((item) => (
                        <tr key={item.id}>
                          <td>{item.seatRank?.event?.title}</td>
                          <td>{item?.seatRank?.name}</td>
                          <td>{item.quantity}</td>
                          <td>{formatPrice(item.seatRank?.price)}</td>
                          <td>
                            {formatPrice(item.seatRank?.price * item.quantity)}
                          </td>
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
                      Thanh toán ngay
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
        {isUpdateModalOpen && (
          <PersonalModal
            onClose={() => setIsUpdateModalOpen(!isUpdateModalOpen)}
          />
        )}
      </div>
    </div>
  );
};

export default PersonalInformation;
