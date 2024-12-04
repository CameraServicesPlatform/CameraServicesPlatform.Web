import { ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Input, Select, Table, Tag } from "antd";
import moment from "moment";
import React, { useRef, useState } from "react";
import {
  deliveryStatusMap,
  orderStatusMap,
  orderTypeMap,
} from "../OrderBoth/OrderStatusMaps";

const { Option } = Select;

const OrderTableFilters = ({ onSearch, onReset, onFilter }) => {
  const [searchText, setSearchText] = useState("");
  const [orderStatus, setOrderStatus] = useState(null);
  const [orderType, setOrderType] = useState(null);
  const searchInput = useRef(null);

  const handleSearch = () => {
    onSearch(searchText);
  };

  const handleReset = () => {
    setSearchText("");
    setOrderStatus(null);
    setOrderType(null);
    onReset();
  };

  const handleOrderStatusChange = (value) => {
    setOrderStatus(value);
    onFilter({ orderStatus: value, orderType });
  };

  const handleOrderTypeChange = (value) => {
    setOrderType(value);
    onFilter({ orderStatus, orderType: value });
  };

  return (
    <div
      style={{
        marginBottom: 16,
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <Input
        ref={searchInput}
        placeholder="Tìm kiếm tên tài khoản"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        onPressEnter={handleSearch}
        style={{ width: 200, marginRight: 8, marginBottom: 8 }}
      />
      <Button
        type="primary"
        onClick={handleSearch}
        icon={<SearchOutlined />}
        style={{ marginRight: 8, marginBottom: 8 }}
      >
        Tìm kiếm
      </Button>
      <Button
        onClick={handleReset}
        icon={<ReloadOutlined />}
        style={{ marginRight: 8, marginBottom: 8 }}
      >
        Đặt lại
      </Button>
      <Select
        placeholder="Trạng thái đơn hàng"
        value={orderStatus}
        onChange={handleOrderStatusChange}
        style={{ width: 200, marginRight: 8, marginBottom: 8 }}
      >
        {Object.keys(orderStatusMap).map((key) => (
          <Option key={key} value={parseInt(key)}>
            {orderStatusMap[key].text}
          </Option>
        ))}
      </Select>
      <Select
        placeholder="Loại đơn hàng"
        value={orderType}
        onChange={handleOrderTypeChange}
        style={{ width: 200, marginRight: 8, marginBottom: 8 }}
      >
        {Object.keys(orderTypeMap).map((key) => (
          <Option key={key} value={parseInt(key)}>
            {orderTypeMap[key].text}
          </Option>
        ))}
      </Select>
    </div>
  );
};

const OrderRentTable = ({
  orders,
  pageIndex,
  pageSize,
  setPageIndex,
  setPageSize,
  setSelectedOrder,
  setIsTrackingModalVisible,
  setContractModalVisible,
}) => {
  const [filteredOrders, setFilteredOrders] = useState(orders);

  const handleSearch = (searchText) => {
    const filtered = orders.filter((order) =>
      order.accountName.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredOrders(filtered);
  };

  const handleReset = () => {
    setFilteredOrders(orders);
  };

  const handleFilter = ({ orderStatus, orderType }) => {
    let filtered = orders;
    if (orderStatus !== null) {
      filtered = filtered.filter((order) => order.orderStatus === orderStatus);
    }
    if (orderType !== null) {
      filtered = filtered.filter((order) => order.orderType === orderType);
    }
    setFilteredOrders(filtered);
  };

  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "orderID",
      key: "orderID",
      sorter: (a, b) => a.orderID.localeCompare(b.orderID),
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
            onClick={() => {
              setSelectedOrder(record);
              setIsTrackingModalVisible(true);
            }}
          >
            Theo dõi đơn hàng
          </Button>
          {record.orderType === 1 && (
            <Button
              type="default"
              onClick={() => {
                setSelectedOrder(record);
                setContractModalVisible(true);
              }}
              style={{ marginLeft: 8 }}
            >
              Hợp đồng
            </Button>
          )}
        </>
      ),
    },
  ];

  return (
    <>
      <OrderTableFilters
        onSearch={handleSearch}
        onReset={handleReset}
        onFilter={handleFilter}
      />
      <Table
        dataSource={filteredOrders}
        columns={columns}
        rowKey="orderID"
        pagination={{
          current: pageIndex,
          pageSize: pageSize,
          total: filteredOrders.length,
          onChange: (page, pageSize) => {
            setPageIndex(page);
            setPageSize(pageSize);
          },
        }}
      />
    </>
  );
};

export default OrderRentTable;
