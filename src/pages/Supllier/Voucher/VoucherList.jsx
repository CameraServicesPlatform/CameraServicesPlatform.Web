import { Pagination, Spin, Table, message } from "antd";
import React, { useEffect, useState } from "react";
import { getAllVouchers } from "../../../api/voucherApi"; // Adjust import path accordingly

const VoucherList = () => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    fetchVouchers(pageIndex, pageSize);
  }, [pageIndex, pageSize]);

  const fetchVouchers = async (pageIndex, pageSize) => {
    setLoading(true);
    try {
      const data = await getAllVouchers(pageIndex, pageSize);
      console.log(data); // Check the full response structure

      if (data && data.isSuccess) {
        // Adjust the path to access items and total count correctly
        setVouchers(data.result.items || []); // Extract items from the response
        setTotalItems(data.result.totalPages * pageSize); // Use total pages for total items
      } else {
        setVouchers([]);
        setTotalItems(0);
      }
    } catch (error) {
      message.error("Failed to fetch vouchers.");
      setVouchers([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Voucher ID",
      dataIndex: "vourcherID", // Corrected typo in dataIndex
    },
    {
      title: "Supplier ID",
      dataIndex: "supplierID",
    },
    {
      title: "Voucher Code",
      dataIndex: "vourcherCode", // Corrected typo in dataIndex
    },
    {
      title: "Description",
      dataIndex: "description",
    },
    {
      title: "Discount Amount",
      dataIndex: "discountAmount",
      render: (discount) => `${discount} VND`,
    },
    {
      title: "Valid From",
      dataIndex: "validFrom",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Expiration Date",
      dataIndex: "expirationDate",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Is Active",
      dataIndex: "isActive",
      render: (isActive) => (isActive ? "Yes" : "No"),
    },
    {
      title: "Action",
      render: (text, record) => (
        <button className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600">
          View Details
        </button>
      ),
    },
  ];

  const handlePageChange = (page, pageSize) => {
    setPageIndex(page);
    setPageSize(pageSize);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Voucher List</h1>
      {loading ? (
        <Spin className="flex justify-center items-center" />
      ) : (
        <>
          <Table
            dataSource={vouchers}
            columns={columns}
            rowKey="vourcherID" // Corrected typo in rowKey
            pagination={false}
            className="shadow-lg rounded"
          />
          <div className="flex justify-end mt-4">
            <Pagination
              current={pageIndex}
              total={totalItems} // Total number of items across all pages
              pageSize={pageSize}
              showSizeChanger
              onChange={handlePageChange}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default VoucherList;
