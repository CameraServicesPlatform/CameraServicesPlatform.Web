import { Card, Col, Form, Radio, Row } from "antd";
import React from "react";

const VoucherSelection = ({
  vouchers,
  selectedVoucher,
  setSelectedVoucher,
}) => (
  <Form.Item label="Chọn Voucher">
    <Radio.Group
      onChange={(e) => setSelectedVoucher(e.target.value)}
      value={selectedVoucher}
      style={{ width: "100%" }}
    >
      <Row gutter={[16, 16]}>
        {vouchers.map((voucher) => (
          <Col span={8} key={voucher.voucherID}>
            <Card
              title={voucher.voucherCode}
              bordered={false}
              style={{
                cursor: "pointer",
                borderColor:
                  selectedVoucher === voucher.voucherID ? "#1890ff" : "#f0f0f0",
                backgroundColor:
                  selectedVoucher === voucher.voucherID ? "#e6f7ff" : "#ffffff",
                borderWidth: selectedVoucher === voucher.voucherID ? 2 : 1,
                boxShadow:
                  selectedVoucher === voucher.voucherID
                    ? "0 4px 8px rgba(0, 0, 0, 0.1)"
                    : "none",
                transition: "all 0.3s ease",
              }}
              onClick={() => setSelectedVoucher(voucher.voucherID)}
            >
              <p>{voucher.description}</p>
              {selectedVoucher === voucher.voucherID && (
                <>
                  <p>
                    <strong>Giảm giá:</strong> {voucher.discountAmount}
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

export default VoucherSelection;
