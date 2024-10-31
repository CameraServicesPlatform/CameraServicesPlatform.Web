import { Table } from "antd";
import React, { useEffect, useState } from "react";
import { getAccountOrderStatistics } from "../../api/dashboardApi";

const AccountOrderStatistics = ({ accountId, startDate, endDate }) => {
  const [statistics, setStatistics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const data = await getAccountOrderStatistics(
          accountId,
          startDate,
          endDate
        );
        setStatistics(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [accountId, startDate, endDate]);

  const columns = [
    {
      title: "Order ID",
      dataIndex: "orderId",
      key: "orderId",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
  ];

  return loading ? (
    <div>Loading...</div>
  ) : (
    <Table dataSource={statistics} columns={columns} />
  );
};

export default AccountOrderStatistics;
