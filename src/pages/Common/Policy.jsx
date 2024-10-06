import React from "react";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

const Policy = () => {
  return (
    <div>
      <header className="bg-white shadow p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <span className="bg-yellow-400 text-white px-3 py-1 rounded">
              TRUNG TÂM TRỢ GIÚP
            </span>
            <h1 className="text-2xl font-bold mt-2">
              Chúng tôi có thể giúp gì cho bạn!
            </h1>
            <div className="mt-4 flex">
              <input
                type="text"
                placeholder="Nhập câu hỏi hoặc từ khóa của bạn"
                className="border border-gray-300 rounded-l px-4 py-2 w-full"
              />
              <button className="bg-orange-500 text-white px-6 py-2 rounded-r">
                TÌM KIẾM
              </button>
            </div>
          </div>
          <div>
            <img
              src="https://thumb.ac-illust.com/96/96cdd9d61cb741de486486073b0f821a_t.jpeg"
              alt="Đại diện hỗ trợ khách hàng"
              className="rounded-full"
            />
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto mt-10">
        <section className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-4">
            Hôm nay chúng tôi có thể hỗ trợ bạn với điều gì?
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="border border-orange-500 rounded p-4 text-center">
              <i className="fas fa-box text-orange-500 text-2xl mb-2"></i>
              <p>Theo dõi Đơn hàng</p>
            </div>
            <div className="border border-orange-500 rounded p-4 text-center">
              <i className="fas fa-key text-orange-500 text-2xl mb-2"></i>
              <p>Đặt lại Mật khẩu</p>
            </div>
            <div className="border border-orange-500 rounded p-4 text-center">
              <i className="fas fa-credit-card text-orange-500 text-2xl mb-2"></i>
              <p>Tùy chọn Thanh toán</p>
            </div>
            <div className="border border-orange-500 rounded p-4 text-center">
              <i className="fas fa-user text-orange-500 text-2xl mb-2"></i>
              <p>Người dùng & Tài khoản</p>
            </div>
            <div className="border border-orange-500 rounded p-4 text-center">
              <i className="fas fa-heart text-orange-500 text-2xl mb-2"></i>
              <p>Danh sách yêu thích & So sánh</p>
            </div>
            <div className="border border-orange-500 rounded p-4 text-center">
              <i className="fas fa-shipping-fast text-orange-500 text-2xl mb-2"></i>
              <p>Vận chuyển & Thanh toán</p>
            </div>
            <div className="border border-orange-500 rounded p-4 text-center">
              <i className="fas fa-shopping-cart text-orange-500 text-2xl mb-2"></i>
              <p>Giỏ hàng & Ví</p>
            </div>
            <div className="border border-orange-500 rounded p-4 text-center">
              <i className="fas fa-store text-orange-500 text-2xl mb-2"></i>
              <p>Bán trên cameraameraservice</p>
            </div>
          </div>
        </section>
        <section className="mt-10">
          <h2 className="text-xl font-bold mb-4">Chủ đề phổ biến</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ul className="list-disc list-inside">
              <li>Làm thế nào tôi có thể trả lại món hàng?</li>
              <li className="text-orange-500">
                Chính sách trả hàng của nền tảng là gì?
              </li>
              <li>Quá trình hoàn tiền mất bao lâu?</li>
            </ul>
            <ul className="list-disc list-inside">
              <li>Thời gian giao hàng là gì?</li>
              <li>Chiến dịch "Khám phá Chiến dịch Daraz 2022" là gì?</li>
              <li>Voucher & Ưu đãi quà tặng trong chiến dịch này là gì?</li>
            </ul>
            <ul className="list-disc list-inside">
              <li>Làm thế nào để hủy đơn hàng Camera Service Platform?</li>
              <li>Hỏi cộng đồng kỹ thuật số và thiết bị</li>
              <li>Làm thế nào để thay đổi tên cửa hàng của tôi?</li>
            </ul>
          </div>
        </section>

        <section className="mt-10 bg-gradient-to-r from-gray-200 to-gray-300 p-8 rounded-lg shadow-lg text-center flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Không tìm thấy câu trả lời của bạn? Liên hệ với chúng tôi!
          </h2>
          <p className="mb-6 text-gray-600">
            Chúng tôi luôn sẵn sàng hỗ trợ bạn với mọi thắc mắc!
          </p>
          <div className="flex flex-col md:flex-row justify-center items-start gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between w-full md:w-3/5 h-full transition-transform transform hover:scale-105">
              <div className="flex items-center mb-4">
                <i className="fas fa-phone-alt text-blue-500 text-3xl mr-4"></i>
                <div>
                  <h3 className="text-lg font-bold">Gọi cho chúng tôi ngay</h3>
                  <p className="text-gray-500">
                    Giờ hoạt động: 9:00 AM đến 5:00 PM (GMT-7)
                  </p>
                  <p className="text-gray-500">Nói chuyện với chúng tôi ngay</p>
                </div>
              </div>
              <p className="text-2xl font-bold mb-4">+84 0817363768</p>
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors duration-300">
                GỌI NGAY
              </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between w-full md:w-3/5 h-full transition-transform transform hover:scale-105">
              <div className="flex items-center mb-4">
                <i className="fas fa-comments text-green-500 text-3xl mr-4"></i>
                <div>
                  <h3 className="text-lg font-bold">Chat với chúng tôi</h3>
                  <p className="text-gray-500">
                    Giờ hoạt động: 9:00 AM đến 5:00 PM (GMT-7)
                  </p>
                  <p className="text-gray-500">Nói chuyện với chúng tôi ngay</p>
                </div>
              </div>
              <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors duration-300">
                LIÊN HỆ CHÚNG TÔI
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Policy;
