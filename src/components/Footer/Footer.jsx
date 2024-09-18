import React from "react";

const Footer = () => {
  return (
    <div className="mt-4 p-2 rounded-md border-t-2 container mx-auto">
      <div className="flex flex-col md:flex md:flex-row">
        <div className="px-5">
          <div className="flex items-center gap-2 mb-5">
            <h1 className="text-2xl font-bold text-primary">Cóc Event</h1>
          </div>
          <p className="opacity-50 mb-5">
            "Đặt lịch cùng chúng tôi để có những trải nghiệm tuyệt vời nhất!"
            <br />
          </p>
        </div>
        <div className="px-5 ">
          <h2 className="text-xl mb-5 text-primary">Về chúng tôi</h2>
          <ul className="opacity-50">
            <li className="mb-2">
              <a href="https://www.facebook.com/modareinvented">Facebook</a>
            </li>
            <li className="mb-2">Tiktok</li>
          </ul>
        </div>
        <div className="px-5 ">
          <h2 className="text-xl mb-5 text-primary">
            Dịch vụ chăm sóc khách hàng
          </h2>
          <ul className="opacity-50">
            <li className="mb-2">Trung tâm bảo hành</li>
            <li className="mb-2">Chính sách</li>
          </ul>
        </div>
        <div className="px-5 ">
          <h2 className="text-xl mb-5 text-primary">Liên hệ</h2>
          <ul className="opacity-50">
            <li className="mb-2">
              Đại Học FPT Hồ Chí Minh, Quận 9, Thành Phố Hồ Chí Minh
            </li>
            <li className="mb-2">Email: coc-event.contact@gmail.com</li>
            <li className="mb-2">Phone: +84 366 967 957</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Footer;
