import { Image, message, Row, Spin, Table } from "antd";
import React, { useEffect, useState } from "react";
import { getCategoryById } from "../../../api/categoryApi"; // Import the getCategoryById function
import { getProductById } from "../../../api/productApi";
import { getSupplierById } from "../../../api/supplierApi";

const DetailProduct = ({ product, loading, onClose }) => {
  const [productDetails, setProductDetails] = useState(product);
  const [isLoading, setIsLoading] = useState(loading);
  const [error, setError] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [supplierName, setSupplierName] = useState("");

  useEffect(() => {
    if (product?.supplierID) {
      const fetchSupplierName = async () => {
        try {
          const supplier = await getSupplierById(product.supplierID);
          if (supplier && supplier.result && supplier.result.items.length > 0) {
            setSupplierName(supplier.result.items[0].supplierName);
          } else {
            console.error("Supplier not found");
          }
        } catch (error) {
          console.error("Error fetching supplier name:", error);
        }
      };

      fetchSupplierName();
    }
  }, [product?.supplierID]);
  useEffect(() => {
    if (product?.categoryID) {
      const fetchCategoryName = async () => {
        try {
          const supplier = await getCategoryById(product.categoryID);
          if (supplier && supplier.result) {
            setCategoryName(supplier.result.categoryName);
          } else {
            console.error("Supplier not found");
          }
        } catch (error) {
          console.error("Error fetching supplier name:", error);
        }
      };

      fetchCategoryName();
    }
  }, [product?.categoryID]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const fetchedProduct = await getProductById(product?.id);
        console.log("Fetched Product:", fetchedProduct);
        setProductDetails(fetchedProduct);
      } catch (err) {
        console.error("Failed to fetch product:", err);
        setError("Failed to load product details. Please try again later.");
        message.error(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (!product) {
      fetchProduct();
    }
  }, [product]);

  if (isLoading) {
    return <Spin size="large" />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!productDetails) {
    return <div>Đang tải thông tin sản phẩm...</div>; // Temporary loading message
  }

  const {
    productID,
    serialNumber,
    supplierID,
    categoryID,
    productName,
    productDescription,
    depositProduct,
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
    listVoucher,
    listProductSpecification,
    originalPrice,
    countRent,
    category,
  } = productDetails;

  const renderImages = () => {
    if (listImage && listImage.length > 0) {
      return listImage.map((image, index) => (
        <Image
          key={index}
          src={image.image}
          alt={`${productName} - ${index + 1}`}
          width={100}
          style={{ margin: "5px" }}
        />
      ));
    }
    return <span>Không có hình ảnh</span>;
  };

  const columns = [
    {
      title: "Trường",
      dataIndex: "field",
      key: "field",
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: "Giá Trị",
      dataIndex: "value",
      key: "value",
      render: (text, record) =>
        typeof text === "number" &&
        record.field !== "Đánh Giá" &&
        record.field !== "Số Lần Thuê"
          ? new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(text)
          : text,
    },
  ];

  const data = [
    { key: "1", field: "Mã Sản Phẩm", value: productID },
    { key: "2", field: "Số Serial", value: serialNumber },
    { key: "3", field: "Mã Nhà Cung Cấp", value: supplierName },
    { key: "4", field: "Tên Loại Hàng", value: categoryName },
    { key: "5", field: "Tên Sản Phẩm", value: productName },
    { key: "6", field: "Mô Tả", value: productDescription },
    {
      key: "7",
      field: "Giá Đặt Cọc",
      value: depositProduct !== null ? depositProduct : null,
    },
    {
      key: "8",
      field: "Giá Bán",
      value: priceBuy !== null ? priceBuy : null,
    },
    {
      key: "9",
      field: "Giá Theo Giờ",
      value: pricePerHour ? pricePerHour : null,
    },
    {
      key: "10",
      field: "Giá Theo Ngày",
      value: pricePerDay ? pricePerDay : null,
    },
    {
      key: "11",
      field: "Giá Theo Tuần",
      value: pricePerWeek ? pricePerWeek : null,
    },
    {
      key: "12",
      field: "Giá Theo Tháng",
      value: pricePerMonth ? pricePerMonth : null,
    },
    {
      key: "20",
      field: "Giá Gốc",
      value: originalPrice !== null ? originalPrice : null,
    },
    { key: "21", field: "Số Lần Thuê", value: countRent },
    { key: "22", field: "Đánh Giá", value: rating },
    { key: "23", field: "Hình ảnh", value: renderImages() },
  ].filter((item) => item.value !== null);

  const voucherColumns = [
    {
      title: "Mã Voucher",
      dataIndex: "vourcherID",
      key: "vourcherID",
    },
    {
      title: "Ngày Tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: "Ngày Cập Nhật",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (date) => new Date(date).toLocaleString(),
    },
  ];

  const specificationColumns = [
    {
      title: "Thông Số Kỹ Thuật",
      dataIndex: "specification",
      key: "specification",
    },
    {
      title: "Giá Trị",
      dataIndex: "value",
      key: "value",
    },
  ];

  return (
    <div className="product-detail-container">
      <Row justify="space-between" align="middle"></Row>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        showHeader={false}
        bordered
      />
      <h2>Vouchers</h2>
      <Table
        columns={voucherColumns}
        dataSource={listVoucher}
        pagination={false}
        bordered
      />
      <h2>Thông Số Kỹ Thuật</h2>
      <Table
        columns={specificationColumns}
        dataSource={listProductSpecification}
        pagination={false}
        bordered
      />
    </div>
  );
};

export default DetailProduct;
