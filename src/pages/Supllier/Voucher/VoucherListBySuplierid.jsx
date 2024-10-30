import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EditOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Pagination,
  Spin,
  Switch,
  Table,
} from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getSupplierIdByAccountId } from "../../../api/accountApi";
import {
  getVouchersBySupplierId,
  updateVoucher,
} from "../../../api/voucherApi";

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
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [form] = Form.useForm();

  const fetchSupplierId = async () => {
    if (user.id) {
      try {
        const response = await getSupplierIdByAccountId(user.id);
        console.log("Supplier ID Response:", response); // Debugging log
        if (response?.isSuccess) {
          setSupplierId(response.result);
        } else {
          message.error("Failed to get Supplier ID.");
        }
      } catch (error) {
        message.error("Error fetching Supplier ID.");
      }
    }
  };

  const fetchVouchers = async (pageIndex, pageSize, supplierId) => {
    if (!supplierId) return;
    setLoading(true);
    try {
      const response = await getVouchersBySupplierId(
        supplierId,
        pageIndex,
        pageSize
      );
      console.log("Vouchers Response:", response); // Debugging log
      if (response) {
        setVouchers(response || []);
        setTotalItems(response.length);
        console.log("Vouchers State:", response); // Debugging log
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
    fetchVouchers(page, pageSize, supplierId);
  };

  useEffect(() => {
    fetchSupplierId();
  }, [user]);

  useEffect(() => {
    if (supplierId) {
      fetchVouchers(pageIndex, pageSize, supplierId);
    }
  }, [supplierId, pageIndex, pageSize]);

  const handleViewDetails = (voucher) => {
    setSelectedVoucher(voucher);
    setViewModalVisible(true);
  };

  const handleUpdateVoucher = async () => {
    try {
      const values = await form.validateFields();
      const updatedVoucher = await updateVoucher({
        ...values,
        expirationDate: values.expirationDate
          ? values.expirationDate.toISOString()
          : null,
      });
      setVouchers((prevVouchers) =>
        prevVouchers.map((v) =>
          v.vourcherID === updatedVoucher.vourcherID ? updatedVoucher : v
        )
      );
      message.success("Voucher updated successfully.");
      setUpdateModalVisible(false);
    } catch (error) {
      console.error("Error updating voucher:", error);
      message.error("Failed to update voucher. Please try again.");
    }
  };

  const handleOpenUpdateModal = (voucher) => {
    setSelectedVoucher(voucher);
    form.setFieldsValue({
      vourcherID: voucher.vourcherID,
      description: voucher.description,
      expirationDate: voucher.expirationDate
        ? dayjs(voucher.expirationDate)
        : null,
      isActive: voucher.isActive,
    });
    setUpdateModalVisible(true);
  };

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
        <>
          <Button
            onClick={() => handleViewDetails(record)}
            icon={<EyeOutlined />}
          >
            View Details
          </Button>
          <Button
            onClick={() => handleOpenUpdateModal(record)}
            icon={<EditOutlined />}
          >
            Update
          </Button>
        </>
      ),
    },
  ];

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

      {selectedVoucher && (
        <Modal
          title="Update Voucher"
          visible={updateModalVisible}
          onOk={handleUpdateVoucher}
          onCancel={() => setUpdateModalVisible(false)}
        >
          <Form form={form} layout="vertical">
            <Form.Item name="vourcherID" label="Voucher ID">
              <Input disabled />
            </Form.Item>
            <Form.Item
              name="description"
              label="Description"
              rules={[
                { required: true, message: "Please enter a description" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="expirationDate"
              label="Expiration Date"
              rules={[
                { required: true, message: "Please select an expiration date" },
              ]}
            >
              <DatePicker showTime />
            </Form.Item>
            <Form.Item
              name="isActive"
              label="Is Active"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Form>
        </Modal>
      )}
    </div>
  );
};

export default VoucherListBySupplierId;
