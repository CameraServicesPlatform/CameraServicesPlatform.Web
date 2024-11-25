import { EyeOutlined } from "@ant-design/icons";
import { Card, Typography } from "antd";
import React from "react";
import { getBrandName, getProductStatusEnum } from "../../../utils/constant";

const { Paragraph } = Typography;

const getStatusClass = (status) => {
  switch (status) {
    case 0:
      return "bg-green-500"; // For Sale
    case 1:
      return "bg-blue-500"; // For Rent
    case 2:
      return "bg-orange-500"; // Rented Out
    case 3:
      return "bg-red-500"; // Sold
    case 4:
      return "bg-gray-500"; // Unavailable
    default:
      return "bg-gray-500"; // Default case
  }
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

const ProductCard = ({ product, handleView }) => (
  <Card
    hoverable
    cover={
      <div className="relative">
        <img
          alt={product.productName}
          src={
            product.listImage && product.listImage.length > 0
              ? product.listImage[0].image
              : "https://via.placeholder.com/300?text=No+Image"
          }
          style={{ height: "200px", objectFit: "cover" }}
        />
        <div
          className={`absolute top-0 right-0 m-2 p-1 text-white text-xs rounded ${getStatusClass(
            product.status
          )}`}
        >
          {getProductStatusEnum(product.status)}
        </div>
      </div>
    }
    actions={[
      <EyeOutlined key="view" onClick={() => handleView(product.productID)} />,
    ]}
    style={{ marginBottom: "20px" }}
  >
    <Card.Meta
      title={product.productName}
      description={
        <>
          <Paragraph ellipsis={{ rows: 1, expandable: false }}>
            {product.productDescription
              ? product.productDescription.slice(0, 50)
              : ""}
            {product.productDescription &&
              product.productDescription.length > 50 &&
              "..."}
          </Paragraph>
          <p>
            <strong>Giá Mua:</strong> {formatCurrency(product.priceBuy)}
          </p>
          {product.pricePerHour && (
            <p>
              <strong>Giá (Giờ):</strong> {formatCurrency(product.pricePerHour)}
            </p>
          )}
          {product.pricePerDay && (
            <p>
              <strong>Giá (Ngày):</strong> {formatCurrency(product.pricePerDay)}
            </p>
          )}
          {product.pricePerWeek && (
            <p>
              <strong>Giá (Tuần):</strong>{" "}
              {formatCurrency(product.pricePerWeek)}
            </p>
          )}
          {product.pricePerMonth && (
            <p>
              <strong>Giá (Tháng):</strong>{" "}
              {formatCurrency(product.pricePerMonth)}
            </p>
          )}
          <p>
            <strong>Thương Hiệu:</strong> {getBrandName(product.brand)}
          </p>
        </>
      }
    />
  </Card>
);

export default ProductCard;
