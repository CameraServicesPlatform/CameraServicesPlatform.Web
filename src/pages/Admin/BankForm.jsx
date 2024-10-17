import { Form, message, Select, Spin } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";

const { Option } = Select;

const BankForm = () => {
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch bank list from the API
  const fetchBanks = async () => {
    try {
      const response = await axios.get("https://api.vietqr.io/v2/banks");
      setBanks(response.data.data); // assuming data is in response.data.data
    } catch (error) {
      message.error("Failed to fetch bank list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanks();
  }, []);

  return (
    <Form layout="vertical">
      {/* Bank Name field */}
      <Form.Item
        label="Bank Name"
        name="bankName"
        rules={[{ required: true, message: "Please input the bank name!" }]}
      >
        {loading ? (
          <Spin />
        ) : (
          <Select placeholder="Select a bank">
            {banks.map((bank) => (
              <Option key={bank.code} value={bank.name}>
                <img
                  src={bank.logo}
                  alt={bank.name}
                  style={{ width: 20, marginRight: 10 }}
                />
                {bank.name}
              </Option>
            ))}
          </Select>
        )}
      </Form.Item>
    </Form>
  );
};

export default BankForm;
