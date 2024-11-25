import { Table } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getAccountOrderStatistics } from "../../api/dashboardApi";

const AccountOrderStatistics = ({ startDate, endDate }) => {
  const user = useSelector((state) => state.user.user || {});
  const accountId = user.id;
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
        console.error("Failed to fetch order statistics:", error);
      } finally {
        setLoading(false);
      }
    };

    if (accountId && startDate && endDate) {
      fetchStatistics();
    }
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

  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <Table dataSource={statistics} columns={columns} rowKey="orderId" />
      )}
    </>
  );
};

export default AccountOrderStatistics;
