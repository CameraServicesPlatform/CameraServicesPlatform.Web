import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EditOutlined,
  EyeOutlined,
  SearchOutlined,
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
  const [searchText, setSearchText] = useState("");
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

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const filteredVouchers = vouchers.filter((voucher) =>
    voucher.vourcherCode.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: "Mã Voucher",
      dataIndex: "vourcherID",
      key: "vourcherID",
      sorter: (a, b) => a.vourcherID.localeCompare(b.vourcherID),
    },
    {
      title: "Mã Giảm Giá",
      dataIndex: "vourcherCode",
      key: "vourcherCode",
      sorter: (a, b) => a.vourcherCode.localeCompare(b.vourcherCode),
    },
    {
      title: "Mô Tả",
      dataIndex: "description",
      key: "description",
      sorter: (a, b) => a.description.localeCompare(b.description),
    },
    {
      title: "Giá Trị Giảm Giá",
      dataIndex: "discountAmount",
      key: "discountAmount",
      sorter: (a, b) => a.discountAmount - b.discountAmount,
    },
    {
      title: "Ngày Bắt Đầu",
      dataIndex: "validFrom",
      key: "validFrom",
      sorter: (a, b) => dayjs(a.validFrom).unix() - dayjs(b.validFrom).unix(),
    },
    {
      title: "Ngày Hết Hạn",
      dataIndex: "expirationDate",
      key: "expirationDate",
      sorter: (a, b) =>
        dayjs(a.expirationDate).unix() - dayjs(b.expirationDate).unix(),
    },
    {
      title: "Trạng Thái",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive) =>
        isActive ? (
          <CheckCircleOutlined style={{ color: "green" }} />
        ) : (
          <CloseCircleOutlined style={{ color: "red" }} />
        ),
      sorter: (a, b) => a.isActive - b.isActive,
    },
    {
      title: "Ngày Tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
    },
    {
      title: "Ngày Cập Nhật",
      dataIndex: "updatedAt",
      key: "updatedAt",
      sorter: (a, b) => dayjs(a.updatedAt).unix() - dayjs(b.updatedAt).unix(),
    },
    {
      title: "Hành Động",
      render: (_, record) => (
        <>
          <Button
            onClick={() => handleViewDetails(record)}
            icon={<EyeOutlined />}
          >
            Xem Chi Tiết
          </Button>
          <Button
            onClick={() => handleOpenUpdateModal(record)}
            icon={<EditOutlined />}
          >
            Cập Nhật
          </Button>
        </>
      ),
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Danh sách vourcher</h1>
      <Input
        placeholder="Search by Voucher Code"
        prefix={<SearchOutlined />}
        value={searchText}
        onChange={handleSearch}
        style={{ marginBottom: 16 }}
      />
      {loading ? (
        <Spin className="flex justify-center items-center" />
      ) : (
        <>
          {filteredVouchers.length > 0 ? (
            <>
              <Table
                dataSource={filteredVouchers}
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
            <div>Khongo có dữ liệu!</div>
          )}
        </>
      )}
      {selectedVoucher && (
        <Modal
          title="Chi Tiết Voucher"
          visible={viewModalVisible}
          onCancel={() => setViewModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setViewModalVisible(false)}>
              Đóng
            </Button>,
          ]}
        >
          <p>
            <strong>Mã Giảm Giá:</strong> {selectedVoucher.vourcherCode}
          </p>
          <p>
            <strong>Mô Tả:</strong> {selectedVoucher.description}
          </p>
          <p>
            <strong>Giá Trị Giảm Giá:</strong> {selectedVoucher.discountAmount}
          </p>
          <p>
            <strong>Ngày Bắt Đầu:</strong> {selectedVoucher.validFrom}
          </p>
          <p>
            <strong>Ngày Hết Hạn:</strong> {selectedVoucher.expirationDate}
          </p>
          <p>
            <strong>Trạng Thái:</strong>
            {selectedVoucher.isActive ? (
              <CheckCircleOutlined style={{ color: "green" }} />
            ) : (
              <CloseCircleOutlined style={{ color: "red" }} />
            )}
          </p>
          <p>
            <strong>Ngày Tạo:</strong> {selectedVoucher.createdAt}
          </p>
          <p>
            <strong>Ngày Cập Nhật:</strong> {selectedVoucher.updatedAt}
          </p>
        </Modal>
      )}
      {selectedVoucher && (
        <Modal
          title="Cập Nhật Voucher"
          visible={updateModalVisible}
          onOk={handleUpdateVoucher}
          onCancel={() => setUpdateModalVisible(false)}
        >
          <Form form={form} layout="vertical">
            <Form.Item name="vourcherID" label="Mã Voucher">
              <Input disabled />
            </Form.Item>
            <Form.Item
              name="description"
              label="Mô Tả"
              rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="expirationDate"
              label="Ngày Hết Hạn"
              rules={[
                { required: true, message: "Vui lòng chọn ngày hết hạn" },
              ]}
            >
              <DatePicker showTime />
            </Form.Item>
            <Form.Item
              name="isActive"
              label="Trạng Thái Kích Hoạt"
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
