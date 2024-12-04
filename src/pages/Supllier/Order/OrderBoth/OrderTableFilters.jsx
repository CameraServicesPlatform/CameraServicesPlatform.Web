import { ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Input, Select } from "antd";
import React, { useRef, useState } from "react";
import { orderStatusMap, orderTypeMap } from "./OrderStatusMaps";

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

export default OrderTableFilters;
