import { Tabs } from "antd";
import React, { useState } from "react";
import ReportListBySupplierId from "./ReportListBySupplierId";

const ManageReportProductOfSupplier = () => {
  const [refreshList, setRefreshList] = useState(false);

  const tabItems = [
    {
      key: "1",
      label: "Danh Sách Báo Cáo",
      children: <ReportListBySupplierId refresh={refreshList} />,
    },
    // {
    //   key: "2",

    //   label: "Quản lí sản phẩm áp mã báo cáo",
    //   children: <ProductReport />,
    // },
  ];

  return (
    <div className="p-6 bg-gradient-to-tr from-blue-100 to-white rounded-2xl shadow-lg max-w-8xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6">Quản Lý Báo Cáo Sản Phẩm</h1>
      <Tabs defaultActiveKey="1" items={tabItems} />
    </div>
  );
};

export default ManageReportProductOfSupplier;
