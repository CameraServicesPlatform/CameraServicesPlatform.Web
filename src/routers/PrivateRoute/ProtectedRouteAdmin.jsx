import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { decode } from "../../utils/jwtUtil";

const ProtectedRouteAdmin = ({ children }) => {
  try {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      toast.error("Bạn cần đăng nhập");
      return <Navigate to="/login" replace />;
    }

    const { mainRole } = decode(accessToken);

    if (mainRole !== "ADMIN") {
      toast.error("Bạn không có quyền truy cập");
      return <Navigate to="/" replace />;
    }

    return children;
  } catch (error) {
    console.error("Error decoding token or checking role", error);
    toast.error("Đã xảy ra lỗi khi kiểm tra quyền truy cập");
    return <Navigate to="/" replace />;
  }
};
export default ProtectedRouteAdmin;
