import { EyeOutlined } from "@ant-design/icons";
import { Button, Card, Col, Row, Typography } from "antd";
import React from "react";
import { getBrandName, getProductStatusEnum } from "../../../utils/constant";

const { Paragraph, Text } = Typography;

const getStatusClass = (status) => {
  switch (status) {
    case 0:
      return "text-green-500 text-sm font-bold"; // For Sale
    case 1:
      return "text-blue-500 text-sm font-bold"; // For Rent
    case 2:
      return "text-orange-500 text-sm font-bold"; // Rented Out
    case 3:
      return "text-red-500 text-sm font-bold"; // Sold
    case 4:
      return "text-gray-500 text-sm font-bold"; // Unavailable
    default:
      return "text-gray-400 text-sm font-bold"; // Default case
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};

const ProductCard = ({
  product,
  categoryNames,
  expandedDescriptions,
  handleExpandDescription,
  handleView,
}) => (
  <Card
    title={<Text strong>{product.productName}</Text>}
    extra={
      <Button
        type="default"
        icon={<EyeOutlined />}
        onClick={() => handleView(product.productID)}
        style={{
          backgroundColor: "#1890ff",
          color: "#fff",
          borderColor: "#1890ff",
        }}
      />
    }
    style={{ marginBottom: "16px" }}
  >
    <Row gutter={16}>
      <Col span={8}>
        <img
          src={
            product.listImage && product.listImage.length > 0
              ? product.listImage[0].image
              : "https://via.placeholder.com/100?text=No+Image"
          }
          alt={product.productName}
          width="100%"
          style={{ borderRadius: "8px" }}
        />
      </Col>
      <Col span={16}>
        <p>
          <Text strong>Mã Sản Phẩm:</Text> {product.productID}
        </p>
        <p>
          <Text strong>Số Serial:</Text> {product.serialNumber}
        </p>
        <p>
          <Text strong>Mã Nhà Cung Cấp:</Text> {product.supplierID}
        </p>
        <p>
          <Text strong>Tên Loại Hàng:</Text>
          {categoryNames[product.categoryID] || "Không xác định"}
        </p>
        <p>
          <Text strong>Giá (Cọc):</Text> {product.depositProduct}
        </p>
        <p>
          <Text strong>Giá (Thuê):</Text> {product.priceRent}
        </p>
        <p>
          <Text strong>Giá (Bán):</Text> {product.priceBuy}
        </p>
        <p>
          <Text strong>Thương Hiệu:</Text> {getBrandName(product.brand)}
        </p>
        <p>
          <Text strong>Chất Lượng:</Text> {product.quality}
        </p>
        <p>
          <Text strong>Trạng Thái:</Text>
          <span className={getStatusClass(product.status)}>
            {getProductStatusEnum(product.status)}
          </span>
        </p>
        <p>
          <Text strong>Đánh Giá:</Text> {product.rating}
        </p>
        <p>
          <Text strong>Ngày Tạo:</Text> {formatDate(product.createdAt)}
        </p>
        <p>
          <Text strong>Ngày Cập Nhật:</Text> {formatDate(product.updatedAt)}
        </p>
        <Paragraph ellipsis={{ rows: 2, expandable: true }}>
          {expandedDescriptions[product.productID]
            ? product.productDescription
            : `${
                product.productDescription
                  ? product.productDescription.slice(0, 100)
                  : ""
              }...`}
        </Paragraph>
        {product.productDescription &&
          product.productDescription.length > 100 && (
            <Button
              type="link"
              onClick={() => handleExpandDescription(product.productID)}
              style={{ padding: 0 }}
            >
              {expandedDescriptions[product.productID]
                ? "See Less"
                : "See More"}
            </Button>
          )}
      </Col>
    </Row>
  </Card>
);

const ProductTable = ({
  products,
  categoryNames,
  expandedDescriptions,
  handleExpandDescription,
  handleView,
}) => {
  return (
    <Row gutter={16}>
      {products.map((product) => (
        <Col span={8} key={product.productID}>
          <ProductCard
            product={product}
            categoryNames={categoryNames}
            expandedDescriptions={expandedDescriptions}
            handleExpandDescription={handleExpandDescription}
            handleView={handleView}
          />
        </Col>
      ))}
    </Row>
  );
};

export default ProductTable;
