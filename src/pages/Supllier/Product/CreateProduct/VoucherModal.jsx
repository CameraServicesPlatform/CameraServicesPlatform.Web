import React from "react";
import { Modal, Row, Col, Card } from "antd";

const VoucherModal = ({
  isVoucherModalVisible,
  setIsVoucherModalVisible,
  vouchers,
  selectedVoucher,
  handleVoucherSelect,
}) => {
  return (
    <Modal
      title="Chọn Voucher"
      visible={isVoucherModalVisible}
      onCancel={() => setIsVoucherModalVisible(false)}
      footer={null}
    >
      <Row gutter={[16, 16]}>
        {vouchers.map((voucher) => (
          <Col span={24} key={voucher.vourcherID}>
            <Card
              hoverable
              onClick={() => handleVoucherSelect(voucher)}
              className={`p-4 border ${
                selectedVoucher?.vourcherID === voucher.vourcherID
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300"
              }`}
            >
              <Card.Meta
                title={
                  <div style={{ whiteSpace: "normal", wordWrap: "break-word" }}>
                    {voucher.vourcherCode}
                  </div>
                }
                description={voucher.description}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </Modal>
  );
};

export default VoucherModal;