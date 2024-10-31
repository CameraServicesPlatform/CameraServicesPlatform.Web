import { Tabs, message } from "antd";
import React, { useState } from "react";
import ProductVoucher from "../ProductVoucher/ProductVoucher";
import CreateVoucherFormBySuplier from "../Voucher/CreateVoucherFormBySuplier";
import VoucherListBySupplierId from "../Voucher/VoucherListBySuplierid";
const ManageVoucherOfSuplier = () => {
  const [refreshList, setRefreshList] = useState(false);

  const handleVoucherCreated = () => {
    message.success("Tạo voucher thành công!"); // Translate success message
    setRefreshList(!refreshList); // toggle to refresh voucher list
  };

  const tabItems = [
    {
      key: "1",
      label: "Danh Sách Voucher",
      children: <VoucherListBySupplierId refresh={refreshList} />,
    },
    {
      key: "2",
      label: "Tạo Voucher",
      children: (
        <CreateVoucherFormBySuplier onVoucherCreated={handleVoucherCreated} />
      ),
    },
    {
      key: "3",
      label: "Quản lí sản phẩm áp mã ưu đãi",
      children: <ProductVoucher />,
    },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-semibold mb-6">Quản Lý Voucher</h1>{" "}
      {/* Translated to "Manage Vouchers" */}
      <Tabs defaultActiveKey="1" items={tabItems} />
    </div>
  );
};

export default ManageVoucherOfSuplier;
