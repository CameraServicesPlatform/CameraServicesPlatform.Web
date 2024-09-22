import { useSelector } from "react-redux";
import { NavLink, useLocation } from "react-router-dom";

const SideBar = () => {
  const roleName = useSelector((state) => state.user?.role || "");

  const location = useLocation();

  const menuItems = {
    isShop: [
      {
        name: "Thống kê",
        icon: <i className="fa-solid fa-chart-line"></i>,
        path: "dashboard",
      },
      {
        name: "Sản phẩm",
        icon: <i className="fa-solid fa-shirt"></i>,
        path: "product",
      },
      {
        name: "Đơn hàng",
        icon: <i className="fa-solid fa-list"></i>,
        path: "orders",
      },
      {
        name: "Gói dịch vụ",
        icon: <i className="fa-solid fa-lightbulb"></i>,
        path: "package",
      },
    ],
    isAdmin: [
      {
        name: "Thống kê",
        icon: <i className="fa-solid fa-chart-line"></i>,
        path: "dashboard",
      },
      {
        name: "Đối tác",
        icon: <i className="fa-solid fa-handshake-simple"></i>,
        path: "shop",
      },

      {
        name: "Gói dịch vụ",
        icon: <i className="fa-solid fa-lightbulb"></i>,
        path: "package",
      },
      {
        name: "Cấu hình hệ thống",
        icon: <i className="fa-solid fa-gear"></i>,
        path: "settings",
      },
    ],
    isStaff: [
      {
        name: "Thống kê",
        icon: <i className="fa-solid fa-chart-line"></i>,
        path: "dashboard",
      },
      {
        name: "Đối tác",
        icon: <i className="fa-solid fa-handshake-simple"></i>,
        path: "shop",
      },
      {
        name: "Sản phẩm",
        icon: <i className="fa-solid fa-shirt"></i>,
        path: "product",
      },
      {
        name: "Gói dịch vụ",
        icon: <i className="fa-solid fa-box-open"></i>,
        path: "package",
      },
      {
        name: "Đơn hàng",
        icon: <i className="fa-solid fa-bag-shopping"></i>,
        path: "order",
      },
    ],
  };

  const renderMenu = (items) => {
    return items.map((item, index) => (
      <>
        <NavLink to={`${item.path}`} key={index}>
          <li className="hover:bg-primary rounded-md text-black hover:text-white my-1">
            <a
              className={`flex items-center ${
                location.pathname?.includes(item.path)
                  ? "bg-primary text-white"
                  : ""
              }`}
            >
              {item.icon}
              <span className={`${isOpen ? "inline" : "hidden"} ml-2 text-md`}>
                {item.name}
              </span>
            </a>
          </li>
        </NavLink>
      </>
    ));
  };

  return (
    <div className="">
      {/* <div
        className={`bg-white text-text-color my-4 shadow-lg rounded-lg transition-all duration-300 ${
          isOpen ? "w-64" : "w-20"
        }`}
      >
        <ul className={`menu p-4 w-full text-base-content`}>
          {roleName && renderMenu(menuItems[roleName])}
        </ul>
      </div> */}
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
