import React from "react";
import { Navigate, useRoutes } from "react-router-dom";
import CommonLayout from "../layouts/CommonLayout";
import ManagementLayOut from "../layouts/ManagementLayout/ManagementLayOut";
import ManagePolicy from "../pages/Admin/Policy/ManagePolicy";
import ManageUser from "../pages/Admin/User/ManageUser";
import About from "../pages/Common/About";
import Cart from "../pages/Common/Cart";
import Contact from "../pages/Common/Contact";
import ErrorPage from "../pages/Common/ErrorPage";
import Home from "../pages/Common/Home";
import LoginPage from "../pages/Common/LoginPage";
import PersonalInformation from "../pages/Common/PersonalInformation";
import Policy from "../pages/Common/Policy";
import ProductPage from "../pages/Common/Product/ProductPage";
import VerifyPayment from "../pages/Common/VerifyPayment";
import RegisterSupplier from "../pages/CommonManager/RegisterSupplier";
import CreateProductForm from "../pages/Management/Product/CreateProductForm";

import CreateOrderBuy from "../pages/Common/Order/CreateOrderBuy/CreateOrderBuy";
import ManageProduct from "../pages/Management/Product/ManageProduct";
import CheckInPage from "../pages/PM/CheckInPage";
import ManageCategory from "../pages/Staff/Category/ManageCategory";
import ManageVoucher from "../pages/Staff/Voucher/ManageVoucher";
import ManageVoucherOfSuplier from "../pages/Supllier/Voucher/ManageVoucherOfSuplier";
import ProtectedRouteAdmin from "./PrivateRoute/ProtectedRouteAdmin";
import CreateStaffForm from "../pages/Admin/User/CreateStaffForm";
function Routers() {
  const routing = useRoutes([
    {
      path: "*",
      element: <ErrorPage />,
    },
    {
      path: "/",
      element: <CommonLayout />,
      children: [
        { index: true, element: <Home /> },
        { path: "login", element: <LoginPage /> },
        { path: "verify-payment/*", element: <VerifyPayment /> },
        { path: "check-in", element: <CheckInPage /> },
        { path: "about", element: <About /> },
        { path: "contact", element: <Contact /> },
        { path: "policy", element: <Policy /> },
        { path: "gio-hang", element: <Cart /> },
        { path: "personal-information", element: <PersonalInformation /> },
        { path: "register-supplier", element: <RegisterSupplier /> },
        { path: "product", element: <ProductPage /> },
        { path: "product-for-rent", element: <ProductPage /> },
        { path: "product-for-buy", element: <ProductPage /> },
        { path: "create-order-buy", element: <CreateOrderBuy /> },
      ],
    },
    {
      path: "admin",
      element: (
        <ProtectedRouteAdmin>
          <ManagementLayOut />
        </ProtectedRouteAdmin>
      ),
      children: [
        { index: true, element: <Navigate to="dashboard" replace /> },
        {
          path: "dashboard",
          element: <div>Dashboard</div>,
        },
        {
          path: "manage-user",
          element: <ManageUser />,
        },
        {
          path: "settings",
          element: <div>Settings</div>,
        },
        { path: "manage-policy", element: <ManagePolicy /> },
        { path: "manage-category", element: <ManageCategory /> },
        { path: "manage-product", element: <ManageProduct /> },
        { path: "create-staff", element: <CreateStaffForm /> },
      ],
    },
    {
      path: "supllier", // change from "supplier" to "supllier"
      element: <ManagementLayOut />,
      children: [
        { index: true, element: <Navigate to="dashboard" replace /> },
        {
          path: "dashboard",
          element: <div>Dashboard</div>,
        },
        { path: "create-product", element: <CreateProductForm /> },
        {
          path: "manage-voucher-of-supplier",
          element: <ManageVoucherOfSuplier />,
        },
      ],
    },

    {
      path: "staff",
      element: <ManagementLayOut />,
      children: [
        { index: true, element: <Navigate to="dashboard" replace /> },
        { path: "dashboard", element: <div>Dashboard</div> },
        { path: "manage-category", element: <ManageCategory /> },
        { path: "manage-product", element: <ManageProduct /> },
        { path: "manage-voucher", element: <ManageVoucher /> },
      ],
    },
  ]);

  return routing;
}

export default Routers;
