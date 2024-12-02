import React from "react";
import { Table, Tag, Button } from "antd";
import moment from "moment";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";

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

export default OrderTable;
