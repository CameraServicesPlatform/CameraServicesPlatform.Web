import { message } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "tailwindcss/tailwind.css";
import { getCategoryById } from "../../api/categoryApi";
import {
  getOrderDetailsById,
  getOrdersByAccount,
  purchaseOrder,
} from "../../api/orderApi";
import { getSupplierById } from "../../api/supplierApi";
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

const orderStatusMap = {
  0: { text: "Chờ xử lý", color: "blue", icon: "fa-hourglass-start" },
  1: { text: "Đã phê duyệt", color: "green", icon: "fa-check-circle" },
  2: { text: "Hoàn thành", color: "yellow", icon: "fa-clipboard-check" },
  3: { text: "Đã đặt", color: "purple", icon: "fa-shopping-cart" },
  4: { text: "Đã giao hàng", color: "cyan", icon: "fa-truck" },
  5: { text: "Đã nhận", color: "lime", icon: "fa-box-open" },
  6: { text: "Đã hủy", color: "red", icon: "fa-times-circle" },
  7: { text: "Đã Thanh toán", color: "orange", icon: "fa-money-bill-wave" },
};

const orderTypeMap = {
  0: { text: "Mua", color: "indigo", icon: "fa-shopping-bag" },
  1: { text: "Thuê", color: "green", icon: "fa-warehouse" },
};

const deliveryStatusMap = {
  0: { text: "Nhận tại cửa hàng", color: "blue", icon: "fa-store" }, // LPH: Lấy Phát Hàng
  1: { text: "Giao hàng", color: "green", icon: "fa-truck" },
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
    ].filter((id) => id); // Filter out null or undefined

    const uniqueSupplierIDs = [
      ...new Set(dataDetai.map((detail) => detail.product.supplierID)),
    ].filter((id) => id); // Filter out null or undefined

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
            ? res.result.items[0].supplierName
            : "Không xác định";
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
  const renderOrderItems = (order) => (
    <tr
      key={order.orderID}
      className="cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={() => handleClick(order)}
    >
      <td className="py-3 px-4 border-b">{order.orderID}</td>
      <td className="py-3 px-4 border-b">{supplierMap[order.supplierID]}</td>
      <td className="py-3 px-4 border-b">
        <StatusBadge status={order.orderStatus} map={orderStatusMap} />
      </td>
      <td className="py-3 px-4 border-b">{order.shippingAddress}</td>
      <td className="py-3 px-4 border-b">
        <StatusBadge status={order.deliveryMethod} map={deliveryStatusMap} />
      </td>
      <td className="py-3 px-4 border-b">
        <StatusBadge status={order.orderType} map={orderTypeMap} />
      </td>
      <td className="py-3 px-4 border-b">{formatDateTime(order.orderDate)}</td>
      <td className="py-3 px-4 border-b">{formatPrice(order.totalAmount)}</td>
      <td>
        {" "}
        {order.orderStatus === 0 && (
          <div className="flex justify-center">
            <button
              className="bg-primary text-white rounded-md py-2 px-4 my-2"
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering the row click event
                handlePaymentAgain(order.orderID);
              }}
            >
              Thanh toán ngay
            </button>
          </div>
        )}
      </td>
    </tr>
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <LoadingComponent isLoading={isLoading} title="Loading data..." />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-teal-600 flex items-center">
              <i className="fa-solid fa-user mr-2"></i> Thông tin cá nhân
            </h2>
            <button
              onClick={() => setIsUpdateModalOpen(true)}
              className="text-teal-600 hover:text-teal-800 focus:outline-none"
            >
              <i className="fa-solid fa-pen"></i>
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center">
              <i className="fa-solid fa-user mr-2 text-gray-600"></i>
              <span>
                <strong>Họ và tên:</strong> {userMap.name}
              </span>
            </div>

            <div className="flex items-center">
              <i className="fa-solid fa-phone mr-2 text-gray-600"></i>
              <span>
                <strong>SDT:</strong> {userMap.phone}
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
                <strong>Ngành nghề:</strong> {jobDescriptions[userMap.job]}
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
          </div>
        </div>

        {!isOrderDetail ? (
          <div className="lg:col-span-3 bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-bold text-teal-600 mb-6 text-center">
              Đơn hàng
            </h2>
            {orders.length === 0 ? (
              <p className="text-center text-gray-500">
                Không tìm thấy đơn hàng nào.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-3 px-4 border-b">Mã đơn hàng</th>
                      <th className="py-3 px-4 border-b">Mã nhà cung cấp</th>
                      <th className="py-3 px-4 border-b">Trạng thái</th>
                      <th className="py-3 px-4 border-b">Địa chỉ giao hàng</th>
                      <th className="py-3 px-4 border-b">
                        Phương thức giao hàng
                      </th>
                      <th className="py-3 px-4 border-b">Loại hình</th>
                      <th className="py-3 px-4 border-b">Thời gian đặt hàng</th>
                      <th className="py-3 px-4 border-b">Tổng tiền</th>
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
              className="text-teal-600 hover:text-teal-800 mb-4 flex items-center"
            >
              <i className="fa-solid fa-arrow-left mr-2"></i> Quay lại
            </button>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-teal-600 text-center">
                Chi tiết đơn hàng
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-3 px-4 border-b">Tên sản phẩm</th>
                      <th className="py-3 px-4 border-b">Giá</th>
                      <th className="py-3 px-4 border-b">Chất lượng</th>
                      <th className="py-3 px-4 border-b">Tổng giá</th>
                      <th className="py-3 px-4 border-b">Serial Number</th>
                      <th className="py-3 px-4 border-b">Supplier Name</th>
                      <th className="py-3 px-4 border-b">Category Name</th>
                      <th className="py-3 px-4 border-b">Created At</th>
                      <th className="py-3 px-4 border-b">Updated At</th>
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
                            {formatPrice(orderdetails.product.priceBuy)}
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
                          <td className="py-2 px-4 border-b">
                            {supplierMap[orderdetails.product.supplierID] ||
                              "N/A"}
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
                          Không có sản phẩm nào
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
