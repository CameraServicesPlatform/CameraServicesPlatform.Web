import { Button, Modal, Spin, Table } from "antd";
import React, { useEffect, useState } from "react";
import {
  getAllTransactions,
  getTransactionById,
} from "../../../api/transactionApi"; 

const TransactionType = {
  0: "Thanh toán",
  1: "Hoàn tiền",
};

const PaymentStatus = {
  0: "Đang chờ",
  1: "Hoàn thành",
  2: "Thất bại",
};

const PaymentMethod = {
  0: "VNPAY",
  1: "Thẻ tín dụng",
  2: "Chuyển khoản ngân hàng",
};

const VNPAYTransactionStatus = {
  0: "Thành công",
  1: "Thất bại",
  2: "Đang chờ",
};

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(10); 
  const [loading, setLoading] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      const data = await getAllTransactions(pageIndex, pageSize);
      if (data) {
        setTransactions(data.result);
      }
      setLoading(false);
    };

    fetchTransactions();
  }, [pageIndex, pageSize]);

  const handleNextPage = () => {
    setPageIndex((prevPageIndex) => prevPageIndex + 1);
  };

  const handlePreviousPage = () => {
    setPageIndex((prevPageIndex) => Math.max(prevPageIndex - 1, 1));
  };

  const handleRowDoubleClick = async (record) => {
    const data = await getTransactionById(record.transactionID);
    if (data) {
      setSelectedTransaction(data.result);
      setIsModalVisible(true);
    }
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedTransaction(null);
  };

  const columns = [
    {
      title: "Mã giao dịch",
      dataIndex: "transactionID",
      key: "transactionID",
    },
    {
      title: "Mã đơn hàng",
      dataIndex: "orderID",
      key: "orderID",
    },
    {
      title: "Ngày giao dịch",
      dataIndex: "transactionDate",
      key: "transactionDate",
    },
    {
      title: "Số tiền",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Loại giao dịch",
      dataIndex: "transactionType",
      key: "transactionType",
      render: (type) => TransactionType[type],
    },
    {
      title: "Trạng thái thanh toán",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (status) => PaymentStatus[status],
    },
    {
      title: "Phương thức thanh toán",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      render: (method) => PaymentMethod[method],
    },
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Danh sách giao dịch</h1>
      {loading ? (
        <div className="flex justify-center items-center">
          <Spin size="large" />
        </div>
      ) : (
        <div>
          <Table
            dataSource={transactions}
            columns={columns}
            rowKey="transactionID"
            pagination={false}
            onRow={(record) => ({
              onDoubleClick: () => handleRowDoubleClick(record),
            })}
          />
          <div className="flex justify-between items-center mt-4">
            <Button onClick={handlePreviousPage} disabled={pageIndex === 1}>
              Trước
            </Button>
            <span>Trang {pageIndex}</span>
            <Button onClick={handleNextPage}>Tiếp</Button>
          </div>
        </div>
      )}
      <Modal
        title="Chi tiết giao dịch"
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={[
          <Button key="close" onClick={handleModalClose}>
            Đóng
          </Button>,
        ]}
      >
        {selectedTransaction && (
          <div>
            <p>
              <strong>Mã giao dịch:</strong> {selectedTransaction.transactionID}
            </p>
            <p>
              <strong>Mã đơn hàng:</strong> {selectedTransaction.orderID}
            </p>
            <p>
              <strong>Ngày giao dịch:</strong>{" "}
              {selectedTransaction.transactionDate}
            </p>
            <p>
              <strong>Số tiền:</strong> {selectedTransaction.amount}
            </p>
            <p>
              <strong>Loại giao dịch:</strong>{" "}
              {TransactionType[selectedTransaction.transactionType]}
            </p>
            <p>
              <strong>Trạng thái thanh toán:</strong>{" "}
              {PaymentStatus[selectedTransaction.paymentStatus]}
            </p>
            <p>
              <strong>Phương thức thanh toán:</strong>{" "}
              {PaymentMethod[selectedTransaction.paymentMethod]}
            </p>
            <p>
              <strong>Mã giao dịch VNPAY:</strong>{" "}
              {selectedTransaction.vnpayTransactionID}
            </p>
            <p>
              <strong>Trạng thái giao dịch VNPAY:</strong>{" "}
              {
                VNPAYTransactionStatus[
                  selectedTransaction.vnpayTransactionStatus
                ]
              }
            </p>
            <p>
              <strong>Thời gian giao dịch VNPAY:</strong>{" "}
              {selectedTransaction.vnpayTransactionTime}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TransactionList;
