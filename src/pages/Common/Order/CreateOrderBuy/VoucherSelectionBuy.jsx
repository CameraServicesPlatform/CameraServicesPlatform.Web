import { Card, Col, Form, Radio, Row } from "antd";
import React from "react";

const VoucherSelectionBuy = ({
  vouchers,
  selectedVoucher,
  setSelectedVoucher,
  handleVoucherSelect,
  selectedVoucherDetails,
}) => {
  const onCardClick = (voucherID) => {
    setSelectedVoucher(voucherID);
    handleVoucherSelect({ target: { value: voucherID } });
  };

  return (
    <Form.Item label="Chọn Voucher">
      <Radio.Group
        onChange={handleVoucherSelect}
        value={selectedVoucher}
        style={{ width: "100%" }}
      >
        <Row gutter={[16, 16]}>
          {vouchers.map((voucher) => (
            <Col span={8} key={voucher.productVoucherID}>
              <Card
                title={voucher.vourcherID}
                bordered={false}
                style={{
                  cursor: "pointer",
                  borderColor:
                    selectedVoucher === voucher.vourcherID
                      ? "#1890ff"
                      : "#f0f0f0",
                  backgroundColor:
                    selectedVoucher === voucher.vourcherID
                      ? "#e6f7ff"
                      : "#ffffff",
                  borderWidth: selectedVoucher === voucher.vourcherID ? 2 : 1,
                  boxShadow:
                    selectedVoucher === voucher.vourcherID
                      ? "0 4px 8px rgba(0, 0, 0, 0.1)"
                      : "none",
                  transition: "all 0.3s ease",
                }}
                onClick={() => onCardClick(voucher.vourcherID)}
              >
                <p>{voucher.vourcherID}</p>
                {selectedVoucher === voucher.vourcherID &&
                  selectedVoucherDetails && (
                    <>
                      <p>
                        <strong>Mã Voucher:</strong>{" "}
                        {selectedVoucherDetails.vourcherCode}
                      </p>
                      <p>
                        <strong>Mô tả:</strong>{" "}
                        {selectedVoucherDetails.description}
                      </p>
                    </>
                  )}
              </Card>
            </Col>
          ))}
        </Row>
      </Radio.Group>
    </Form.Item>
  );
};

export default VoucherSelectionBuy;
