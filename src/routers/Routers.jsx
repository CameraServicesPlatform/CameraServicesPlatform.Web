import React from "react";
import { Navigate, useRoutes } from "react-router-dom";
import CommonLayout from "../layouts/CommonLayout";
import ManagementLayOut from "../layouts/ManagementLayout/ManagementLayOut";
import ErrorPage from "../pages/Common/ErrorPage";
import Home from "../pages/Common/Home";
import LoginPage from "../pages/Common/LoginPage";
import VerifyPayment from "../pages/Common/VerifyPayment";
import CheckInPage from "../pages/PM/CheckInPage";
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
        { path: "about", element: <About /> },

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
          path: "users",
          element: <div>Users</div>,
        },
        {
          path: "settings",
          element: <div>Settings</div>,
        },
      ],
    },
    {
      path: "pm",
      element: <ManagementLayOut />,
      children: [
        { index: true, element: <Navigate to="create-event" replace /> },
      ],
    },
  ]);
  return routing;
}
export default Routers;
