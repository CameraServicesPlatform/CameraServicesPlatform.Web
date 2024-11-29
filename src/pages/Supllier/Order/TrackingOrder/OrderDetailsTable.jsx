import React from "react";
import { Table } from "antd";
import moment from "moment";

const OrderDetailsTable = ({ orderDetails, columns, loading }) => (
  <Table
    dataSource={orderDetails}
    columns={columns}
    rowKey="id"
    loading={loading}
    pagination={false}
    style={{ marginTop: 16 }}
  />
);

export default OrderDetailsTable;