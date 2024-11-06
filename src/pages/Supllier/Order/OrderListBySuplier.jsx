import { Button, message, Modal, Spin, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getSupplierIdByAccountId } from "../../../api/accountApi";
import { getOrderOfSupplierId } from "../../../api/orderApi";
import TrackingOrder from "./TrackingOrder";

const OrderListBySupplier = ({ refresh }) => {
  const user = useSelector((state) => state.user.user || {});
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [supplierId, setSupplierId] = useState(null);
  const [isTrackingModalVisible, setIsTrackingModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const orderStatusMap = {
    0: "Chờ xử lý",
    1: "Đã phê duyệt",
    2: "Hoàn thành",
    3: "Đã đặt",
    4: "Đã giao hàng",
    5: "Đã nhận",
    6: "Đã hủy",
    7: "Thanh toán",
  };

  const orderTypeMap = {
    0: "Mua",
    1: "Thuê",
  };

  const deliveryStatusMap = {
    0: "Đến cửa hàng lấy hàng",
    1: "Cửa hàng giao hàng",
    2: "Đã trả lại",
  };

  // Lấy ID Nhà cung cấp
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

  // Lấy đơn hàng
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
            setOrders(data.result || []);
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

  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "orderID",
      key: "orderID",
    },
    {
      title: "Mã tài khoản",
      dataIndex: "accountID",
      key: "accountID",
    },
    {
      title: "Ngày đặt hàng",
      dataIndex: "orderDate",
      key: "orderDate",
    },
    {
      title: "Trạng thái đơn hàng",
      dataIndex: "orderStatus",
      key: "orderStatus",
      render: (status) => orderStatusMap[status],
    },
    {
      title: "Tổng số tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
    },
    {
      title: "Loại đơn hàng",
      dataIndex: "orderType",
      key: "orderType",
      render: (type) => orderTypeMap[type],
    },
    {
      title: "Địa chỉ giao hàng",
      dataIndex: "shippingAddress",
      key: "shippingAddress",
    },
    {
      title: "Phương thức giao hàng",
      dataIndex: "deliveryMethod",
      key: "deliveryMethod",
      render: (status) => deliveryStatusMap[status],
    },
    {
      title: "Hành động",
      key: "actions",
      render: (text, record) => (
        <Button type="primary" onClick={() => handleOpenTrackingModal(record)}>
          Tracking Order
        </Button>
      ),
    },
  ];

  if (loading) {
    return <Spin tip="Đang tải đơn hàng..." />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <Table
        dataSource={orders}
        columns={columns}
        rowKey="orderID"
        pagination={{
          current: pageIndex,
          pageSize: pageSize,
          total: orders.length,
          onChange: (page, pageSize) => {
            setPageIndex(page);
            setPageSize(pageSize);
          },
        }}
      />
      <Modal
        title="Tracking Order"
        visible={isTrackingModalVisible}
        onCancel={handleCloseTrackingModal}
        footer={null}
      >
        {selectedOrder && (
          <TrackingOrder
            order={selectedOrder}
            onUpdate={handleUpdateOrderStatus}
          />
        )}
      </Modal>
    </>
  );
};

export default OrderListBySupplier;
