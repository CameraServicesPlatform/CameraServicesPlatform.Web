import { Outlet } from "react-router-dom";
import Footer from "../components/Footer/Footer";
import NavBar from "../components/Navbar/Navbar";

const CommonLayout = () => {
  return (
    <>
      <NavBar />
      <div className="container my-10">
        <Outlet />
      </div>

      <Footer />
    </>
  );
};
export default CommonLayout;
