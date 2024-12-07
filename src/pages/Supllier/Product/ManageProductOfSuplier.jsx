import { ShoppingCartOutlined } from "@ant-design/icons";
import { Tabs, Typography } from "antd";
import React, { useState } from "react";
import ProductListBySupplier from "./ProductListBySupplier";

const { Text } = Typography;

const ManageProductOfSupplier = () => {
  const [refreshList, setRefreshList] = useState(false);

  const tabItems = [
    {
      key: "1",
      label: (
        <span className="font-medium text-lg text-gray-700 flex items-center">
          <ShoppingCartOutlined className="mr-2" />
          Sản phẩm của bạn
        </span>
      ),
      children: <ProductListBySupplier />,
    },
  ];

  return (
    <div className="p-6 bg-gradient-to-tr from-blue-100 to-white rounded-2xl shadow-lg max-w-8xl mx-auto">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-gray-800">
          TRANG QUẢN LÍ SẢN PHẨM
        </h1>
      </header>
      <Tabs
        defaultActiveKey="1"
        items={tabItems}
        className="custom-tabs"
        tabBarStyle={{
          padding: "0.5rem",
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          fontSize: "1rem",
        }}
      />
      <style jsx="true">{`
        .custom-tabs .ant-tabs-tab {
          padding: 12px 20px;
          border-radius: 8px;
          margin-right: 12px;
          transition: all 0.3s;
        }
        .custom-tabs .ant-tabs-tab-active {
          background-color: #1890ff; /* Updated to consistent color */
          color: #ffffff;
          font-weight: bold;
        }
        .custom-tabs .ant-tabs-ink-bar {
          display: none;
        }
        @media (max-width: 768px) {
          .p-8 {
            padding: 1rem;
          }
          .text-4xl {
            font-size: 1.75rem;
          }
        }
        @media (forced-colors: active) {
          /* Styles for forced colors mode */
          body {
            background-color: Window;
            color: WindowText;
          }
          .custom-tabs {
            background-color: Window;
            border-color: WindowText;
          }
          .ant-tabs-card {
            background-color: Window;
          }
        }
      `}</style>
    </div>
  );
};

export default ManageProductOfSupplier;
