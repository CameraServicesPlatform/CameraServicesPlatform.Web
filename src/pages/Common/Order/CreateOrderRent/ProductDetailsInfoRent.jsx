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
  returnDate,
  setReturnDate,
}) => {
  const pricePerHour = product.pricePerHour;
  const pricePerDay = product.pricePerDay;
  const pricePerWeek = product.pricePerWeek;
  const pricePerMonth = product.pricePerMonth;

  const durationOptions = {
    0: { min: 1, max: 8 }, // Hour
    1: { min: 1, max: 3 }, // Day
    2: { min: 1, max: 2 }, // Week
    3: { min: 1, max: 1 }, // Month
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
      case 0: // Hour
        price = durationValue * pricePerHour;
        break;
      case 1: // Day
        price = durationValue * pricePerDay;
        break;
      case 2: // Week
        price = durationValue * pricePerWeek;
        break;
      case 3: // Month
        price = durationValue * pricePerMonth;
        break;
      default:
        price = 0;
    }

    setProductPriceRent(price);
  };

  const calculateRentalEndDate = (startDate) => {
    if (!startDate || durationUnit === undefined || !durationValue) return null;

    let endDate;
    switch (durationUnit) {
      case 0: // Hour
        endDate = moment(startDate).add(durationValue, "hours");
        break;
      case 1: // Day
        endDate = moment(startDate).add(durationValue, "days");
        break;
      case 2: // Week
        endDate = moment(startDate).add(durationValue, "weeks");
        break;
      case 3: // Month
        endDate = moment(startDate).add(durationValue, "months");
        break;
      default:
        endDate = startDate;
    }
    return endDate;
  };

  const handleDurationValueChange = (value) => {
    if (durationUnit === "hour" && value > 8) {
      message.warning(
        "Thời gian thuê theo giờ không được vượt quá 8 giờ. Vui lòng thuê theo ngày."
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
    setDurationValue(durationOptions[value].min);
    const { min, max } = durationOptions[value];
    message.info(`Please select a duration between ${min} and ${max}.`);
  };

  const calculateReturnDate = (endDate) => {
    if (!endDate) return null;
    return moment(endDate).add(1, "hours");
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
  const calculateEndDate = (startDate, unit, value) => {
    const start = new Date(startDate);
    switch (unit) {
      case "days":
        start.setDate(start.getDate() + value);
        break;
      case "weeks":
        start.setDate(start.getDate() + value * 7);
        break;
      case "months":
        start.setMonth(start.getMonth() + value);
        break;
      case "years":
        start.setFullYear(start.getFullYear() + value);
        break;
      default:
        break;
    }
    return start;
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
                  <Option value={0}>Giờ</Option>
                  <Option value={1}>Ngày</Option>
                  <Option value={2}>Tuần</Option>
                  <Option value={3}>Tháng</Option>
                </Select>
              </Form.Item>
              <Form.Item label="Giá trị thời gian" style={{ width: "100%" }}>
                <InputNumber
                  min={durationUnit ? durationOptions[durationUnit].min : 0}
                  max={durationUnit ? durationOptions[durationUnit].max : 0}
                  value={durationValue}
                  onChange={(value) => {
                    setDurationValue(value);
                    if (value && rentalStartDate) {
                      const calculatedRentalEndDate = calculateEndDate(
                        rentalStartDate,
                        durationUnit,
                        value
                      );
                      setRentalEndDate(calculatedRentalEndDate);
                      const calculatedReturnDate = new Date(
                        calculatedRentalEndDate
                      );
                      calculatedReturnDate.setDate(
                        calculatedReturnDate.getDate() + 1
                      );
                      setReturnDate(calculatedReturnDate);
                    }
                  }}
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
              <Form.Item label="Ngày trả hàng" style={{ width: "100%" }}>
                <DatePicker
                  showTime={{
                    format: "HH:mm",
                    defaultValue: moment("00:00", "HH:mm"),
                  }}
                  format="DD/MM/YYYY HH:mm"
                  value={returnDate}
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
