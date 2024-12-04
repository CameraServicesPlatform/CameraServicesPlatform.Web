import { message, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  getSupplierIdByAccountId,
  getUserById,
} from "../../../../api/accountApi";
import { getOrderOfSupplierId } from "../../../../api/orderApi";
import ContractModal from "./ContractModal";
import OrderRentTable from "./OrderRentTable";
import TrackingModal from "./TrackingRentModal";

const OrderRentListBySuplier = ({ refresh }) => {
  const user = useSelector((state) => state.user.user || {});
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [supplierId, setSupplierId] = useState(null);
  const [isTrackingModalVisible, setIsTrackingModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [contractModalVisible, setContractModalVisible] = useState(false);
  const [accountNames, setAccountNames] = useState({});

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
              (order) => order.orderType === 1
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

  if (loading) {
    return <Spin />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <OrderRentTable
        orders={orders}
        accountNames={accountNames}
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

export default OrderRentListBySuplier;
