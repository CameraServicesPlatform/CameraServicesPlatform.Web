import {
  FileDoneOutlined,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { Tabs, Typography, message } from "antd";
import React, { useState } from "react";
import ProductVoucher from "../ProductVoucher/ProductVoucher";
import CreateVoucherFormBySuplier from "../Voucher/CreateVoucherFormBySuplier";
import VoucherListBySupplierId from "../Voucher/VoucherListBySuplierid";
const { Text } = Typography;

const ManageVoucherOfSuplier = () => {
  const [refreshList, setRefreshList] = useState(false);

  const handleVoucherCreated = () => {
    message.success("Tạo voucher thành công!"); // Translate success message
    setRefreshList(!refreshList); // toggle to refresh voucher list
  };

  const tabItems = [
    {
      key: "1",
      label: (
        <span className="font-medium text-lg text-gray-700 flex items-center">
          <FileDoneOutlined className="mr-2" />
          Danh Sách Voucher
        </span>
      ),
      children: <VoucherListBySupplierId refresh={refreshList} />,
    },
    {
      key: "2",
      label: (
        <span className="font-medium text-lg text-gray-700 flex items-center">
          <PlusOutlined className="mr-2" />
          Tạo Voucher
        </span>
      ),
      children: (
        <CreateVoucherFormBySuplier onVoucherCreated={handleVoucherCreated} />
      ),
    },
    {
      key: "3",
      label: (
        <span className="font-medium text-lg text-gray-700 flex items-center">
          <ReloadOutlined className="mr-2" />
          Quản lí sản phẩm áp mã ưu đãi
        </span>
      ),
      children: <ProductVoucher />,
    },
  ];

  return (
    <div className="p-6 bg-gradient-to-tr from-blue-100 to-white rounded-2xl shadow-lg max-w-8xl mx-auto">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">
          Quản Lý Voucher
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
      <style jsx>{`
        .custom-tabs .ant-tabs-tab {
          padding: 12px 20px;
          border-radius: 8px;
          margin-right: 12px;
          transition: all 0.3s;
        }
        .custom-tabs .ant-tabs-tab-active {
          background-color: #1890ff;
          color: #ffffff;
          font-weight: bold;
        }
        .custom-tabs .ant-tabs-ink-bar {
          display: none;
        }
        @media (max-width: 768px) {
          .p-6 {
            padding: 1rem;
          }
          .text-3xl {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ManageVoucherOfSuplier;
