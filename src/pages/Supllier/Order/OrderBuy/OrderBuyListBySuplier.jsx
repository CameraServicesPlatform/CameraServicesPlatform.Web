import { Button, message, Spin, Tag } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  getSupplierIdByAccountId,
  getUserById,
} from "../../../../api/accountApi";
import { getOrderOfSupplierId } from "../../../../api/orderApi";
import ContractModal from "./ContractModal";
import OrderTable from "./OrderBuyTable";
import TrackingModal from "./TrackingModal";
import { getColumnSearchProps } from "./utils";

const OrderBuyListBySuplier = ({ refresh }) => {
  const user = useSelector((state) => state.user.user || {});
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [supplierId, setSupplierId] = useState(null);
  const [isTrackingModalVisible, setIsTrackingModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [contractModalVisible, setContractModalVisible] = useState(false);

  const orderStatusMap = {
    0: { text: "Chờ xử lý", color: "blue" },
    1: { text: "Sản phẩm sẵn sàng được giao", color: "green" },
    2: { text: "Hoàn thành", color: "yellow" },
    3: { text: "Đã nhận sản phẩm", color: "purple" },
    4: { text: "Đã giao hàng", color: "cyan" },
    5: { text: "Thanh toán thất bại", color: "cyan" },
    6: { text: "Đang hủy", color: "lime" },
    7: { text: "Đã hủy thành công", color: "red" },
    8: { text: "Đã Thanh toán", color: "orange" },
    9: { text: "Hoàn tiền đang chờ xử lý", color: "pink" },
    10: { text: "Hoàn tiền thành công ", color: "brown" },
    11: { text: "Hoàn trả tiền đặt cọc", color: "gold" },
    12: { text: "Gia hạn", color: "violet" },
  };

  const orderTypeMap = {
    0: { text: "Mua", color: "blue" },
    1: { text: "Thuê", color: "green" },
  };

  const deliveryStatusMap = {
    0: { text: "Đến cửa hàng lấy hàng", color: "blue" },
    1: { text: "Cửa hàng giao hàng", color: "green" },
    2: { text: "Đã trả lại", color: "red" },
  };

  useEffect(() => {
    const fetchSupplierId = async () => {
      if (user.id) {
        try {
          const response = await getSupplierIdByAccountId(user.id);
          if (response?.isSuccess) {
            setSupplierId(response.result);
          } else {
            message.error("Lấy ID Nhà cung cấp không thành công.");
          }
        } catch (error) {
          message.error("Lỗi khi lấy ID Nhà cung cấp.");
        }
      }
    };
    fetchSupplierId();
  }, [user.id]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (supplierId) {
        setLoading(true);
        try {
          const data = await getOrderOfSupplierId(
            supplierId,
            pageIndex,
            pageSize
          );
          if (data?.isSuccess) {
            const filteredOrders = data.result.filter(
              (order) => order.orderType === 0
            );

            // Fetch account names and include them in the orders
            const ordersWithAccountNames = await Promise.all(
              filteredOrders.map(async (order) => {
                const accountData = await getUserById(order.accountID);
                if (accountData?.isSuccess) {
                  return {
                    ...order,
                    accountName: `${accountData.result.firstName} ${accountData.result.lastName}`,
                  };
                }
                return order;
              })
            );

            setOrders(ordersWithAccountNames || []);
          } else {
            message.error("Lấy đơn hàng không thành công.");
          }
        } catch (err) {
          setError("Lỗi khi lấy đơn hàng.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchOrders();
  }, [refresh, supplierId, pageIndex, pageSize]);

  const handleUpdateOrderStatus = (orderId, status) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.orderID === orderId ? { ...order, orderStatus: status } : order
      )
    );
  };

  const handleOpenTrackingModal = (order) => {
    setSelectedOrder(order);
    setIsTrackingModalVisible(true);
  };

  const handleCloseTrackingModal = () => {
    setIsTrackingModalVisible(false);
    setSelectedOrder(null);
  };

  const handleOpenContractModal = (record) => {
    setSelectedOrder(record);
    setContractModalVisible(true);
  };

  const handleCloseContractModal = () => {
    setContractModalVisible(false);
    setSelectedOrder(null);
  };

  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "orderID",
      key: "orderID",
      sorter: (a, b) => a.orderID.localeCompare(b.orderID),
      ...getColumnSearchProps(
        "orderID",
        searchText,
        setSearchText,
        searchedColumn,
        setSearchedColumn
      ),
    },
    {
      title: "Tên tài khoản",
      dataIndex: "accountName",
      key: "accountName",
      sorter: (a, b) => a.accountName.localeCompare(b.accountName),
    },
    {
      title: "Ngày đặt hàng",
      dataIndex: "orderDate",
      key: "orderDate",
      sorter: (a, b) => new Date(a.orderDate) - new Date(b.orderDate),
      render: (date) => moment(date).format("DD/MM/YYYY HH:mm:ss"),
    },
    {
      title: "Trạng thái đơn hàng",
      dataIndex: "orderStatus",
      key: "orderStatus",
      render: (status) => {
        const statusInfo = orderStatusMap[status];
        return statusInfo ? (
          <Tag color={statusInfo.color}>{statusInfo.text}</Tag>
        ) : null;
      },
      sorter: (a, b) => a.orderStatus - b.orderStatus,
    },
    {
      title: "Tổng số tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      sorter: (a, b) => a.totalAmount - b.totalAmount,
      render: (text) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(text),
    },
    {
      title: "Loại đơn hàng",
      dataIndex: "orderType",
      key: "orderType",
      render: (type) => {
        const typeInfo = orderTypeMap[type];
        return typeInfo ? (
          <Tag color={typeInfo.color}>{typeInfo.text}</Tag>
        ) : null;
      },
      sorter: (a, b) => a.orderType - b.orderType,
    },
    {
      title: "Địa chỉ giao hàng",
      dataIndex: "shippingAddress",
      key: "shippingAddress",
      sorter: (a, b) => a.shippingAddress.localeCompare(b.shippingAddress),
    },
    {
      title: "Phương thức giao hàng",
      dataIndex: "deliveriesMethod",
      key: "deliveriesMethod",
      render: (status) => {
        const deliveryInfo = deliveryStatusMap[status];
        return deliveryInfo ? (
          <Tag color={deliveryInfo.color}>{deliveryInfo.text}</Tag>
        ) : null;
      },
      sorter: (a, b) => a.deliveriesMethod - b.deliveriesMethod,
    },
    {
      title: "Hành động",
      key: "actions",
      render: (text, record) => (
        <>
          <Button
            type="primary"
            onClick={() => handleOpenTrackingModal(record)}
          >
            Theo dõi đơn hàng
          </Button>
          {record.orderType === 1 && (
            <Button
              type="default"
              onClick={() => handleOpenContractModal(record)}
              style={{ marginLeft: 8 }}
            >
              Hợp đồng
            </Button>
          )}
        </>
      ),
    },
  ];

  if (loading) {
    return <Spin />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <OrderTable
        orders={orders}
        columns={columns}
        pageIndex={pageIndex}
        pageSize={pageSize}
        setPageIndex={setPageIndex}
        setPageSize={setPageSize}
        handleOpenTrackingModal={handleOpenTrackingModal}
        handleOpenContractModal={handleOpenContractModal}
      />
      <TrackingModal
        isVisible={isTrackingModalVisible}
        order={selectedOrder}
        handleClose={handleCloseTrackingModal}
        handleUpdateOrderStatus={handleUpdateOrderStatus}
      />
      <ContractModal
        isVisible={contractModalVisible}
        order={selectedOrder}
        handleClose={handleCloseContractModal}
      />
    </>
  );
};

export default OrderBuyListBySuplier;
