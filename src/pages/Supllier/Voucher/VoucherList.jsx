import { Button, Modal, Pagination, Spin, Table, message } from "antd";
import React, { useEffect, useState } from "react";
import {
  deleteVoucher,
  getAllVouchers,
  getVoucherById,
} from "../../../api/voucherApi";

const VoucherList = () => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedVoucher, setSelectedVoucher] = useState(null); // For viewing/updating a voucher
  const [viewModalVisible, setViewModalVisible] = useState(false); // Modal visibility

  useEffect(() => {
    fetchVouchers(pageIndex, pageSize);
  }, [pageIndex, pageSize]);

  const fetchVouchers = async (pageIndex, pageSize) => {
    setLoading(true);
    try {
      const data = await getAllVouchers(pageIndex, pageSize);
      if (data) {
        setVouchers(data);
        setTotalItems(data.length); // Adjust if the API provides a total count
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

  const handleViewDetails = async (id) => {
    try {
      const voucher = await getVoucherById(id);
      if (voucher) {
        setSelectedVoucher(voucher); // Store voucher details for display
        setViewModalVisible(true); // Show the modal
      } else {
        message.error("Failed to fetch voucher details.");
      }
    } catch (error) {
      message.error("Error fetching voucher details.");
    }
  };

  const handleDeleteVoucher = async (id) => {
    try {
      await deleteVoucher(id);
      message.success("Voucher deleted successfully.");
      fetchVouchers(pageIndex, pageSize); // Refresh list after deletion
    } catch (error) {
      message.error("Error deleting voucher.");
    }
  };

  const columns = [
    { title: "Voucher ID", dataIndex: "vourcherID" },
    { title: "Supplier ID", dataIndex: "supplierID" },
    { title: "Voucher Code", dataIndex: "vourcherCode" },
    { title: "Description", dataIndex: "description" },
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
        <div>
          <button
            onClick={() => handleViewDetails(record.vourcherID)}
            className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 mr-2"
          >
            View Details
          </button>
          <button
            onClick={() => handleDeleteVoucher(record.vourcherID)}
            className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
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
            rowKey="vourcherID"
            pagination={false}
            className="shadow-lg rounded"
          />
          <div className="flex justify-end mt-4">
            <Pagination
              current={pageIndex}
              total={totalItems}
              pageSize={pageSize}
              showSizeChanger
              onChange={handlePageChange}
            />
          </div>
        </>
      )}

      {/* Modal for viewing details */}
      {selectedVoucher && (
        <Modal
          title="Voucher Details"
          visible={viewModalVisible}
          onCancel={() => setViewModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setViewModalVisible(false)}>
              Close
            </Button>,
          ]}
        >
          <p>
            <strong>ID:</strong> {selectedVoucher.vourcherID}
          </p>
          <p>
            <strong>Code:</strong> {selectedVoucher.vourcherCode}
          </p>
          <p>
            <strong>Description:</strong> {selectedVoucher.description}
          </p>
          <p>
            <strong>Discount Amount:</strong> {selectedVoucher.discountAmount}{" "}
            VND
          </p>
          <p>
            <strong>Valid From:</strong>{" "}
            {new Date(selectedVoucher.validFrom).toLocaleDateString()}
          </p>
          <p>
            <strong>Expiration Date:</strong>{" "}
            {new Date(selectedVoucher.expirationDate).toLocaleDateString()}
          </p>
          <p>
            <strong>Is Active:</strong>{" "}
            {selectedVoucher.isActive ? "Yes" : "No"}
          </p>
        </Modal>
      )}
    </div>
  );
};

export default VoucherList;
