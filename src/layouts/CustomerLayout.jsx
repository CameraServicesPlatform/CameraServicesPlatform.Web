// CustomerLayout.js
import React from "react";
import { Outlet } from "react-router-dom";
import SlidebarCus from "../components/Siderbar/SlidebarCus";
import { Footer, Navbar } from "../components";

const CustomerLayout = () => {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className=" mt-20 flex flex-row flex-1">
        <SlidebarCus />
      </div>
      <Footer />
    </div>
  );
};

export default CustomerLayout;
