import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { decode } from "../../utils/jwtUtil";

const ProtectedRouteAdmin = ({ children }) => {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    toast.error("Bạn cần đăng nhập");
    return <Navigate to="/login" replace />;
  }

  const { mainRole } = decode(accessToken); // Decode the token and check for 'mainRole'

  if (mainRole !== "ADMIN") {
    toast.error("Bạn không có quyền truy cập");
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRouteAdmin;
