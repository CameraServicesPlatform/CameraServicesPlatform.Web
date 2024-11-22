import { Button, Form, Input, Typography } from "antd";
import React, { useState } from "react";
import { createSupplierPayment } from "./api"; // Điều chỉnh đường dẫn import nếu cần

const { Title } = Typography;

const CreateSupplierPayment = () => {
  const [accountId, setAccountId] = useState("");
  const [amount, setAmount] = useState(0);
  const [response, setResponse] = useState(null);

  const handleSubmit = async (values) => {
    const data = {
      orderID: null,
      accountId: values.accountId,
      amount: values.amount,
    };
    const result = await createSupplierPayment(data);
    setResponse(result);
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <Title level={2} className="text-center">
        Tạo Thanh Toán Nhà Cung Cấp
      </Title>
      <Form layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Mã Tài Khoản"
          name="accountId"
          rules={[{ required: true, message: "Vui lòng nhập Mã Tài Khoản!" }]}
        >
          <Input
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
          />
        </Form.Item>
        <Form.Item
          label="Số Tiền"
          name="amount"
          rules={[{ required: true, message: "Vui lòng nhập Số Tiền!" }]}
        >
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full">
            Gửi
          </Button>
        </Form.Item>
      </Form>
      {response && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          Phản hồi: {JSON.stringify(response)}
        </div>
      )}
    </div>
  );
};

export default CreateSupplierPayment;
