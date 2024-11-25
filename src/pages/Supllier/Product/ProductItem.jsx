// productTableColumns.js
import React from "react";
import { Button, Typography } from "antd";
import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { getBrandName, getProductStatusEnum } from "../../../utils/constant";

const { Paragraph } = Typography;

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

const renderPriceRent = (priceRent, record) => {
  const priceLabels = {
    hour: record.pricePerHour,
    day: record.pricePerDay,
    week: record.pricePerWeek,
    month: record.pricePerMonth,
  };

  return (
    <div>
      {record.pricePerHour !== null && record.pricePerHour !== 0 && (
        <span style={{ marginRight: "10px" }}>
          <strong>Theo Giờ:</strong> {record.pricePerHour} VND
        </span>
      )}
      {record.pricePerDay !== null && record.pricePerDay !== 0 && (
        <span style={{ marginRight: "10px" }}>
          <strong>Theo Ngày:</strong> {record.pricePerDay} VND
        </span>
      )}
      {record.pricePerWeek !== null && record.pricePerWeek !== 0 && (
        <span style={{ marginRight: "10px" }}>
          <strong>Theo Tuần:</strong> {record.pricePerWeek} VND
        </span>
      )}
      {record.pricePerMonth !== null && record.pricePerMonth !== 0 && (
        <span style={{ marginRight: "10px" }}>
          <strong>Theo Tháng:</strong> {record.pricePerMonth} VND
        </span>
      )}
      {Object.values(priceLabels).every((val) => val === null || val === 0) && (
        <span>--</span>
      )}
    </div>
  );
};

const renderPriceBuy = (priceBuy) => (
  <span
    style={{
      fontWeight: "bold",
      color: priceBuy !== null && priceBuy !== 0 ? "#007bff" : "#888",
    }}
  >
    {priceBuy !== null && priceBuy !== 0 ? `${priceBuy} VND` : "--"}
  </span>
);

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};

const getColumns = (
  categoryNames,
  expandedDescriptions,
  handleExpandDescription,
  handleView,
  handleEdit,
  handleDelete
) => [
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
    render: renderPriceRent,
    sorter: (a, b) => a.priceRent - b.priceRent,
  },
  {
    title: "Giá (Bán)",
    dataIndex: "priceBuy",
    render: renderPriceBuy,
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
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() => handleEdit(record)}
          style={{
            marginRight: "8px",
            backgroundColor: "#52c41a",
            color: "#fff",
            borderColor: "#52c41a",
          }}
        ></Button>
        <Button
          type="danger"
          icon={<DeleteOutlined />}
          onClick={() => handleDelete(record.productID)}
          style={{
            backgroundColor: "#f5222d",
            color: "#fff",
            borderColor: "#f5222d",
          }}
        ></Button>
      </div>
    ),
  },
];

export default getColumns;
