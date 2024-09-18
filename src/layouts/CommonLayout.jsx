import React from "react";
import { Outlet } from "react-router-dom";
import { Footer, Navbar } from "../components";
import SlidebarCus from "../components/Siderbar/SlidebarCus";

function CommonLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

export default CommonLayout;
