import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { Input, Modal, Pagination, Spin, Table } from "antd";
import React, { useEffect, useState } from "react";
import { getAllVouchers } from "../../../api/voucherApi"; // Import your API function

const VoucherList = () => {
  const [vouchers, setVouchers] = useState([]);
  const [originalVouchers, setOriginalVouchers] = useState([]); // Store original vouchers
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [visible, setVisible] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Search term state

  useEffect(() => {
    const fetchVouchers = async () => {
      setLoading(true);
      try {
        const response = await getAllVouchers(pageIndex, pageSize);
        if (response && response.isSuccess) {
          setVouchers(response.result);
          setOriginalVouchers(response.result); // Store original vouchers
          setTotal(response.result.length); // Update this if you have total count
        } else {
          console.error("Failed to fetch vouchers:", response.messages);
        }
      } catch (error) {
        console.error("Error fetching vouchers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVouchers();
  }, [pageIndex, pageSize]);

  const handleRowDoubleClick = (voucher) => {
    setSelectedVoucher(voucher);
    setVisible(true);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    if (value) {
      const filteredVouchers = originalVouchers.filter(
        (voucher) =>
          voucher.vourcherCode.toLowerCase().includes(value.toLowerCase()) ||
          voucher.description.toLowerCase().includes(value.toLowerCase())
      );
      setVouchers(filteredVouchers);
      setTotal(filteredVouchers.length);
    } else {
      setVouchers(originalVouchers);
      setTotal(originalVouchers.length);
    }
  };

  const columns = [
    {
      title: "Supplier ID",
      dataIndex: "supplierID",
      key: "supplierID",
    },
    {
      title: "Voucher ID",
      dataIndex: "vourcherID",
      key: "vourcherID",
    },
    {
      title: "Voucher Code",
      dataIndex: "vourcherCode",
      key: "vourcherCode",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Discount Amount",
      dataIndex: "discountAmount",
      key: "discountAmount",
      render: (text) => `${text} VND`,
    },
    {
      title: "Valid From",
      dataIndex: "validFrom",
      key: "validFrom",
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Expiration Date",
      dataIndex: "expirationDate",
      key: "expirationDate",
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Active",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive) =>
        isActive ? (
          <CheckCircleOutlined style={{ color: "green" }} />
        ) : (
          <CloseCircleOutlined style={{ color: "red" }} />
        ),
    },
  ];

  return (
    <div>
      <Input
        placeholder="Search by voucher code or description"
        onChange={(e) => handleSearch(e.target.value)}
        style={{ marginBottom: 16 }}
      />
      {loading ? (
        <Spin />
      ) : (
        <>
          <Table
            dataSource={vouchers}
            columns={columns}
            rowKey="vourcherID"
            pagination={false}
            onRow={(record) => ({
              onDoubleClick: () => handleRowDoubleClick(record), // Handle double click
            })}
          />
          <Pagination
            current={pageIndex}
            total={total}
            pageSize={pageSize}
            onChange={(page) => setPageIndex(page)}
            showSizeChanger
            onShowSizeChange={(current, size) => setPageSize(size)}
            style={{ marginTop: 16, textAlign: "right" }}
          />
          <Modal
            title="Voucher Details"
            visible={visible}
            onCancel={() => setVisible(false)}
            footer={null}
          >
            {selectedVoucher && (
              <div>
                <p>
                  <strong>Voucher Code:</strong> {selectedVoucher.vourcherCode}
                </p>
                <p>
                  <strong>Description:</strong> {selectedVoucher.description}
                </p>
                <p>
                  <strong>Discount Amount:</strong>{" "}
                  {selectedVoucher.discountAmount} VND
                </p>
                <p>
                  <strong>Valid From:</strong>{" "}
                  {new Date(selectedVoucher.validFrom).toLocaleDateString()}
                </p>
                <p>
                  <strong>Expiration Date:</strong>{" "}
                  {new Date(
                    selectedVoucher.expirationDate
                  ).toLocaleDateString()}
                </p>
                <p>
                  <strong>Active:</strong>{" "}
                  {selectedVoucher.isActive ? "Yes" : "No"}
                </p>
              </div>
            )}
          </Modal>
        </>
      )}
    </div>
  );
};

export default VoucherList;
