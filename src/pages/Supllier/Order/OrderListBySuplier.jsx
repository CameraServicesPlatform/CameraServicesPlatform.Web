import {
  CarOutlined,
  CheckCircleOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { Button, message, Modal, Spin, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getSupplierIdByAccountId } from "../../../api/accountApi";
import {
  cancelOrder,
  getOrderOfSupplierId,
  updateOrderStatusApproved,
  updateOrderStatusCompleted,
  updateOrderStatusShipped,
} from "../../../api/orderApi";

const OrderListBySupplier = ({ refresh }) => {
  const user = useSelector((state) => state.user.user || {});
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [supplierId, setSupplierId] = useState(null);

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

  const handleCompleteOrder = async (orderId) => {
    try {
      const response = await updateOrderStatusCompleted(orderId);
      if (response?.isSuccess) {
        message.success("Đơn hàng đã được hoàn thành!");
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.orderID === orderId ? { ...order, orderStatus: 2 } : order
          )
        );
      } else {
        message.error("Không thể hoàn thành đơn hàng.");
      }
    } catch (error) {
      message.error("Lỗi khi hoàn thành đơn hàng.");
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      const response = await cancelOrder(orderId);
      if (response?.isSuccess) {
        message.success("Đơn hàng đã được hủy!");
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.orderID === orderId ? { ...order, orderStatus: 6 } : order
          )
        );
      } else {
        message.error("Không thể hủy đơn hàng.");
      }
    } catch (error) {
      message.error("Lỗi khi hủy đơn hàng.");
    }
  };

  const handleShipOrder = async (orderId) => {
    try {
      const response = await updateOrderStatusShipped(orderId);
      if (response?.isSuccess) {
        message.success("Đơn hàng đã được giao!");
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.orderID === orderId ? { ...order, orderStatus: 4 } : order
          )
        );
      } else {
        message.error("Không thể giao đơn hàng.");
      }
    } catch (error) {
      message.error("Lỗi khi giao đơn hàng.");
    }
  };

  const handleApproveOrder = async (orderId) => {
    try {
      const response = await updateOrderStatusApproved(orderId);
      if (response?.isSuccess) {
        message.success("Đơn hàng đã được phê duyệt!");
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.orderID === orderId ? { ...order, orderStatus: 1 } : order
          )
        );
      } else {
        message.error("Không thể phê duyệt đơn hàng.");
      }
    } catch (error) {
      message.error("Lỗi khi phê duyệt đơn hàng.");
    }
  };

  const showConfirm = (action, orderId) => {
    Modal.confirm({
      title: "Bạn có chắc chắn?",
      content: `Bạn có muốn ${action} đơn hàng này không?`,
      onOk() {
        switch (action) {
          case "complete":
            handleCompleteOrder(orderId);
            break;
          case "cancel":
            handleCancelOrder(orderId);
            break;
          case "ship":
            handleShipOrder(orderId);
            break;
          case "approve":
            handleApproveOrder(orderId);
            break;
          default:
            break;
        }
      },
    });
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
        <div>
          {record.orderStatus === 0 && (
            <>
              <Button
                type="primary"
                onClick={() => showConfirm("approve", record.orderID)}
                className="ml-2"
                icon={<CheckOutlined />}
              >
                Phê duyệt
              </Button>
              <Button
                type="danger"
                onClick={() => showConfirm("cancel", record.orderID)}
                className="ml-2"
                icon={<CloseOutlined />}
              >
                Hủy
              </Button>
            </>
          )}
          {record.orderStatus === 7 && (
            <Button
              type="primary"
              onClick={() => showConfirm("approve", record.orderID)}
              className="ml-2"
              icon={<CheckOutlined />}
            >
              Phê duyệt
            </Button>
          )}
          {record.orderStatus === 1 && (
            <Button
              type="default"
              onClick={() => showConfirm("ship", record.orderID)}
              className="ml-2"
              icon={<CarOutlined />}
            >
              Giao hàng
            </Button>
          )}
          {record.orderStatus !== 2 && record.orderStatus !== 6 && (
            <Button
              type="primary"
              onClick={() => showConfirm("complete", record.orderID)}
              className="ml-2"
              icon={<CheckCircleOutlined />}
            >
              Hoàn thành
            </Button>
          )}
        </div>
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
  );
};

export default OrderListBySupplier;
