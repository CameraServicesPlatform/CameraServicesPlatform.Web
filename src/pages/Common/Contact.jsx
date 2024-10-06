import { Button, Form, Input } from "antd";
import React from "react";

const onFinish = (values) => {
  console.log("Form values: ", values);
};

const Contact = () => {
  return (
    <div className="container mx-auto p-4">
      {/* Breadcrumb */}
      <div className="text-gray-500 mb-4">
        <span>Trang chủ</span> / <span>Liên hệ</span>
      </div>

      <div className="flex space-x-4">
        {/* Contact Information Section */}
        <div className="bg-white p-6 rounded-lg shadow-md w-1/3">
          <div className="flex items-center mb-4">
            <i className="fas fa-phone-alt text-red-500 text-2xl mr-4"></i>
            <div>
              <h2 className="text-lg font-semibold">
                Liên hệ qua số điện thoại
              </h2>
              <p>Chúng tôi luôn sẵn sàng 24/7, 7 ngày một tuần.</p>
              <p className="mt-2">Số điện thoại: +8801611112222</p>
            </div>
          </div>
          <hr className="my-4" />
          <div className="flex items-center">
            <i className="fas fa-envelope text-red-500 text-2xl mr-4"></i>
            <div>
              <h2 className="text-lg font-semibold">Gửi email về chúng tôi</h2>
              <p>
                Điền vào biểu mẫu của chúng tôi và chúng tôi sẽ liên hệ với bạn
                trong vòng 24 giờ.
              </p>
              <p className="mt-2">Emails: customer@exclusive.com</p>
              <p>Emails: support@exclusive.com</p>
            </div>
          </div>
        </div>

        {/* Contact Form Section */}
        <div className="bg-white p-6 rounded-lg shadow-md w-2/3">
          <Form
            name="contactForm"
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
          >
            <div className="flex space-x-4 mb-4">
              <Form.Item
                name="name"
                label="Tên"
                rules={[
                  { required: true, message: "Vui lòng nhập tên của bạn!" },
                ]}
                className="w-1/3"
              >
                <Input placeholder="Tên" />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email *"
                rules={[
                  { required: true, message: "Vui lòng nhập email của bạn!" },
                  { type: "email", message: "Email không hợp lệ!" },
                ]}
                className="w-1/3"
              >
                <Input placeholder="Email *" />
              </Form.Item>

              <Form.Item
                name="phone"
                label="Số điện thoại *"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập số điện thoại của bạn!",
                  },
                ]}
                className="w-1/3"
              >
                <Input placeholder="Số điện thoại *" />
              </Form.Item>
            </div>

            <Form.Item
              name="message"
              label="Lời nhắn"
              rules={[
                { required: true, message: "Vui lòng nhập lời nhắn của bạn!" },
              ]}
            >
              <Input.TextArea placeholder="Lời nhắn" rows={4} />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Gửi
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
