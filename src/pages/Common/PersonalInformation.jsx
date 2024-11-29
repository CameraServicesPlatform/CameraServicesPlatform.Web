import { message } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "tailwindcss/tailwind.css";
import { getCategoryById } from "../../api/categoryApi";
import {
  getImageProductAfterByOrderId,
  getImageProductBeforeByOrderId,
  getOrderDetailsById,
  getOrdersByAccount,
  purchaseOrder,
  updateOrderStatusPlaced,
} from "../../api/orderApi";
import { getSupplierById } from "../../api/supplierApi";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
import PersonalModal from "./Account/PersonalModal";
import ImageUploadPopup from "./ImageUploadPopup";
import OrderDetails from "./manageinfo/OrderDetails";
import OrderList from "./manageinfo/OrderList";
import UserInfo from "./manageinfo/UserInfo";

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
  10: { text: "Hoàn tiền thành công ", color: "brown", icon: "fa-undo" },
  11: { text: "Hoàn trả tiền đặt cọc", color: "gold", icon: "fa-piggy-bank" },
  12: { text: "Gia hạn", color: "violet", icon: "fa-calendar-plus" },
};

const orderTypeMap = {
  0: { text: "Mua", color: "indigo", icon: "fa-shopping-bag" },
  1: { text: "Thuê", color: "green", icon: "fa-warehouse" },
};

const deliveryStatusMap = {
  0: { text: "Nhận tại cửa hàng", color: "blue", icon: "fa-store" },
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
  const [isUploadPopupOpen, setIsUploadPopupOpen] = useState(false);
  const [uploadType, setUploadType] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [beforeImage, setBeforeImage] = useState(null);
  const [afterImage, setAfterImage] = useState(null);

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
        const beforeImageResponse = await getImageProductBeforeByOrderId(id);
        const afterImageResponse = await getImageProductAfterByOrderId(id);
        setBeforeImage(beforeImageResponse.result);
        setAfterImage(afterImageResponse.result);
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

  const openUploadPopup = (orderId, type) => {
    setSelectedOrderId(orderId);
    setUploadType(type);
    setIsUploadPopupOpen(true);
  };

  const closeUploadPopup = () => {
    setIsUploadPopupOpen(false);
    setUploadType(null);
    setSelectedOrderId(null);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <LoadingComponent isLoading={isLoading} title="Loading data..." />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <UserInfo
          userMap={userMap}
          jobDescriptions={jobDescriptions}
          hobbyDescriptions={hobbyDescriptions}
          setIsUpdateModalOpen={setIsUpdateModalOpen}
        />
        {!isOrderDetail ? (
          <OrderList
            orders={orders}
            supplierMap={supplierMap}
            orderStatusMap={orderStatusMap}
            deliveryStatusMap={deliveryStatusMap}
            orderTypeMap={orderTypeMap}
            handleClick={handleClick}
            handlePaymentAgain={handlePaymentAgain}
            updateOrderStatusPlaced={updateOrderStatusPlaced}
            openUploadPopup={openUploadPopup}
          />
        ) : (
          <OrderDetails
            dataDetai={dataDetai}
            supplierMap={supplierMap}
            categoryMap={categoryMap}
            beforeImage={beforeImage}
            afterImage={afterImage}
            setIsOrderDetail={setIsOrderDetail}
          />
        )}
        {isUpdateModalOpen && (
          <PersonalModal onClose={() => setIsUpdateModalOpen(false)} />
        )}
        {isUploadPopupOpen && (
          <ImageUploadPopup
            orderId={selectedOrderId}
            type={uploadType}
            onClose={closeUploadPopup}
          />
        )}
      </div>
    </div>
  );
};

export default PersonalInformation;
