import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { Input, Modal, Pagination, Spin, Table } from "antd";
import React, { useEffect, useState } from "react";
import { getAllVouchers } from "../../../api/voucherApi";  
import moment from "moment";

const VoucherList = () => {
  const [vouchers, setVouchers] = useState([]);
  const [originalVouchers, setOriginalVouchers] = useState([]);  
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [visible, setVisible] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); 

  useEffect(() => {
    const fetchVouchers = async () => {
      setLoading(true);
      try {
        const response = await getAllVouchers(pageIndex, pageSize);
        if (response && response.isSuccess) {
          setVouchers(response.result);
          setOriginalVouchers(response.result);  
          setTotal(response.result.length);  
        } else {
          console.error("Không thể tải danh sách voucher:", response.messages);
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách voucher:", error);
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
      title: "Mã voucher",
      dataIndex: "vourcherCode",
      key: "vourcherCode",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Số tiền giảm giá",
      dataIndex: "discountAmount",
      key: "discountAmount",
      render: (text) => `${text} VND`,
    },

    {
      title: "Hiệu lực từ",
      dataIndex: "validFrom",
      key: "validFrom",
      render: (text) => moment(text).format("DD-MM-YYYY HH:mm"),
    },
    {
      title: "Ngày hết hạn",
      dataIndex: "expirationDate",
      key: "expirationDate",
      render: (text) => moment(text).format("DD-MM-YYYY HH:mm"),
    },
    {
      title: "Hoạt động",
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
        placeholder="Tìm kiếm theo mã voucher hoặc mô tả"
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
            title="Chi tiết voucher"
            visible={visible}
            onCancel={() => setVisible(false)}
            footer={null}
          >
            {selectedVoucher && (
              <div>
                <p>
                  <strong>Mã voucher:</strong> {selectedVoucher.vourcherCode}
                </p>
                <p>
                  <strong>Mô tả:</strong> {selectedVoucher.description}
                </p>
                <p>
                  <strong>Số tiền giảm giá:</strong>
                  {selectedVoucher.discountAmount} VND
                </p>
                <p>
                  <strong>Hiệu lực từ:</strong>
                  {new Date(selectedVoucher.validFrom).toLocaleDateString()}
                </p>
                <p>
                  <strong>Ngày hết hạn:</strong>
                  {new Date(
                    selectedVoucher.expirationDate
                  ).toLocaleDateString()}
                </p>
                <p>
                  <strong>Hoạt động:</strong>
                  {selectedVoucher.isActive ? "Có" : "Không"}
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
