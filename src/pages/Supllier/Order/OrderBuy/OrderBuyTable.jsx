import { ReloadOutlined } from "@ant-design/icons";
import { Button, Input, Select, Table } from "antd";
import React, { useRef, useState } from "react";
import { orderStatusMap, orderTypeMap } from "../OrderBoth/OrderStatusMaps";

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

const OrderTable = ({
  orders,
  columns,
  pageIndex,
  pageSize,
  setPageIndex,
  setPageSize,
  handleOpenTrackingModal,
  handleOpenContractModal,
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

export default OrderTable;
