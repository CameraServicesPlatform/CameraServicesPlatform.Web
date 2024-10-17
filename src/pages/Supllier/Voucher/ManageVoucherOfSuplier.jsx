import { Tabs, message } from "antd";
import React, { useState } from "react";
import VoucherListBySupplierId from "../../Supllier/Voucher/VoucherListBySuplierid";
import CreateVoucherForm from "./CreateVoucherForm";

const ManageVoucherOfSuplier = () => {
  const [refreshList, setRefreshList] = useState(false);

  const handleVoucherCreated = () => {
    message.success("Voucher created successfully!");
    setRefreshList(!refreshList); // toggle to refresh voucher list
  };

  const tabItems = [
    {
      key: "1",
      label: "Voucher List",
      children: <VoucherListBySupplierId refresh={refreshList} />,
    },
    {
      key: "2",
      label: "Create Voucher",
      children: <CreateVoucherForm onVoucherCreated={handleVoucherCreated} />,
    },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-semibold mb-6">Manage Vouchers</h1>
      <Tabs defaultActiveKey="1" items={tabItems} />
    </div>
  );
};

export default ManageVoucherOfSuplier;
