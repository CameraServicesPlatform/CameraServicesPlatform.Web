import { toast } from "react-toastify";
import { decode } from "../../utils/jwtUtil";
import { Navigate } from "react-router-dom";

const ProtectedRouteAdmin = ({ children }) => {
  if (localStorage.getItem("accessToken") === null) {
    toast.error("Bạn cần đăng nhập");
    return <Navigate to="/login" replace />;
  } else {
    const role = decode(localStorage.getItem("accessToken"));
    if (role.role !== "isAdmin") {
      toast.error("Bạn không có quyền truy cập");
      return <Navigate to="/" replace />;
    }
    return children;
  }
};

export default ProtectedRouteAdmin;
