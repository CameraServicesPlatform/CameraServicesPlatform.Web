import React from "react";
import { useRoutes } from "react-router-dom";
import CommonLayout from "../layouts/CommonLayout";
import ErrorPage from "../pages/Common/ErrorPage";
import Home from "../pages/Common/Home";
import LoginPage from "../pages/Common/LoginPage";
import VerifyPayment from "../pages/Common/VerifyPayment";

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
      ],
    },
  ]);
  return routing;
}
export default Routers;
