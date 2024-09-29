import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../../images/image.png"; // Update the path according to your structure
import { logout } from "../../redux/features/authSlice";
import { isEmptyObject } from "../../utils/util";

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
    toast.success("Đăng xuất thành công");
  };

  const renderDropDown = () => {
    return (
      <div className="dropdown dropdown-end">
        <div
          tabIndex={0}
          role="button"
          className="cursor-pointer m-1 text-black">
          <i className="fa-solid fa-user"></i>
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content z-[1] menu p-2 shadow bg-white rounded-box w-52">
          <li>
            <NavLink to="/personal-information">Tài khoản</NavLink>
          </li>
          {roleName === "isAdmin" && (
            <NavLink to="/admin">
              <li>
                <span>Trang quản trị</span>
              </li>
            </NavLink>
          )}
          {roleName === "isStaff" && (
            <NavLink to="/staff">
              <li>
                <span>Trang quản trị</span>
              </li>
            </NavLink>
          )}
          {roleName === "isShop" && (
            <NavLink to="/management-shop">
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
      className={`w-full transition-all duration-300 z-10 ${
        isFixed ? "bg-white shadow-xl py-2" : "bg-white shadow-md py-4"
      }`}>
      <div className="container mx-auto flex flex-col">
        <div className="flex gap-4">
          <NavLink
            to="/"
            className="flex items-center gap-2 no-underline text-black">
            <img src={logo} alt="Logo" className="h-20" /> {/* Add logo here */}
          </NavLink>
          <div className="flex-1 flex gap-4 items-center px-4">
            <div className="relative w-full">
              <input
                type="text"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 "
                placeholder="Nhập sản phẩm bạn đang tìm kiếm"
                required
              />
              <div
                tabIndex={0}
                role="button"
                className="absolute inset-y-0 end-0 cursor-pointer m-1 text-black flex items-center">
                <i className="fa-solid fa-magnifying-glass"></i>
              </div>
            </div>
            <div
              tabIndex={0}
              role="button"
              className="cursor-pointer m-1 text-black">
              <i className="fa-solid fa-cart-shopping"></i>
            </div>
            <div
              tabIndex={1}
              role="button"
              className="cursor-pointer m-1 text-black">
              <i className="fa-regular fa-user"></i>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="md:hidden">
              <button
                className="text-black hover:text-gray-700 focus:outline-none"
                onClick={() => setExpand(!expand)}>
                <i className="fa-solid fa-bars"></i>
              </button>
            </div>

            {user ? (
              renderDropDown()
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden md:block no-underline font-semibold text-black hover:text-gray-500">
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="hidden md:block no-underline font-semibold text-black hover:text-gray-500">
                  Đăng kí
                </Link>
                <Link
                  to="/"
                  className="hidden md:block no-underline font-semibold text-white bg-orange-500 px-5 py-3 rounded-full hover:text-gray-500">
                  Đăng kí cho thuê
                </Link>
              </>
            )}
          </div>
        </div>
        <div className="flex gap-10 py-5">
          <div className="hidden md:flex items-center gap-4">
            <NavLink
              to="/"
              className="text-base font-semibold hover:text-gray-500 no-underline text-black"
              onClick={() => setExpand(false)}>
              Trang chủ
            </NavLink>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <NavLink
              to="/"
              className="text-base font-semibold hover:text-gray-500 no-underline text-black"
              onClick={() => setExpand(false)}>
              Liên hệ
            </NavLink>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <NavLink
              to="/"
              className="text-base font-semibold hover:text-gray-500 no-underline text-black"
              onClick={() => setExpand(false)}>
              Máy ảnh
            </NavLink>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <NavLink
              to="/"
              className="text-base font-semibold hover:text-gray-500 no-underline text-black"
              onClick={() => setExpand(false)}>
              Lens
            </NavLink>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <NavLink
              to="/"
              className="text-base font-semibold hover:text-gray-500 no-underline text-black"
              onClick={() => setExpand(false)}>
              Phụ kiện
            </NavLink>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <NavLink
              to="/"
              className="text-base font-semibold hover:text-gray-500 no-underline text-black"
              onClick={() => setExpand(false)}>
              Về chúng tôi
            </NavLink>
          </div>
        </div>
      </div>

      {expand && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-black hover:bg-red-100"
              onClick={() => setExpand(false)}>
              Trang chủ
            </Link>
            {isEmptyObject(user) ||
              (user == null && (
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-black hover:bg-red-100">
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
