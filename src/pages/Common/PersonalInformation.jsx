import { message } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "tailwindcss/tailwind.css";
import {
  createOrderWithPayment,
  getOrderDetailsById,
  getOrdersByAccount,
} from "../../api/orderApi";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
import { formatDateTime, formatPrice } from "../../utils/util";
import PersonalModal from "./Account/PersonalModal";

const jobDescriptions = {
  0: "Học sinh",
  1: "Nhiếp ảnh chuyên nghiệp",
  2: "Nhiếp ảnh tự do",
  3: "Người sáng tạo nội dung",
  4: "Người mới bắt đầu",
  5: "Sinh viên nhiếp ảnh",
  6: "Người yêu thích du lịch",
  7: "Người dùng thông thường",
  8: "Khác",
};

const hobbyDescriptions = {
  0: "Chụp ảnh phong cảnh",
  1: "Chụp ảnh chân dung",
  2: "Chụp ảnh động vật hoang dã",
  3: "Chụp ảnh đường phố",
  4: "Chụp ảnh cận cảnh",
  5: "Chụp ảnh thể thao",
  6: "Khác",
};

const PersonalInformation = () => {
  const { user } = useSelector((state) => state.user || {});
  const [orders, setOrders] = useState([]);
  const [isOrderDetail, setIsOrderDetail] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [dataDetai, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      console.log("Fetching orders for user ID:", user.id);
      const response = await getOrdersByAccount(user.id, 1, 100);
      console.log("API response:", response);
      if (response.isSuccess) {
        setOrders(response.result || []);
      } else {
        message.error("Failed to fetch orders.");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      message.error("An error occurred, please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const userMap = {
    name: `${user?.firstName || ""} ${user?.lastName || ""}`,
    email: `${user?.email || ""}`,
    phone: `${user?.phoneNumber || ""}`,
    address: `${user?.address || ""}`,
    job: user?.job,
    hobby: user?.hobby,
    gender: user?.gender,
    bankName: `${user?.bankName || ""}`,
    accountNumber: `${user?.accountNumber || ""}`,
    accountHolder: `${user?.accountHolder || ""}`,
  };

  useEffect(() => {
    if (user?.id) fetchOrders();
  }, [user]);

  const fetchOrderDetails = async (id) => {
    try {
      setIsLoading(true);
      const response = await getOrderDetailsById(id, 1, 1);
      if (response.isSuccess) {
        setData(response.result);
      } else {
        message.error("Failed to fetch order details.");
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      message.error("An error occurred, please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (dataDetai.length > 0) {
      console.log("Chi tiết đơn hàng", dataDetai);
    }
  }, [dataDetai]);

  const handleClick = (order) => {
    setIsOrderDetail(true);
    fetchOrderDetails(order.orderID);
  };

  const renderOrderItems = (order) => (
    <tr
      key={order.orderID}
      className="cursor-pointer"
      onClick={() => handleClick(order)}
    >
      <td>{order.orderID}</td>
      <td>{order.orderStatus}</td>
      <td>{formatPrice(order.totalAmount)}</td>
      <td>{formatDateTime(order.orderDate)}</td>
      <td>{order.shippingAddress}</td>
      <td>{order.supplierID}</td>
    </tr>
  );

  const handlePaymentAgain = async (orderId) => {
    try {
      setIsLoading(true);
      const response = await createOrderWithPayment(orderId);
      if (response.isSuccess) {
        window.location.href = response.paymentUrl;
      } else {
        message.error("Failed to initiate payment.");
      }
    } catch (error) {
      console.error("Error initiating payment:", error);
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
            <h2 className="text-xl font-bold text-teal-600">
              Thông tin cá nhân
            </h2>
            <button
              onClick={() => setIsUpdateModalOpen(true)}
              className="text-teal-600 hover:text-teal-800 focus:outline-none"
            >
              <i className="fa-solid fa-pen"></i>
            </button>
          </div>
          <div className="space-y-2">
            <p>
              <strong>Họ và tên:</strong> {userMap.name}
            </p>
            <p>
              <strong>Email:</strong> {userMap.email}
            </p>
            <p>
              <strong>SDT:</strong> {userMap.phone}
            </p>
            <p>
              <strong>Địa chỉ:</strong> {userMap.address}
            </p>
            <p>
              <strong>Ngành nghề:</strong> {jobDescriptions[userMap.job]}
            </p>
            <p>
              <strong>Sở thích:</strong> {hobbyDescriptions[userMap.hobby]}
            </p>
            <p>
              <strong>Giới tính:</strong> {userMap.gender === 0 ? "Nam" : "Nữ"}
            </p>
            <div className="flex justify-end"></div>
          </div>
        </div>

        {!isOrderDetail ? (
          <div className="lg:col-span-3 bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-bold text-teal-600 mb-4 text-center">
              Đơn hàng
            </h2>
            {orders.length === 0 ? (
              <p className="text-center text-gray-500">
                Không tìm thấy đơn hàng nào.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b">Mã đơn hàng</th>
                      <th className="py-2 px-4 border-b">Trạng thái</th>
                      <th className="py-2 px-4 border-b">Tổng tiền</th>
                      <th className="py-2 px-4 border-b">Ngày đặt hàng</th>
                      <th className="py-2 px-4 border-b">Địa chỉ giao hàng</th>
                      <th className="py-2 px-4 border-b">Mã nhà cung cấp</th>
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
              <h3 className="text-xl font-semibold text-teal-600 text-center">
                Chi tiết đơn hàng
              </h3>
              {dataDetai.map((orderdetails) => (
                <div key={orderdetails.orderID}>
                  <p>
                    <strong>Mã đơn hàng:</strong> {orderdetails.orderID}
                  </p>
                  <p>
                    <strong>Số điện thoại:</strong> {userMap.phone}
                  </p>
                  <p>
                    <strong>Tổng tiền:</strong>
                    {formatPrice(orderdetails.productPriceTotal) || "N/A"}
                  </p>
                  <p>
                    <strong>Sản phẩm:</strong>
                    {orderdetails.productName || "N/A"}
                  </p>
                  <p>
                    <strong>Chất lượng</strong>
                    {orderdetails.productQuality || "N/A"}
                  </p>
                  <p>
                    <strong>rentalPeriod</strong>
                    {orderdetails.rentalPeriod}
                  </p>
                  <p>
                    <strong>discount</strong>
                    {orderdetails.discount}
                  </p>
                  <h4 className="text-lg font-semibold text-teal-600 mt-4">
                    Chi tiết sản phẩm
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                      <thead>
                        <tr>
                          <th className="py-2 px-4 border-b">Tên sản phẩm</th>
                          <th className="py-2 px-4 border-b">Giá</th>
                          <th className="py-2 px-4 border-b">Chất lượng</th>
                          <th className="py-2 px-4 border-b">Tổng giá</th>
                          <th className="py-2 px-4 border-b">Serial Number</th>
                          <th className="py-2 px-4 border-b">Supplier ID</th>
                          <th className="py-2 px-4 border-b">Category ID</th>
                          <th className="py-2 px-4 border-b">Created At</th>
                          <th className="py-2 px-4 border-b">Updated At</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dataDetai.length > 0 ? (
                          dataDetai.map((orderdetails) => (
                            <tr key={orderdetails.productID}>
                              <td>
                                {orderdetails.product.productName || "N/A"}
                              </td>
                              <td>
                                {formatPrice(orderdetails.product.priceBuy)}
                              </td>
                              <td>{orderdetails.product.quality}</td>
                              <td>
                                {formatPrice(orderdetails.productPriceTotal)}
                              </td>
                              <td>
                                {orderdetails.product.serialNumber || "N/A"}
                              </td>
                              <td>
                                {orderdetails.product.supplierID || "N/A"}
                              </td>
                              <td>
                                {orderdetails.product.categoryID || "N/A"}
                              </td>
                              <td>
                                {new Date(
                                  orderdetails.product.createdAt
                                ).toLocaleString()}
                              </td>
                              <td>
                                {new Date(
                                  orderdetails.product.updatedAt
                                ).toLocaleString()}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="10" className="text-center">
                              Không có sản phẩm nào
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
            {dataDetai[0]?.orderStatus === 0 && (
              <div className="flex justify-center mt-4">
                <button
                  className="bg-teal-600 text-white rounded-md py-2 px-4 hover:bg-teal-700"
                  onClick={() => handlePaymentAgain(dataDetai[0].orderID)}
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
