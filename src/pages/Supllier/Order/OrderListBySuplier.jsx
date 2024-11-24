import { SearchOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Input,
  message,
  Modal,
  Spin,
  Table,
  Tag,
} from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import Highlighter from "react-highlight-words";
import { useSelector } from "react-redux";
import { getSupplierIdByAccountId } from "../../../api/accountApi";
import { getOrderOfSupplierId } from "../../../api/orderApi";
import ContractOrder from "../Contract/ContractOrder";
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
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [trackingModalVisible, setTrackingModalVisible] = useState(false);
  const [contractModalVisible, setContractModalVisible] = useState(false);

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
   5: {
     text: "Thanh toán thất bại",
     color: "cyan",
     icon: "fa-money-bill-wave",
   },
   6: { text: "Đang hủy", color: "lime", icon: "fa-box-open" },
   7: { text: "Đã hủy thành công", color: "red", icon: "fa-times-circle" },
   8: { text: "Đã Thanh toán", color: "orange", icon: "fa-money-bill-wave" },
   9: { text: "Hoàn tiền đang chờ xử lý", color: "pink", icon: "fa-clock" },
   10: { text: "Hoàn tiền", color: "brown", icon: "fa-undo" },
   11: { text: "Hoàn trả tiền đặt cọc", color: "gold", icon: "fa-piggy-bank" },
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

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Button
          type="primary"
          onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button
          onClick={() => handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => document.getElementById("search-input").select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const getColumnDateSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <DatePicker
          onChange={(date, dateString) =>
            setSelectedKeys(dateString ? [dateString] : [])
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Button
          type="primary"
          onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button
          onClick={() => handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? moment(record[dataIndex]).format("DD-MM-YYYY") === value
        : "",
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
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
      ...getColumnSearchProps("orderID"),
    },
    {
      title: "Mã tài khoản",
      dataIndex: "accountID",
      key: "accountID",
      sorter: (a, b) => a.accountID.localeCompare(b.accountID),
      ...getColumnSearchProps("accountID"),
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
        title="Theo dõi đơn hàng"
        open={isTrackingModalVisible}
        onCancel={handleCloseTrackingModal}
        footer={null}
        width="80%" // Adjust the width as needed
        style={{ top: 20 }} // Adjust the top position if needed
        styles={{ body: { maxHeight: "80vh", overflowY: "auto" } }}
      >
        {selectedOrder && (
          <TrackingOrder
            order={selectedOrder}
            onUpdate={handleUpdateOrderStatus}
          />
        )}
      </Modal>
      <Modal
        title="Hợp đồng"
        visible={contractModalVisible}
        onCancel={handleCloseContractModal}
        footer={null}
        width={800}
      >
        {selectedOrder && <ContractOrder orderID={selectedOrder.orderID} />}
      </Modal>
    </>
  );
};

export default OrderListBySupplier;
