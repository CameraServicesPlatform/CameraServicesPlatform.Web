import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div>
      <div
        className="hero min-h-screen"
        style={{
          backgroundColor: "white",
        }}
      >
        <div className="bg-opacity-60"></div>
        <div className="hero-content text-center text-neutral-content">
          <div className="max-w-md">
            <h1 className="mb-5 text-9xl font-bold text-black">404</h1>
            <h2 className="mb-5 text-2xl font-bold text-black">Trang này không tồn tại</h2>
            <p className="mb-5 text-black">
              Trang này không tồn tại hoặc không có sẵn. Vui lòng kiểm tra xem
              địa chỉ đã chính xác không
            </p>
            <Link
              to="/"
              className="text-white  w-full mt-2 bg-red-500 hover:bg-red-600  font-medium rounded-lg text-md px-5 py-3.5 text-center mr-2 mb-2"
            >
              Trở về trang chủ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
