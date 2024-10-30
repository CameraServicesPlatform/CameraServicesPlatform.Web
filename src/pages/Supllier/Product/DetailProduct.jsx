import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Spin, message } from "antd";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../../../api/productApi"; // Adjust path as necessary

const DetailProduct = () => {
  const { id } = useParams(); // Assume `id` is passed via URL parameters
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const fetchedProduct = await getProductById(id);
        setProduct(fetchedProduct);
      } catch (err) {
        console.error("Failed to fetch product:", err);
        setError("Failed to load product details. Please try again later.");
        message.error("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Debugging: log the product
  console.log("Product:", product);

  if (loading) {
    return <Spin size="large" />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!product) {
    return <div>Đang tải thông tin sản phẩm...</div>; // Temporary loading message
  }

  const {
    productID,
    serialNumber,
    supplierID,
    categoryID,
    productName,
    productDescription,
    priceRent,
    priceBuy,
    pricePerHour,
    pricePerDay,
    pricePerWeek,
    pricePerMonth,
    brand,
    quality,
    status,
    rating,
    createdAt,
    updatedAt,
    listImage,
  } = product;

  const renderImages = () => {
    if (listImage && listImage.length > 0) {
      return listImage.map((image, index) => (
        <img
          key={index}
          src={image.image}
          alt={`${productName} - ${index + 1}`}
          style={{ width: 100, margin: "5px" }}
        />
      ));
    }
    return <span>Không có hình ảnh</span>;
  };

  const handleEdit = () => {
    // Implement edit functionality, e.g., navigate to edit form
    console.log("Edit product:", productID);
  };

  const handleDelete = async () => {
    // Implement delete functionality
    console.log("Delete product:", productID);
    // Add logic for deletion (API call, confirmation, etc.)
  };

  return (
    <div className="product-detail-container">
      <h1>Chi Tiết Sản Phẩm</h1>
      <div>
        <strong>Mã Sản Phẩm:</strong> {productID}
      </div>
      <div>
        <strong>Số Serial:</strong> {serialNumber}
      </div>
      <div>
        <strong>Mã Nhà Cung Cấp:</strong> {supplierID}
      </div>
      <div>
        <strong>Tên Loại Hàng:</strong> {categoryID}
      </div>
      <div>
        <strong>Tên Sản Phẩm:</strong> {productName}
      </div>
      <div>
        <strong>Mô Tả:</strong> {productDescription}
      </div>
      <div>
        <strong>Giá Thuê:</strong>{" "}
        {priceRent !== null ? `${priceRent} VND` : "Không có"}
      </div>
      <div>
        <strong>Giá Bán:</strong>{" "}
        {priceBuy !== null ? `${priceBuy} VND` : "Không có"}
      </div>
      <div>
        <strong>Giá Theo Giờ:</strong>{" "}
        {pricePerHour ? `${pricePerHour} VND` : "Không có"}
      </div>
      <div>
        <strong>Giá Theo Ngày:</strong>{" "}
        {pricePerDay ? `${pricePerDay} VND` : "Không có"}
      </div>
      <div>
        <strong>Giá Theo Tuần:</strong>{" "}
        {pricePerWeek ? `${pricePerWeek} VND` : "Không có"}
      </div>
      <div>
        <strong>Giá Theo Tháng:</strong>{" "}
        {pricePerMonth ? `${pricePerMonth} VND` : "Không có"}
      </div>
      <div>
        <strong>Thương Hiệu:</strong> {brand}
      </div>
      <div>
        <strong>Chất Lượng:</strong> {quality}
      </div>
      <div>
        <strong>Trạng Thái:</strong> {status}
      </div>
      <div>
        <strong>Đánh Giá:</strong> {rating}
      </div>
      <div>
        <strong>Ngày Tạo:</strong> {new Date(createdAt).toLocaleString()}
      </div>
      <div>
        <strong>Ngày Cập Nhật:</strong> {new Date(updatedAt).toLocaleString()}
      </div>
      <div>
        <strong>Hình Ảnh:</strong>
        {renderImages()}
      </div>
      <div className="product-detail-actions">
        <Button type="primary" icon={<EditOutlined />} onClick={handleEdit}>
          Chỉnh Sửa
        </Button>
        <Button
          type="danger"
          icon={<DeleteOutlined />}
          style={{ marginLeft: "8px" }}
          onClick={handleDelete}
        >
          Xóa
        </Button>
      </div>
    </div>
  );
};

export default DetailProduct;
