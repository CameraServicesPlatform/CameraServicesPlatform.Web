import React from "react";
import { Card, Table } from "antd";
import { AppstoreOutlined } from "@ant-design/icons";

const columns = [
  {
    title: "Tên Sản Phẩm",
    dataIndex: "productName",
    key: "productName",
  },
];

const ProductStatisticsTable = ({ productStatistics }) => (
  <Card
    title={
      <span>
        <AppstoreOutlined /> Thống Kê Sản Phẩm
      </span>
    }
    className="shadow-sm"
  >
    <Table
      dataSource={productStatistics}
      columns={columns}
      pagination={{ pageSize: 5 }}
      scroll={{ y: 240 }}
    />
  </Card>
);

export default ProductStatisticsTable;
