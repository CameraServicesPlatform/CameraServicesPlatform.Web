import {
  DollarOutlined,
  FileTextOutlined,
  InfoCircleOutlined,
  PictureOutlined,
  TagOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Descriptions,
  Form,
  InputNumber,
  Row,
  Select,
  Spin,
  message,
} from "antd";
import moment from "moment";
import React, { useEffect } from "react";

const { Option } = Select;

const ProductDetailsInfoRent = ({
  product,
  contractTemplate,
  durationUnit,
  setDurationUnit,
  durationValue,
  setDurationValue,
  productPriceRent,
  setProductPriceRent,
  loading,
  showContractTerms,
  toggleContractTerms,
  rentalStartDate,
  setRentalStartDate,
  rentalEndDate,
  setRentalEndDate,
}) => {
  const pricePerHour = product.pricePerHour;
  const pricePerDay = product.pricePerDay;
  const pricePerWeek = product.pricePerWeek;
  const pricePerMonth = product.pricePerMonth;

  const durationOptions = {
    hour: { min: 2, max: 8 },
    day: { min: 1, max: 3 },
    week: { min: 1, max: 2 },
    month: { min: 1, max: 1 },
  };

  const calculateProductPriceRent = () => {
    if (!durationOptions[durationUnit]) {
      message.error("Invalid duration unit");
      return;
    }

    const { min, max } = durationOptions[durationUnit];
    if (durationValue < min || durationValue > max) {
      message.error(
        `Invalid duration value. Please choose between ${min} and ${max}.`
      );
      return;
    }

    let price = 0;
    switch (durationUnit) {
      case "hour":
        price = durationValue * pricePerHour;
        break;
      case "day":
        price = durationValue * pricePerDay;
        break;
      case "week":
        price = durationValue * pricePerWeek;
        break;
      case "month":
        price = durationValue * pricePerMonth;
        break;
      default:
        price = 0;
    }

    setProductPriceRent(price);
  };

  const calculateRentalEndDate = (startDate) => {
    if (!startDate || !durationUnit || !durationValue) return null;

    let endDate;
    switch (durationUnit) {
      case "hour":
        endDate = moment(startDate + durationValue).add(durationValue, "hours");
        break;
      case "day":
        endDate = moment(startDate + durationValue).add(durationValue, "days");
        break;
      case "week":
        endDate = moment(startDate + durationValue).add(durationValue, "weeks");
        break;
      case "month":
        endDate = moment(startDate + durationValue).add(
          durationValue,
          "months"
        );
        break;
      default:
        endDate = startDate;
    }
    return endDate;
  };
  const handleDurationValueChange = (value) => {
    if (durationUnit === "hour" && value > 13) {
      message.warning(
        "Thời gian thuê theo giờ không được vượt quá 13 giờ. Vui lòng thuê theo ngày."
      );
      setDurationValue(13); // Set to maximum allowed hours
    } else {
      setDurationValue(value);
    }
  };
  useEffect(() => {
    if (durationUnit && durationValue) {
      calculateProductPriceRent();
      const endDate = calculateRentalEndDate(rentalStartDate);
      setRentalEndDate(endDate);
    }
  }, [durationUnit, durationValue, rentalStartDate]);

  const handleDurationUnitChange = (value) => {
    setDurationUnit(value);
    setDurationValue(durationOptions[value].min); // Set default value to min
    const { min, max } = durationOptions[value];
    message.info(`You need to choose between ${min} and ${max}.`);
  };

  const handleRentalStartDateChange = (date) => {
    const startHour = moment(date).hour();
    if (startHour > 7 || startHour >= 20) {
      message.error("Thời gian bắt đầu thuê phải trong khoảng 7:00 - 20:00.");
      setRentalStartDate(null);
      setRentalEndDate(null);
      return;
    }

    const endDate = calculateRentalEndDate(date);
    const endHour = moment(endDate).hour();
    if (endHour < 7 || endHour >= 20) {
      message.warning(
        "Thời gian thuê vượt quá khung giờ hoạt động (7:00 - 20:00). Vui lòng thuê theo ngày hoặc chọn thời gian khác."
      );
      setRentalStartDate(null);
      setRentalEndDate(null);
      return;
    }

    setRentalStartDate(date);
    setRentalEndDate(endDate);
  };
  return (
    <Card
      title="Thông tin sản phẩm"
      bordered={false}
      style={{ marginBottom: "24px" }}
    >
      {loading ? (
        <Spin tip="Đang tải thông tin sản phẩm..." />
      ) : product ? (
        <>
          <Row gutter={16}>
            <Col span={12}>
              <Descriptions column={1} bordered>
                <Descriptions.Item
                  label={
                    <span>
                      <TagOutlined /> Mã sản phẩm
                    </span>
                  }
                >
                  {product.productID}
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <span>
                      <InfoCircleOutlined /> Tên
                    </span>
                  }
                >
                  {product.productName}
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <span>
                      <FileTextOutlined /> Mô tả
                    </span>
                  }
                >
                  {product.productDescription}
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <span>
                      <FileTextOutlined /> Cọc sản phẩm
                    </span>
                  }
                >
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(product.depositProduct)}
                </Descriptions.Item>

                <Descriptions.Item
                  label={
                    <span>
                      <DollarOutlined /> Giá thuê
                    </span>
                  }
                >
                  <div style={{ color: "#52c41a" }}>
                    <strong>Giờ: </strong>
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(product.pricePerHour)}
                  </div>
                  <div style={{ color: "#1890ff" }}>
                    <strong>Ngày:</strong>
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(product.pricePerDay)}
                  </div>
                  <div style={{ color: "#faad14" }}>
                    <strong>Tuần:</strong>
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(product.pricePerWeek)}
                  </div>
                  <div style={{ color: "#f5222d" }}>
                    <strong>Tháng:</strong>
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(product.pricePerMonth)}
                  </div>
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <span>
                      <InfoCircleOutlined /> Chất lượng
                    </span>
                  }
                >
                  {product.quality}
                </Descriptions.Item>
              </Descriptions>
            </Col>
            <Col span={12}>
              <Card
                title={
                  <span>
                    <PictureOutlined /> Hình ảnh sản phẩm
                  </span>
                }
                bordered={false}
              >
                <div className="flex flex-wrap mt-2">
                  {product.listImage && product.listImage.length > 0 ? (
                    product.listImage.map((imageObj, index) => (
                      <img
                        key={imageObj.productImagesID}
                        src={imageObj.image}
                        alt={`Hình ảnh sản phẩm ${index + 1}`}
                        className="w-24 h-24 mr-2 mb-2 object-cover"
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                          margin: "4px",
                        }}
                      />
                    ))
                  ) : (
                    <p>Không có hình ảnh cho sản phẩm này.</p>
                  )}
                </div>
              </Card>
            </Col>
          </Row>
          <Form layout="vertical" style={{ marginTop: "24px" }}>
            <Card
              title="Tính giá thuê"
              bordered={false}
              style={{ width: "100%" }}
            >
              <Form.Item label="Đơn vị thời gian" style={{ width: "100%" }}>
                <Select
                  value={durationUnit}
                  onChange={handleDurationUnitChange}
                  style={{ width: "100%" }}
                >
                  <Option value="hour">Giờ</Option>
                  <Option value="day">Ngày</Option>
                  <Option value="week">Tuần</Option>
                  <Option value="month">Tháng</Option>
                </Select>
              </Form.Item>
              <Form.Item label="Giá trị thời gian" style={{ width: "100%" }}>
                <InputNumber
                  min={durationUnit ? durationOptions[durationUnit].min : 0}
                  max={durationUnit ? durationOptions[durationUnit].max : 0}
                  value={durationValue}
                  onChange={handleDurationValueChange}
                  disabled={!durationUnit}
                  style={{ width: "100%" }}
                />
              </Form.Item>

              <Form.Item label="Ngày bắt đầu thuê" style={{ width: "100%" }}>
                <DatePicker
                  showTime
                  value={rentalStartDate}
                  onChange={handleRentalStartDateChange}
                  style={{ width: "100%" }}
                />
              </Form.Item>
              <Form.Item label="Ngày kết thúc thuê" style={{ width: "100%" }}>
                <DatePicker
                  showTime
                  value={rentalEndDate}
                  disabled
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Card>
            <div
              style={{ marginTop: "16px", width: "100%", textAlign: "center" }}
            >
              <Card
                bordered={false}
                style={{
                  backgroundColor: "#f6f8fa",
                  padding: "16px",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                }}
              >
                <strong style={{ fontSize: "16px", color: "#333" }}>
                  Giá thuê sản phẩm:
                </strong>
                <div
                  style={{
                    fontSize: "24px",
                    color: "#52c41a",
                    marginTop: "8px",
                  }}
                >
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(productPriceRent)}
                </div>
              </Card>
            </div>
          </Form>

          <Button
            type="link"
            onClick={toggleContractTerms}
            style={{ marginTop: "16px" }}
          >
            {showContractTerms
              ? "Ẩn điều khoản hợp đồng"
              : "Hiển thị điều khoản hợp đồng"}
          </Button>
          {showContractTerms &&
            contractTemplate &&
            contractTemplate.length > 0 && (
              <Card
                title="Điều khoản hợp đồng"
                bordered={false}
                style={{ marginTop: "24px" }}
              >
                <Row gutter={16}>
                  <Col span={24}>
                    <Descriptions column={1} bordered>
                      {contractTemplate.map((item) => (
                        <Descriptions.Item
                          key={item.contractTemplateID}
                          label={
                            <span>
                              <FileTextOutlined /> {item.templateName}
                            </span>
                          }
                        >
                          <p>
                            <strong>Điều khoản hợp đồng:</strong>
                            {item.contractTerms}
                          </p>
                          <p>
                            <strong>Chính sách phạt:</strong>
                            {item.penaltyPolicy}
                          </p>
                          <p>
                            <strong>Chi tiết mẫu:</strong>
                            {item.templateDetails}
                          </p>
                        </Descriptions.Item>
                      ))}
                    </Descriptions>
                  </Col>
                </Row>
              </Card>
            )}
        </>
      ) : (
        <p>Không tìm thấy thông tin sản phẩm.</p>
      )}
    </Card>
  );
};

export default ProductDetailsInfoRent;
