import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { Button, message, Modal, Pagination, Spin, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getSupplierIdByAccountId } from "../../../api/accountApi"; // Make sure this is the correct import path
import { getVouchersBySupplierId } from "../../../api/voucherApi";

const VoucherListBySupplierId = () => {
  const user = useSelector((state) => state.user.user || {});
  const [supplierId, setSupplierId] = useState(null);
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);

  const fetchSupplierId = async () => {
    if (user.id) {
      // Use user.id for accountId
      try {
        const response = await getSupplierIdByAccountId(user.id); // Pass accountId
        if (response?.isSuccess) {
          setSupplierId(response.result); // Set supplierId from the API response
        } else {
          message.error("Failed to get Supplier ID.");
        }
      } catch (error) {
        message.error("Error fetching Supplier ID.");
      }
    }
  };

  const fetchVouchers = async (pageIndex, pageSize, supplierId) => {
    setLoading(true);
    try {
      const response = await getVouchersBySupplierId(
        supplierId,
        pageIndex,
        pageSize
      );
      if (response?.isSuccess && response.result) {
        setVouchers(response.result.items);
        setTotalItems(response.result.totalItems);
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

  const handlePageChange = (page, pageSize) => {
    setPageIndex(page);
    setPageSize(pageSize);
    if (supplierId) {
      fetchVouchers(page, pageSize, supplierId);
    }
  };

  useEffect(() => {
    fetchSupplierId(); // Fetch supplier ID when component mounts
  }, [user]);

  useEffect(() => {
    if (supplierId) {
      fetchVouchers(pageIndex, pageSize, supplierId); // Fetch vouchers when supplierId changes
    }
  }, [supplierId, pageIndex, pageSize]);

  const columns = [
    { title: "Voucher ID", dataIndex: "vourcherID", key: "vourcherID" },
    { title: "Voucher Code", dataIndex: "vourcherCode", key: "vourcherCode" },
    { title: "Description", dataIndex: "description", key: "description" },
    {
      title: "Discount Amount",
      dataIndex: "discountAmount",
      key: "discountAmount",
    },
    { title: "Valid From", dataIndex: "validFrom", key: "validFrom" },
    {
      title: "Expiration Date",
      dataIndex: "expirationDate",
      key: "expirationDate",
    },
    {
      title: "Is Active",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive) =>
        isActive ? (
          <CheckCircleOutlined style={{ color: "green" }} />
        ) : (
          <CloseCircleOutlined style={{ color: "red" }} />
        ),
    },
    { title: "Created At", dataIndex: "createdAt", key: "createdAt" },
    { title: "Updated At", dataIndex: "updatedAt", key: "updatedAt" },
    {
      title: "Action",
      render: (_, record) => (
        <Button onClick={() => handleViewDetails(record)}>View Details</Button>
      ),
    },
  ];

  const handleViewDetails = (voucher) => {
    setSelectedVoucher(voucher);
    setViewModalVisible(true);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Voucher List</h1>
      {loading ? (
        <Spin className="flex justify-center items-center" />
      ) : (
        <>
          {vouchers.length > 0 ? (
            <>
              <Table
                dataSource={vouchers}
                columns={columns}
                rowKey="vourcherID" // Ensure each row has a unique key
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
          ) : (
            <div>No data</div>
          )}
        </>
      )}

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
            <strong>Voucher Code:</strong> {selectedVoucher.vourcherCode}
          </p>
          <p>
            <strong>Description:</strong> {selectedVoucher.description}
          </p>
          <p>
            <strong>Discount Amount:</strong> {selectedVoucher.discountAmount}
          </p>
          <p>
            <strong>Valid From:</strong> {selectedVoucher.validFrom}
          </p>
          <p>
            <strong>Expiration Date:</strong> {selectedVoucher.expirationDate}
          </p>
          <p>
            <strong>Is Active:</strong>{" "}
            {selectedVoucher.isActive ? (
              <CheckCircleOutlined style={{ color: "green" }} />
            ) : (
              <CloseCircleOutlined style={{ color: "red" }} />
            )}
          </p>
          <p>
            <strong>Created At:</strong> {selectedVoucher.createdAt}
          </p>
          <p>
            <strong>Updated At:</strong> {selectedVoucher.updatedAt}
          </p>
        </Modal>
      )}
    </div>
  );
};

export default VoucherListBySupplierId;
