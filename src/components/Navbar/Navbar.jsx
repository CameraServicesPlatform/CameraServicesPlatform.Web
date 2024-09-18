import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logout } from "../../redux/features/authSlice";
import { isEmptyObject } from "../../utils/util";
import { message } from "antd";

const NavBar = () => {
  const { user } = useSelector((state) => state.user || {});
  const dispatch = useDispatch();
  const [expand, setExpand] = useState(false);
  const [isFixed, setIsFixed] = useState(false);
  const roleName = useSelector((state) => state.user?.role || "");
  const navigate = useNavigate();
  useEffect(() => {
    const scrollHandler = () => {
      setIsFixed(window.scrollY >= 100);
    };
    window.addEventListener("scroll", scrollHandler);
    return () => window.removeEventListener("scroll", scrollHandler);
  }, [roleName]);

  const handleLogOut = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    dispatch(logout());
    navigate("/");
    message.success("Đăng xuất thành công");
  };
  const renderDropDown = () => {
    return (
      <div className="dropdown dropdown-end">
        <div
          tabIndex={0}
          role="button"
          className="cursor-pointer m-1 text-primary"
        >
          <i className="fa-solid fa-user"></i>
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
        >
          <li>
            <NavLink to="/personal-information">Tài khoản </NavLink>
          </li>
          {roleName === "PM" && (
            <NavLink to="/pm">
              <li>
                <span>Trang quản trị</span>
              </li>
            </NavLink>
          )}
          {roleName === "ADMIN" && (
            <NavLink to="/admin">
              <li>
                <span>Trang quản trị</span>
              </li>
            </NavLink>
          )}
          {roleName === "ORGANIZER" && (
            <NavLink to="/org">
              <li>
                <span>Trang quản trị</span>
              </li>
            </NavLink>
          )}
          {roleName === "SPONSOR" && (
            <NavLink to="/sponsor">
              <li>
                <span>Trang quản trị</span>
              </li>
            </NavLink>
          )}
          <li onClick={handleLogOut}>
            <a>Đăng xuất</a>
          </li>
        </ul>
      </div>
    );
  };

  return (
    <div
      className={`w-full  transition-all duration-300 z-10 ${
        isFixed ? "bg-white shadow-xl py-2 " : "bg-white shadow-md py-4"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between">
        <NavLink
          to="/"
          className="flex items-center gap-2 no-underline text-primary"
        >
          <span className="text-2xl font-medium">Cóc Event</span>
        </NavLink>

        <div className="hidden md:flex items-center gap-4">
          <NavLink
            to="/"
            className="text-base font-semibold hover:text-gray-500 no-underline text-primary"
            onClick={() => setExpand(false)}
          >
            Trang chủ
          </NavLink>
          <NavLink
            to="/survey-form"
            className="text-base font-semibold hover:text-gray-500 no-underline text-primary"
            onClick={() => setExpand(false)}
          >
            Khảo sát
          </NavLink>
          {/* {Object.keys(clothTypeLabels).map((key, index) => (
            <NavLink
              key={key}
              to={`/product/${key}`}
              className="text-base font-semibold hover:text-gray-500 no-underline text-primary"
              onClick={() => setExpand(false)}
            >
              {clothTypeLabels[key]}
            </NavLink>
          ))} */}
        </div>

        <div className="flex items-center gap-4">
          <div className="md:hidden">
            <button
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={() => setExpand(!expand)}
            >
              <i className="fa-solid fa-bars"></i>{" "}
            </button>
          </div>
          <Link
            to="/cart"
            className="hidden md:block  font-semibold no-underline text-primary  hover:text-gray-500"
          >
            Giỏ hàng
          </Link>
          {user ? (
            renderDropDown()
          ) : (
            <Link
              to="/login"
              className="hidden md:block no-underline  font-semibold text-primary  hover:text-gray-500"
            >
              Đăng nhập
            </Link>
          )}
        </div>
      </div>

      {expand && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
              onClick={() => setExpand(false)}
            >
              Trang chủ
            </Link>

            {/* {Object.keys(clothTypeLabels).map((key, index) => (
              <NavLink
                key={key}
                to={`/product/${key}`}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                onClick={() => setExpand(false)}
              >
                {clothTypeLabels[key]}
              </NavLink>
            ))} */}
            <Link
              to="/cart"
              className="hidden md:block  font-semibold no-underline text-primary  hover:text-gray-500"
            >
              Giỏ hàng
            </Link>
            {isEmptyObject(user) ||
              (user == null && (
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                >
                  Đăng nhập
                </Link>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NavBar;
