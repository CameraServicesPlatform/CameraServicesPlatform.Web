import React from "react";
import { Navigate, useRoutes } from "react-router-dom";
import CommonLayout from "../layouts/CommonLayout";
import ManagementLayOut from "../layouts/ManagementLayout/ManagementLayOut";
import About from "../pages/Common/About";
import ManageUser from "../pages/Common/Account/User/ManageUser";
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
import ManageOrder from "../pages/Management/Order/ManageOrder";
import ManageProduct from "../pages/Management/Product/ManageProduct";
import CheckInPage from "../pages/PM/CheckInPage";
import ManageCategory from "../pages/Staff/Category/ManageCategory";
import ProtectedRouteAdmin from "./PrivateRoute/ProtectedRouteAdmin";
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
        { path: "ve-chung-toi", element: <About /> },
        { path: "lien-he", element: <Contact /> },
        { path: "chinh-sach", element: <Policy /> },
        { path: "gio-hang", element: <Cart /> },
        { path: "personal-information", element: <PersonalInformation /> },
        { path: "register-supplier", element: <RegisterSupplier /> },
        { path: "product", element: <ProductPage /> },
        { path: "product-for-rent", element: <ProductPage /> },
        { path: "product-for-buy", element: <ProductPage /> },

        { path: "manage-product", element: <ManageProduct /> },
        { path: "order", element: <ManageOrder /> },
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
      ],
    },
    {
      path: "supplier",
      element: <ManagementLayOut />,
      children: [
        { index: true, element: <Navigate to="dashboard" replace /> },
        {
          path: "dashboard",
          element: <div>Dashboard</div>,
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
      ],
    },
  ]);

  return routing;
}

export default Routers;
