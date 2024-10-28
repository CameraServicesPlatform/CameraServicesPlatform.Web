import { useState } from "react";
import { FaHome, FaUser } from "react-icons/fa";
import { useSelector } from "react-redux";
import { NavLink, useLocation } from "react-router-dom";

const SideBar = () => {
  const roleName = useSelector((state) => state.user?.role || "");
  const [isOpen, setIsOpen] = useState(false);

  const location = useLocation();

  const menuItems = {
    STAFF: [
      { name: "Thống kê", link: "dashboard", icon: <FaHome /> },
      { name: "Quản lí danh mục sản phẩm", link: "manage-category" },
      { name: "Tổng quản lí sản phẩm hệ thống", link: "manage-product" },
      { name: "Tạo Voucher", link: "manage-voucher" },
    ],

    SUPPLIER: [
      { name: "Thống kê", link: "dashboard", icon: <FaHome /> },
      { name: "Voucher", link: "manage-voucher-of-supplier" },
      { name: "Tạo sản phẩm", link: "manage-product-of-supplier" },
    ],
    ADMIN: [
      { name: "Thống kê", link: "dashboard", icon: <FaHome /> },
      { name: "Người dùng", link: "manage-user", icon: <FaUser /> },
      { name: "Tổng quản lí sản phẩm hệ thống", link: "manage-product" },
      { name: "Quản lí chính sách", link: "manage-policy" },
    ],
  };

  const renderMenu = (items) => {
    if (!items) return null;
    return items.map((item) => (
      <li
        key={item.link}
        className="hover:bg-primary rounded-md text-black hover:text-white my-1"
      >
        <NavLink
          to={`${item.link}`}
          className={`flex items-center ${
            location.pathname.includes(item.link) ? "bg-primary text-white" : ""
          }`}
        >
          {item.icon}
          <span className={`inline ml-2 text-md`}>{item.name}</span>
        </NavLink>
      </li>
    ));
  };

  return (
    <div className="">
      <div className="h-full border-r border-gray-100 drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-side z-10  rounded-4xl">
          <label
            htmlFor="my-drawer-2"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>

          <ul className="menu p-4 w-60 min-h-full  bg-white text-base-content">
            {roleName && renderMenu(menuItems[roleName])}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
