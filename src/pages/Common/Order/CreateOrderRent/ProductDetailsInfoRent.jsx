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
    0: { min: 2, max: 8 }, // Hour
    1: { min: 1, max: 3 }, // Day
    2: { min: 1, max: 2 }, // Week
    3: { min: 1, max: 1 }, // Month
  };

  const handleDurationValueChange = (value) => {
    setDurationValue(value);
  };

  useEffect(() => {
    if (durationUnit && durationValue && rentalStartDate) {
      calculateProductPriceRent();
      const endDate = calculateRentalEndDate(rentalStartDate);
      setRentalEndDate(endDate);
    }
  }, [durationUnit, durationValue, rentalStartDate]);

  const handleDurationUnitChange = (value) => {
    setDurationUnit(value);
    const { min, max } = durationOptions[value];
    setDurationValue(min);
    message.info(
      `Vui lòng chọn thời gian thuê từ ${min} đến ${max} ${
        value === 0 ? "giờ" : ""
      }.`
    );
  };

  const calculateReturnDate = (endDate) => {
    if (!endDate) return null;
    return moment(endDate).clone().add(1, "hours"); // Add buffer
  };

  // Update set logic
  useEffect(() => {
    if (rentalEndDate) {
      const calculatedReturnDate = calculateReturnDate(rentalEndDate);
      setReturnDate(calculatedReturnDate);
    }
  }, [rentalEndDate]);

  const isValidHourlyRange = (startDate, endDate) => {
    const hoursDiff = moment(endDate).diff(moment(startDate), "hours");
    return hoursDiff === durationValue;
  };

  const calculateProductPriceRent = () => {
    if (!durationUnit || !durationValue) {
      message.error("Vui lòng chọn đơn vị và giá trị thời gian");
      return;
    }

    const limits = durationOptions[durationUnit];
    if (!limits) {
      message.error("Đơn vị thời gian không hợp lệ");
      return;
    }

    if (durationValue < limits.min || durationValue > limits.max) {
      message.error(`Thời gian phải từ ${limits.min} đến ${limits.max}`);
      return;
    }

    let price = 0;
    switch (parseInt(durationUnit)) {
      case 0: // Hour
        if (!pricePerHour) {
          message.error("Chưa có giá cho thuê theo giờ");
          return;
        }
        price = durationValue * pricePerHour;
        break;

      case 1: // Day
        if (!pricePerDay) {
          message.error("Chưa có giá cho thuê theo ngày");
          return;
        }
        price = durationValue * pricePerDay;
        break;

      case 2: // Week
        if (!pricePerWeek) {
          message.error("Chưa có giá cho thuê theo tuần");
          return;
        }
        price = durationValue * pricePerWeek;
        break;

      case 3: // Month
        if (!pricePerMonth) {
          message.error("Chưa có giá cho thuê theo tháng");
          return;
        }
        price = durationValue * pricePerMonth;
        break;

      default:
        message.error("Đơn vị thời gian không hợp lệ");
        return;
    }

    if (price <= 0 || !isFinite(price)) {
      message.error("Lỗi tính toán giá thuê");
      return;
    }

    setProductPriceRent(price);
    return price;
  };

  const isValidDateRange = (startDate, endDate) => {
    if (!startDate || !endDate) return false;
    return moment(endDate).isAfter(moment(startDate));
  };

  const handleRentalStartDateChange = (date) => {
    if (!date) {
      message.error("Vui lòng chọn ngày bắt đầu thuê");
      return;
    }

    setRentalStartDate(date);

    const calculatedEndDate = calculateRentalEndDate(date);
    if (calculatedEndDate) {
      setRentalEndDate(calculatedEndDate);

      // Calculate Return Date after setting rentalEndDate
      const calculatedReturnDate = calculateReturnDate(calculatedEndDate);
      setReturnDate(calculatedReturnDate);
    }
  };

  const calculateRentalEndDate = (startDate) => {
    if (!startDate || durationUnit === undefined || !durationValue) {
      message.error("Vui lòng chọn thời gian bắt đầu và thời lượng thuê");
      return null;
    }

    const start = moment(startDate);
    let endDate;

    try {
      switch (parseInt(durationUnit, 10)) {
        case 0: // Hour
          endDate = start.clone().add(durationValue, "hours");
          break;
        case 1: // Day
          endDate = start.clone().add(durationValue, "days");
          break;
        case 2: // Week
          endDate = start.clone().add(durationValue, "weeks");
          break;
        case 3: // Month
          endDate = start.clone().add(durationValue, "months");
          break;
        default:
          message.error("Đơn vị thời gian không hợp lệ");
          return null;
      }
      if (!isValidDateRange(start, endDate)) {
        message.error("Thời gian kết thúc phải sau thời gian bắt đầu");
        return null;
      }
      return endDate;
    } catch (error) {
      message.error("Lỗi tính toán thời gian kết thúc thuê");
      return null;
    }
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
                  min={durationOptions[durationUnit]?.min || 1}
                  max={durationOptions[durationUnit]?.max || 1}
                  value={durationValue}
                  onChange={handleDurationValueChange}
                />
              </Form.Item>

              <Form.Item label="Ngày bắt đầu thuê" style={{ width: "100%" }}>
                <DatePicker
                  showTime
                  value={rentalStartDate}
                  onChange={handleRentalStartDateChange}
                  format="DD - MM - YYYY HH:mm"
                  style={{ width: "100%" }}
                />
              </Form.Item>
              <Form.Item label="Ngày kết thúc thuê" style={{ width: "100%" }}>
                <DatePicker
                  showTime
                  value={rentalEndDate}
                  disabled
                  format="DD - MM - YYYY HH:mm"
                  style={{ width: "100%" }}
                />
              </Form.Item>
              <Form.Item label="Ngày trả hàng" style={{ width: "100%" }}>
                <DatePicker
                  showTime
                  value={returnDate}
                  disabled
                  format="DD - MM - YYYY HH:mm"
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
