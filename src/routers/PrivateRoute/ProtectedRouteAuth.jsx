import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { decode } from "../../utils/jwtUtil";

const ProtectedRouteAuth = ({ children }) => {
  if (localStorage.getItem("accessToken") === null) {
    toast.error("Bạn cần phải đăng nhập để thực hiện thao tác này!!");
    return <Navigate to="/login" replace />;
  } else {
    const role = decode(localStorage.getItem("accessToken"));
    if (role.role !== "STAFF" && role.role != "ADMIN") {
      toast.error("Bạn cần phải đăng nhập để thực hiện thao tác này!!");
      return <Navigate to="/login" replace />;
    }
  }
  return children;
};

export default ProtectedRouteAuth;
