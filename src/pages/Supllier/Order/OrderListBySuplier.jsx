import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { message, Spin } from "antd";
import { getSupplierIdByAccountId } from "../../../api/accountApi";
import { getOrderOfSupplierId } from "../../../api/orderApi";
import OrderBothTable from "./OrderBoth/OrderBothTable";
import OrderBothModals from "./OrderBoth/OrderBothModals";

const OrderListBySupplier = ({ refresh }) => {
  const user = useSelector((state) => state.user.user || {});
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [supplierId, setSupplierId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isTrackingModalVisible, setIsTrackingModalVisible] = useState(false);
  const [contractModalVisible, setContractModalVisible] = useState(false);

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
          const data = await getOrderOfSupplierId(supplierId, pageIndex, pageSize);
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

  if (loading) {
    return <Spin />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <OrderBothTable
        orders={orders}
        pageIndex={pageIndex}
        pageSize={pageSize}
        setPageIndex={setPageIndex}
        setPageSize={setPageSize}
        setSelectedOrder={setSelectedOrder}
        setIsTrackingModalVisible={setIsTrackingModalVisible}
        setContractModalVisible={setContractModalVisible}
      />
      <OrderBothModals
        selectedOrder={selectedOrder}
        isTrackingModalVisible={isTrackingModalVisible}
        contractModalVisible={contractModalVisible}
        handleCloseTrackingModal={() => setIsTrackingModalVisible(false)}
        handleCloseContractModal={() => setContractModalVisible(false)}
        handleUpdateOrderStatus={handleUpdateOrderStatus}
      />
    </>
  );
};

export default OrderListBySupplier;