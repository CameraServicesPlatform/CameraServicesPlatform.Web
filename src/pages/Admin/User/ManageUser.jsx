import { Tabs } from "antd";
import CreateStaffForm from "./CreateStaffForm";
import ManageSupplier from "./ManageSupplier";
import ManageUserList from "./ManageUserList";
import SendActivationCode from "./SendActiveSupplier";

const ManageUser = () => {
  const items = [
    {
      key: "1",
      label: "Danh Sách Người Dùng",
      children: <ManageUserList />, // Use the new ManageUserList component
    },
    {
      key: "2",
      label: "Danh Sách Nhà Cung Cấp",
      children: <ManageSupplier />,
    },
    {
      key: "3",
      label: "Cấp quyền hoạt động cho nhà cung cấp ",
      children: <SendActivationCode />,
    },
    {
      key: "4",
      label: "Tạo tài khoản cho Staff",
      children: <CreateStaffForm />,
    },
  ];

  return (
    <div>
      <h1 className="text-center font-bold text-primary text-xl">
        QUẢN TRỊ NGƯỜI DÙNG TẠI HỆ THỐNG CAMERA SERVICE PLATFORM
      </h1>
      <Tabs defaultActiveKey="1" items={items} />
    </div>
  );
};

export default ManageUser;
