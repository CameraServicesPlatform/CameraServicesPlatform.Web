import { faClock, faEdit, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { message } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "tailwindcss/tailwind.css";
import { getCategoryById } from "../../api/categoryApi";
import {
  cancelOrder,
  getOrderDetailsById,
  getOrdersByAccount,
  purchaseOrder,
  updateOrderStatusPlaced,
} from "../../api/orderApi";
import { getSupplierById } from "../../api/supplierApi";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
import { formatDateTime, formatPrice } from "../../utils/util";
import PersonalModal from "./Account/PersonalModal";
const jobDescriptions = {
  0: "Sinh viên",
  1: "Nhiếp ảnh gia chuyên nghiệp",
  2: "Nhiếp ảnh gia tự do",
  3: "Người sáng tạo nội dung",
  4: "Người mới bắt đầu",
  5: "Sinh viên nhiếp ảnh",
  6: "Người đam mê du lịch",
  7: "Người dùng thường xuyên",
  8: "Khác",
};

const hobbyDescriptions = {
  0: "Nhiếp ảnh phong cảnh",
  1: "Nhiếp ảnh chân dung",
  2: "Nhiếp ảnh động vật hoang dã",
  3: "Nhiếp ảnh đường phố",
  4: "Nhiếp ảnh macro",
  5: "Nhiếp ảnh thể thao",
  6: "Khác",
};
const orderStatusMap = {
  0: { text: "Chờ xử lý", color: "blue", icon: "fa-hourglass-start" },
  1: {
    text: "Sản phẩm sẵn sàng được giao",
    color: "green",
    icon: "fa-check-circle",
  },
  2: { text: "Hoàn thành", color: "yellow", icon: "fa-clipboard-check" },
  3: { text: "Đã nhận sản phẩm", color: "purple", icon: "fa-shopping-cart" },
  4: { text: "Đã giao hàng", color: "cyan", icon: "fa-truck" },
  5: { text: "Thanh toán thất bại", color: "cyan", icon: "fa-money-bill-wave" },
  6: { text: "Đang hủy", color: "lime", icon: "fa-box-open" },
  7: { text: "Đã hủy thành công", color: "red", icon: "fa-times-circle" },
  8: { text: "Đã Thanh toán", color: "orange", icon: "fa-money-bill-wave" },
  9: { text: "Hoàn tiền đang chờ xử lý", color: "pink", icon: "fa-clock" },
  10: { text: "Hoàn tiền", color: "brown", icon: "fa-undo" },
  11: { text: "Hoàn trả tiền đặt cọc", color: "gold", icon: "fa-piggy-bank" },
};

const orderTypeMap = {
  0: { text: "Mua", color: "indigo", icon: "fa-shopping-bag" },
  1: { text: "Thuê", color: "green", icon: "fa-warehouse" },
};

const deliveryStatusMap = {
  0: { text: "Nhận tại cửa hàng", color: "blue", icon: "fa-store" }, // LPH: Lấy Phát Hàng
  1: { text: "Giao hàng tận nơi", color: "green", icon: "fa-truck" },
  2: { text: "Trả lại", color: "red", icon: "fa-undo" },
};

const PersonalInformation = () => {
  const { user } = useSelector((state) => state.user || {});
  const [orders, setOrders] = useState([]);
  const [isOrderDetail, setIsOrderDetail] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [dataDetai, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [categoryMap, setCategoryMap] = useState({});
  const [supplierMap, setSupplierMap] = useState({});

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
      const response = await getOrderDetailsById(id, 1, 100); // Adjust pageSize as needed
      if (response.isSuccess) {
        setData(response.result || []);
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
      fetchCategoryAndSupplierNames();
    }
  }, [dataDetai]);

  const fetchCategoryAndSupplierNames = async () => {
    const uniqueCategoryIDs = [
      ...new Set(dataDetai.map((detail) => detail.product.categoryID)),
    ].filter((id) => id);

    const uniqueSupplierIDs = [
      ...new Set(dataDetai.map((detail) => detail.product.supplierID)),
    ].filter((id) => id);

    try {
      const categoryPromises = uniqueCategoryIDs.map((id) =>
        getCategoryById(id)
      );
      const supplierPromises = uniqueSupplierIDs.map((id) =>
        getSupplierById(id, 1, 1)
      );

      const categories = await Promise.all(categoryPromises);
      const suppliers = await Promise.all(supplierPromises);

      const categoryDict = {};
      categories.forEach((res, index) => {
        const id = uniqueCategoryIDs[index];
        categoryDict[id] = res.isSuccess
          ? res.result?.categoryName || "Không xác định"
          : "Không xác định";
      });

      const supplierDict = {};
      suppliers.forEach((res, index) => {
        const id = uniqueSupplierIDs[index];
        supplierDict[id] =
          res && res.result && res.result.items.length > 0
            ? {
                supplierName: res.result.items[0].supplierName,
                supplierAddress:
                  res.result.items[0].supplierAddress || "Không xác định",
                supplierDescription:
                  res.result.items[0].supplierDescription || "Không xác định",
                contactNumber:
                  res.result.items[0].contactNumber || "Không xác định",
              }
            : {
                supplierName: "Không xác định",
                supplierAddress: "Không xác định",
                supplierDescription: "Không xác định",
                contactNumber: "Không xác định",
              };
      });

      setCategoryMap(categoryDict);
      setSupplierMap(supplierDict);
    } catch (error) {
      console.error("Error fetching category or supplier names:", error);
      message.error("Error fetching category or supplier names.");
    }
  };

  const handleClick = (order) => {
    setIsOrderDetail(true);

    fetchOrderDetails(order.orderID);
  };
  const StatusBadge = ({ status, map }) => {
    const statusInfo = map[status] || {
      text: "Thanh toán thất bại",
      color: "gray",
      icon: "fa-question-circle",
    };
    return (
      <span className="flex items-center space-x-1 px-2 py-1 text-xs font-semibold rounded-full bg-opacity-20">
        <i
          className={`fa-solid ${statusInfo.icon} text-${statusInfo.color}-500`}
        ></i>
        <span className={`text-${statusInfo.color}-700`}>
          {statusInfo.text}
        </span>
      </span>
    );
  };
  const handlePaymentAgain = async (orderId) => {
    try {
      setIsLoading(true);
      const data = await purchaseOrder(orderId);
      if (data.isSuccess && data.result) {
        window.location.href = data.result;
      } else {
        message.error("Failed to initiate payment.");
      }
    } catch (error) {
      message.error("Đã xảy ra lỗi, vui lòng thử lại sau");
    } finally {
      setIsLoading(false);
    }
  };
  const isWithin24Hours = (orderDate) => {
    const orderTime = new Date(orderDate).getTime();
    const currentTime = new Date().getTime();
    const timeDifference = currentTime - orderTime;
    return timeDifference <= 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  };
  const calculateRemainingTime = (orderDate) => {
    const orderTime = new Date(orderDate).getTime();
    const currentTime = new Date().getTime();
    const timeDifference = 24 * 60 * 60 * 1000 - (currentTime - orderTime);
    return timeDifference > 0 ? timeDifference : 0;
  };

  const formatTime = (milliseconds) => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const OrderCancelButton = ({ order }) => {
    const [remainingTime, setRemainingTime] = useState(
      calculateRemainingTime(order.orderDate)
    );

    useEffect(() => {
      const interval = setInterval(() => {
        setRemainingTime(calculateRemainingTime(order.orderDate));
      }, 1000);

      return () => clearInterval(interval);
    }, [order.orderDate]);

    return (
      (order.orderStatus === 0 || order.orderStatus === 8) &&
      isWithin24Hours(order.orderDate) && (
        <div className="flex justify-center items-center">
          <FontAwesomeIcon icon={faClock} className="mr-2" />
          <span className="mr-2">{formatTime(remainingTime)}</span>
          <button
            className="bg-red-500 text-white rounded-md py-2 px-4 my-2 flex items-center group"
            onClick={async (e) => {
              e.preventDefault();
              alert("Cancel Order Request clicked"); // Show alert
              console.log("Order:", order); // Log the order object
              if (!order.orderID) {
                console.error("Order ID is undefined");
                return;
              }
              try {
                const result = await cancelOrder(order.orderID);
                console.log("API Response:", result); // Log the API response
                if (result && result.isSuccess) {
                  console.log("Order canceled successfully:", result);
                  window.location.reload(); // Reload the page
                } else {
                  console.error("Failed to cancel order:", result.messages);
                }
              } catch (err) {
                console.error("Error canceling order:", err);
              }
            }}
          >
            <FontAwesomeIcon
              icon={faTimes}
              className="mr-2 group-hover:hidden"
            />
            <span className="hidden group-hover:inline">
              Yêu cầu hủy đơn hàng
            </span>
          </button>
        </div>
      )
    );
  };

  const renderOrderItems = (order) => (
    <tr
      key={order.orderID}
      className={
        order.orderStatus === 1 && order.deliveryMethod === 0
          ? "bg-yellow-100"
          : "cursor-pointer hover:bg-gray-50 transition-colors"
      }
      onClick={() => handleClick(order)}
    >
      <td className="py-3 px-4 border-b">{order.orderID}</td>
      <td className="py-3 px-4 border-b">
        <div>
          <strong>Tên nhà cung cấp:</strong>{" "}
          {supplierMap[order.supplierID]?.supplierName || " "}
        </div>
        <div>
          <strong>Địa chỉ:</strong>{" "}
          {supplierMap[order.supplierID]?.supplierAddress || " "}
        </div>
        <div>
          <strong>Mô tả:</strong>{" "}
          {supplierMap[order.supplierID]?.supplierDescription || " "}
        </div>
        <div>
          <strong>Số điện thoại liên hệ:</strong>{" "}
          {supplierMap[order.supplierID]?.contactNumber || ""}
        </div>
      </td>
      <td className="py-3 px-4 border-b">
        <StatusBadge status={order.orderStatus} map={orderStatusMap} />
      </td>
      <td className="py-3 px-4 border-b hidden md:table-cell">
        {order.shippingAddress}
      </td>
      <td className="py-3 px-4 border-b hidden lg:table-cell">
        <StatusBadge status={order.deliveriesMethod} map={deliveryStatusMap} />
      </td>
      <td className="py-3 px-4 border-b">
        <StatusBadge status={order.orderType} map={orderTypeMap} />
      </td>
      <td className="py-3 px-4 border-b hidden sm:table-cell">
        {formatDateTime(order.orderDate)}
      </td>
      <td className="py-3 px-4 border-b">{formatPrice(order.totalAmount)}</td>
      <td>
        {order.orderStatus === 0 && (
          <div className="flex justify-center">
            <button
              className="bg-primary text-white rounded-md py-2 px-4 my-2"
              onClick={(e) => {
                e.stopPropagation();
                handlePaymentAgain(order.orderID);
              }}
            >
              Thanh toán ngay
            </button>
          </div>
        )}
      </td>
      <td>
        <OrderCancelButton order={order} />
        {order.orderStatus === 1 &&
          order.deliveryMethod === 0 &&
          order.orderType === 0 && (
            <>
              <div style={{ color: "red", marginTop: "10px" }}>
                Vui lòng nhận sản phẩm tại cửa hàng trong vòng 3 ngày. Sau 3
                ngày, đơn hàng của bạn sẽ bị hủy.
              </div>
              <button
                className="bg-blue-500 text-white rounded-md py-2 px-4 my-2"
                onClick={async (e) => {
                  e.stopPropagation(); // Prevent triggering the row click event
                  await updateOrderStatusPlaced(order.orderID);
                }}
              >
                Nhận hàng
              </button>
            </>
          )}
        {order.orderStatus === 1 &&
          order.deliveryMethod === 0 &&
          order.orderType === 1 && (
            <>
              <div style={{ color: "red", marginTop: "10px" }}>
                Vui lòng đến trước 30 phút thời gian thuê để có thể nhận và kiểm
                tra sản phẩm.
              </div>
              <button
                className="bg-blue-500 text-white rounded-md py-2 px-4 my-2"
                onClick={async (e) => {
                  e.stopPropagation();
                  await updateOrderStatusPlaced(order.orderID);
                }}
              >
                Nhận hàng
              </button>
            </>
          )}
      </td>
      <td></td>
    </tr>
  );
  return (
    <div className="container mx-auto py-8 px-4">
      <LoadingComponent isLoading={isLoading} title="Loading data..." />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex items-center mb-6">
            <h2 className="text-2xl font-bold text-teal-600 flex items-center">
              <i className="fa-solid fa-user mr-2"></i> Thông tin cá nhân
            </h2>
            <button
              className="btn bg-primary text-white flex items-center"
              onClick={() => setIsUpdateModalOpen(true)}
            >
              <FontAwesomeIcon icon={faEdit} className="mr-2" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center">
              <i className="fa-solid fa-user mr-2 text-gray-600"></i>
              <span>
                <strong>Tên:</strong> {userMap.name}
              </span>
            </div>

            <div className="flex items-center">
              <i className="fa-solid fa-phone mr-2 text-gray-600"></i>
              <span>
                <strong>Điện thoại:</strong> {userMap.phone}
              </span>
            </div>
            <div className="flex items-center flex-wrap">
              <i className="fa-solid fa-envelope mr-2 text-gray-600"></i>
              <span className="break-words">
                <strong>Email:</strong> {userMap.email}
              </span>
            </div>

            <div className="flex items-center">
              <i className="fa-solid fa-briefcase mr-2 text-gray-600"></i>
              <span>
                <strong>Công việc:</strong> {jobDescriptions[userMap.job]}
              </span>
            </div>
            <div className="flex items-center">
              <i className="fa-solid fa-heart mr-2 text-gray-600"></i>
              <span>
                <strong>Sở thích:</strong> {hobbyDescriptions[userMap.hobby]}
              </span>
            </div>
            <div className="flex items-center">
              <i className="fa-solid fa-venus-mars mr-2 text-gray-600"></i>
              <span>
                <strong>Giới tính:</strong>{" "}
                {userMap.gender === 0 ? "Nam" : "Nữ"}
              </span>
            </div>
            <div className="flex items-center">
              <i className="fa-solid fa-university mr-2 text-gray-600"></i>
              <span>
                <strong>Ngân hàng:</strong> {userMap.bankName}
              </span>
            </div>
            <div className="flex items-center">
              <i className="fa-solid fa-credit-card mr-2 text-gray-600"></i>
              <span>
                <strong>Số tài khoản:</strong> {userMap.accountNumber}
              </span>
            </div>
            <div className="flex items-center">
              <i className="fa-solid fa-user-tie mr-2 text-gray-600"></i>
              <span>
                <strong>Chủ tài khoản:</strong> {userMap.accountHolder}
              </span>
            </div>
          </div>
        </div>

        {!isOrderDetail ? (
          <div className="lg:col-span-3 bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-bold text-teal-600 mb-6 text-center">
              Đơn hàng của bạn
            </h2>
            {orders.length === 0 ? (
              <p className="text-center text-gray-500">No orders found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-3 px-4 border-b">Mã đơn hàng</th>
                      <th className="py-3 px-4 border-b">Mã nhà cung cấp</th>
                      <th className="py-3 px-4 border-b">Trạng thái</th>
                      <th className="py-3 px-4 border-b hidden md:table-cell">
                        Địa chỉ giao hàng
                      </th>
                      <th className="py-3 px-4 border-b hidden lg:table-cell">
                        Phương thức giao hàng
                      </th>
                      <th className="py-3 px-4 border-b">Loại</th>
                      <th className="py-3 px-4 border-b hidden sm:table-cell">
                        Ngày đặt hàng
                      </th>
                      <th className="py-3 px-4 border-b">Tổng số tiền</th>
                      <th className="py-3 px-6 border-b"> </th>
                      <th className="py-3 px-6 border-b"> </th>
                      <th className="py-3 px-6 border-b"> </th>
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
              onClick={() => {
                setIsOrderDetail(false);
              }}
              className="text-teal-600 hover:text-teal-800 mb-4 flex items-center"
            >
              <i className="fa-solid fa-arrow-left mr-2"></i> Back
            </button>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-teal-600 text-center">
                THông tin chi tiết
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-3 px-4 border-b">Tên sản phẩm</th>
                      <th className="py-3 px-4 border-b">Giá</th>
                      <th className="py-3 px-4 border-b">Chất lượng</th>
                      <th className="py-3 px-4 border-b">Tổng giá</th>
                      <th className="py-3 px-4 border-b">Số seri</th>
                      <th className="py-3 px-4 border-b">Tên nhà cung cấp</th>
                      <th className="py-3 px-4 border-b">Tên danh mục</th>
                      <th className="py-3 px-4 border-b">Ngày tạo</th>
                      <th className="py-3 px-4 border-b">Ngày cập nhật</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataDetai.length > 0 ? (
                      dataDetai.map((orderdetails) => (
                        <tr
                          key={orderdetails.productID}
                          className="hover:bg-gray-50"
                        >
                          <td className="py-2 px-4 border-b">
                            {orderdetails.product.productName || "N/A"}
                          </td>
                          <td className="py-2 px-4 border-b">
                            {formatPrice(
                              orderdetails.product.priceBuy ||
                                orderdetails.productPrice
                            )}
                          </td>
                          <td className="py-2 px-4 border-b">
                            {orderdetails.product.quality}
                          </td>
                          <td className="py-2 px-4 border-b">
                            {formatPrice(orderdetails.productPriceTotal)}
                          </td>
                          <td className="py-2 px-4 border-b">
                            {orderdetails.product.serialNumber || "N/A"}
                          </td>
                          <td className="py-3 px-4 border-b">
                            <div>
                              <strong>Tên nhà cung cấp:</strong>{" "}
                              {supplierMap[orderdetails.product.supplierID]
                                ?.supplierName || " "}
                            </div>
                            <div>
                              <strong>Địa chỉ:</strong>{" "}
                              {supplierMap[orderdetails.product.supplierID]
                                ?.supplierAddress || " "}
                            </div>
                            <div>
                              <strong>Mô tả:</strong>{" "}
                              {supplierMap[orderdetails.product.supplierID]
                                ?.supplierDescription || " "}
                            </div>
                            <div>
                              <strong>Số điện thoại liên hệ:</strong>{" "}
                              {supplierMap[orderdetails.product.supplierID]
                                ?.contactNumber || ""}
                            </div>
                          </td>

                          <td className="py-2 px-4 border-b">
                            {categoryMap[orderdetails.product.categoryID] ||
                              "N/A"}
                          </td>
                          <td className="py-2 px-4 border-b">
                            {formatDateTime(orderdetails.product.createdAt)}
                          </td>
                          <td className="py-2 px-4 border-b">
                            {formatDateTime(orderdetails.product.updatedAt)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="9" className="text-center py-4">
                          No products found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
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
