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
      { name: "Tổng Quan", link: "sponsor-overview", icon: <FaHome /> },
      { name: "Quản lí danh mục sản phẩm", link: "manage-category" },
    ],

    SUPPLIER: [
      { name: "Thống kê", link: "dashboard", icon: <FaHome /> },
      { name: "Tổng Quan", link: "sponsor-overview", icon: <FaHome /> },
    ],
    ADMIN: [
      { name: "Thống kê", link: "dashboard", icon: <FaHome /> },
      { name: "Người dùng", link: "manage-user", icon: <FaUser /> },
    ],
  };

  const renderMenu = (items) => {
    if (!items) return null;
    return items.map((item, index) => (
      <>
        {/* <NavLink to={`/${roleName.toLowerCase()}/${item.link}`} key={index}> */}
        <NavLink to={`${item.link}`} key={index}>
          <li className="hover:bg-primary rounded-md text-black hover:text-white my-1">
            <a
              className={`flex items-center ${
                location.pathname?.includes(item.link)
                  ? "bg-primary text-white"
                  : ""
              }`}
            >
              {item.icon}
              <span className={`inline ml-2 text-md`}>{item.name}</span>
            </a>
          </li>
        </NavLink>
      </>
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
