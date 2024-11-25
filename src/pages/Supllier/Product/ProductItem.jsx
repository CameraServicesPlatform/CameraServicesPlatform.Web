// ProductCard.jsx
import { EyeOutlined } from "@ant-design/icons";
import { Card, Tag, Typography } from "antd";
import React from "react";
import { getBrandName, getProductStatusEnum } from "../../../utils/constant";

const { Paragraph } = Typography;

const getStatusClass = (status) => {
  switch (status) {
    case 0:
      return "green"; // For Sale
    case 1:
      return "blue"; // For Rent
    case 2:
      return "orange"; // Rented Out
    case 3:
      return "red"; // Sold
    case 4:
      return "gray"; // Unavailable
    default:
      return "gray"; // Default case
  }
};

const ProductCard = ({
  product,
  categoryNames,
  handleExpandDescription,
  expandedDescriptions,
  handleView,
}) => (
  <Card
    hoverable
    cover={
      <img
        alt={product.productName}
        src={
          product.listImage && product.listImage.length > 0
            ? product.listImage[0].image
            : "https://via.placeholder.com/300?text=No+Image"
        }
        style={{ height: "200px", objectFit: "cover" }}
      />
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
              <Typography.Link
                onClick={() => handleExpandDescription(product.productID)}
              >
                {expandedDescriptions[product.productID]
                  ? "See Less"
                  : "See More"}
              </Typography.Link>
            )}
          <p>
            <strong>Giá (Cọc):</strong> {product.depositProduct}
          </p>
          <p>
            <strong>Giá (Thuê):</strong> {product.pricePerMonth} VND
          </p>
          <p>
            <strong>Thương Hiệu:</strong> {getBrandName(product.brand)}
          </p>
          <p>
            <strong>Trạng Thái:</strong>{" "}
            <Tag color={getStatusClass(product.status)}>
              {getProductStatusEnum(product.status)}
            </Tag>
          </p>
        </>
      }
    />
  </Card>
);

export default ProductCard;
