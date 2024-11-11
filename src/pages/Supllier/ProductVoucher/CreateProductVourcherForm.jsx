import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Row,
} from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getSupplierIdByAccountId } from "../../../api/accountApi";
import { createVoucher } from "../../../api/voucherApi";

const CreateVoucherFormBySuplier = () => {
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.user.user || {});
  const [supplierId, setSupplierId] = useState(null);

  useEffect(() => {
    const fetchSupplierId = async () => {
      if (user.id) {
        try {
          const response = await getSupplierIdByAccountId(user.id);
          if (response?.isSuccess) {
            setSupplierId(response.result);
          } else {
            message.error("Lấy mã nhà cung cấp không thành công.");
          }
        } catch (error) {
          message.error("Lỗi khi lấy mã nhà cung cấp.");
        }
      }
    };

    fetchSupplierId();
  }, [user.id]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await createVoucher({
        supplierID: supplierId,
        voucherCode: values.voucherCode,
        discountAmount: values.discountAmount,
        description: values.description,
        validFrom: values.validFrom,
        expirationDate: values.expirationDate,
      });
      if (response.isSuccess) {
        message.success("Tạo voucher thành công!");
      } else {
        message.error(response.messages.join(", "));
      }
    } catch (error) {
      message.error("Lỗi khi tạo voucher.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row justify="center">
      <Col span={12}>
        <Card title="Tạo Voucher" bordered={false}>
          {/* Supplier Image and Name */}
          <Row gutter={[16, 16]} justify="start" align="middle">
            <Col span={24} style={{ display: "flex", alignItems: "center" }}>
              <img
                src="supplier-image-url" // Replace with actual image URL
                alt="Supplier"
                style={{ width: 50, height: 50, marginRight: 16 }}
              />
              <span style={{ fontSize: "16px", fontWeight: "bold" }}>
                Supplier Name
              </span>
            </Col>
          </Row>

          {/* Form Layout */}
          <Form onFinish={onFinish} layout="vertical">
            {/* Voucher Code and Discount Amount */}
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Form.Item
                  name="voucherCode"
                  label="Mã Voucher"
                  rules={[
                    { required: true, message: "Vui lòng nhập mã voucher!" },
                  ]}
                >
                  <Input placeholder="Nhập mã voucher" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="discountAmount"
                  label="Số Tiền Giảm"
                  rules={[
                    { required: true, message: "Vui lòng nhập số tiền giảm!" },
                  ]}
                >
                  <InputNumber
                    min={0}
                    style={{ width: "100%" }}
                    placeholder="Nhập số tiền giảm"
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* Description and Valid From */}
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Form.Item
                  name="description"
                  label="Mô Tả"
                  rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
                >
                  <Input.TextArea rows={4} placeholder="Nhập mô tả voucher" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="validFrom"
                  label="Ngày Bắt Đầu"
                  rules={[
                    { required: true, message: "Vui lòng chọn ngày bắt đầu!" },
                  ]}
                >
                  <DatePicker
                    showTime
                    style={{ width: "100%" }}
                    placeholder="Chọn ngày bắt đầu"
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* Expiration Date */}
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Form.Item
                  name="expirationDate"
                  label="Ngày Hết Hạn"
                  rules={[
                    { required: true, message: "Vui lòng chọn ngày hết hạn!" },
                  ]}
                >
                  <DatePicker
                    showTime
                    style={{ width: "100%" }}
                    placeholder="Chọn ngày hết hạn"
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* Submit Button */}
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                style={{ backgroundColor: "#1890ff", borderColor: "#1890ff" }}
              >
                Tạo Voucher
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default CreateVoucherFormBySuplier;
