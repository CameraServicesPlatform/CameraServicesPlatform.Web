import { Outlet } from "react-router-dom";
import HeaderManagement from "../components/Header/HeaderManagement";
import Sidebar from "../components/Siderbar/Sidebar";
const ManagementLayOut = () => {
  return (
    <>
      <div className="flex flex-col h-screen">
        <HeaderManagement />

        <div className="flex flex-row flex-1">
          <Sidebar />
        </div>
      </div>
    </>
  );
};
export default ManagementLayOut;
