import { Card, Col, Form, Radio, Row, message } from "antd";
import React, { useEffect, useState } from "react";
import { getVoucherById } from "../../../../api/voucherApi"; // Adjust the import path as needed

const VoucherSelection = ({
  vouchers,
  selectedVoucher,
  setSelectedVoucher,
  handleVoucherSelect,
  selectedVoucherDetails,
}) => {
  const [vourcherCodes, setVoucherCodes] = useState({});

  useEffect(() => {
    const fetchVoucherCodes = async () => {
      const codes = {};
      for (const voucher of vouchers) {
        try {
          const details = await getVoucherById(voucher.vourcherID);
          console.log(
            "Fetched details for voucherID:",
            voucher.vourcherID,
            details
          ); // Log the fetched details
          codes[voucher.vourcherID] = details.vourcherCode;
        } catch (error) {
          message.error("Failed to fetch voucher details.");
        }
      }
      setVoucherCodes(codes);
    };

    fetchVoucherCodes();
  }, [vouchers]);
useEffect(() => {
  if (!selectedVoucher) {
    handleVoucherSelect({ target: { value: null } });
  }
}, [selectedVoucher, handleVoucherSelect]);
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
          {vouchers.map((voucher) => {
            const vourcherCode =
              vourcherCodes[voucher.vourcherID] || voucher.vourcherID;
            console.log("vourcherCode", vourcherCode); // Log the voucher code

            return (
              <Col span={8} key={voucher.productVoucherID}>
                <Card
                  title={vourcherCode}
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
            );
          })}
        </Row>
      </Radio.Group>
    </Form.Item>
  );
};

export default VoucherSelection;
