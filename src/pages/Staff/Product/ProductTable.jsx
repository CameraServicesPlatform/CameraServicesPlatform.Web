import React from "react";
import { Table, Button, Typography } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { getBrandName, getProductStatusEnum } from "../../../utils/constant";

const { Paragraph } = Typography;

const ProductTable = ({
  products,
  categoryNames,
  expandedDescriptions,
  handleExpandDescription,
  handleView,
  handleDelete,
}) => {
  const columns = [
    {
      title: "Mã Sản Phẩm",
      dataIndex: "productID",
      sorter: (a, b) => a.productID - b.productID,
    },
    {
      title: "Số Serial",
      dataIndex: "serialNumber",
      sorter: (a, b) => a.serialNumber.localeCompare(b.serialNumber),
    },
    {
      title: "Mã Nhà Cung Cấp",
      dataIndex: "supplierID",
      sorter: (a, b) => a.supplierID - b.supplierID,
    },
    {
      title: "Tên Loại Hàng",
      dataIndex: "categoryID",
      render: (categoryID) => categoryNames[categoryID] || "Không xác định",
      sorter: (a, b) =>
        (categoryNames[a.categoryID] || "").localeCompare(
          categoryNames[b.categoryID] || ""
        ),
    },
    {
      title: "Tên Sản Phẩm",
      dataIndex: "productName",
      sorter: (a, b) => a.productName.localeCompare(b.productName),
    },
    {
      title: "Mô Tả",
      dataIndex: "productDescription",
      render: (text, record) => (
        <div>
          <Paragraph ellipsis={{ rows: 2, expandable: true }}>
            {expandedDescriptions[record.productID]
              ? text
              : `${text ? text.slice(0, 100) : ""}...`}
          </Paragraph>
          {text && text.length > 100 && (
            <Button
              type="link"
              onClick={() => handleExpandDescription(record.productID)}
              style={{ padding: 0 }}
            >
              {expandedDescriptions[record.productID] ? "See Less" : "See More"}
            </Button>
          )}
        </div>
      ),
    },
    {
      title: "Giá(Cọc)",
      dataIndex: "depositProduct",
      sorter: (a, b) => a.depositProduct - b.depositProduct,
    },
    {
      title: "Giá (Thuê)",
      dataIndex: "priceRent",
      sorter: (a, b) => a.priceRent - b.priceRent,
    },
    {
      title: "Giá (Bán)",
      dataIndex: "priceBuy",
      sorter: (a, b) => a.priceBuy - b.priceBuy,
    },
    {
      title: "Thương Hiệu",
      dataIndex: "brand",
      render: (brand) => getBrandName(brand),
      sorter: (a, b) =>
        getBrandName(a.brand).localeCompare(getBrandName(b.brand)),
    },
    {
      title: "Chất Lượng",
      dataIndex: "quality",
      sorter: (a, b) => a.quality.localeCompare(b.quality),
    },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      render: (status) => (
        <span className={getStatusClass(status)}>
          {getProductStatusEnum(status)}
        </span>
      ),
      sorter: (a, b) => a.status - b.status,
    },
    {
      title: "Đánh Giá",
      dataIndex: "rating",
      sorter: (a, b) => a.rating - b.rating,
    },
    {
      title: "Ngày Tạo",
      dataIndex: "createdAt",
      render: (createdAt) => formatDate(createdAt),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: "Ngày Cập Nhật",
      dataIndex: "updatedAt",
      render: (updatedAt) => formatDate(updatedAt),
      sorter: (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt),
    },
    {
      title: "Danh Sách Ảnh",
      dataIndex: "listImage",
      render: (listImage, record) => (
        <img
          src={
            listImage && listImage.length > 0
              ? listImage[0].image
              : "https://via.placeholder.com/100?text=No+Image"
          }
          alt={record.productName}
          width="100"
        />
      ),
    },
    {
      title: "Hành Động",
      render: (text, record) => (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            type="default"
            icon={<EyeOutlined />}
            onClick={() => handleView(record.productID)}
            style={{
              marginRight: "8px",
              backgroundColor: "#1890ff",
              color: "#fff",
              borderColor: "#1890ff",
            }}
          ></Button>
        </div>
      ),
    },
  ];

  return (
    <Table
      dataSource={products}
      columns={columns}
      rowKey="productID"
      pagination={false}
      bordered
    />
  );
};

export default ProductTable;
