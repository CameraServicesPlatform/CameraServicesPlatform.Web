import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, message, Modal, Typography } from "antd";
import React, { useState } from "react";
import { createContractTemplate } from "../../../../api/contractTemplateApi";
import { getBrandName, getProductStatusEnum } from "../../../../utils/constant";

const { Paragraph } = Typography;

const ProductCard = ({
  product,
  categoryNames,
  handleView,
  handleEdit,
  handleDelete,
  handleExpandDescription,
  expandedDescriptions,
}) => {
  const [isContractModalVisible, setIsContractModalVisible] = useState(false);
  const [form] = Form.useForm();

  const renderPriceRent = (record) => {
    const priceLabels = {
      hour: record.pricePerHour,
      day: record.pricePerDay,
      week: record.pricePerWeek,
      month: record.pricePerMonth,
    };

    return (
      <div>
        {record.pricePerHour !== null && record.pricePerHour !== 0 && (
          <span className="mr-2 text-orange-500">
            <strong>Theo Giờ:</strong> {formatCurrency(record.pricePerHour)}
          </span>
        )}
        {record.pricePerDay !== null && record.pricePerDay !== 0 && (
          <span className="mr-2 text-blue-500">
            <strong>Theo Ngày:</strong> {formatCurrency(record.pricePerDay)}
          </span>
        )}
        {record.pricePerWeek !== null && record.pricePerWeek !== 0 && (
          <span className="mr-2 text-green-500">
            <strong>Theo Tuần:</strong> {formatCurrency(record.pricePerWeek)}
          </span>
        )}
        {record.pricePerMonth !== null && record.pricePerMonth !== 0 && (
          <span className="mr-2 text-pink-500">
            <strong>Theo Tháng:</strong> {formatCurrency(record.pricePerMonth)}
          </span>
        )}
        {Object.values(priceLabels).every(
          (val) => val === null || val === 0
        ) && <span className="text-gray-500">Không có</span>}
      </div>
    );
  };

  const renderPriceBuy = (priceBuy) => (
    <span
      className={`font-bold ${
        priceBuy !== null && priceBuy !== 0 ? "text-blue-500" : "text-gray-500"
      }`}
    >
      {priceBuy !== null && priceBuy !== 0
        ? formatCurrency(priceBuy)
        : "Không có"}
    </span>
  );

  const getStatusClass = (status) => {
    switch (status) {
      case 0:
        return "bg-green-500"; // Bán
      case 1:
        return "bg-blue-500"; // Cho thuê
      case 2:
        return "bg-orange-500"; // Đã thuê
      case 3:
        return "bg-red-500"; // Đã bán
      case 4:
        return "bg-gray-500"; // Không khả dụng
      default:
        return "bg-gray-400"; // Mặc định
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const handleCreateContractTemplate = async (values) => {
    try {
      await createContractTemplate({
        ...values,
        accountID: user.id,
        productID: product.productID,
      });
      message.success("Tạo mẫu hợp đồng thành công!");
      setIsContractModalVisible(false);
    } catch (error) {
      message.error("Lỗi khi tạo mẫu hợp đồng.");
    }
  };

  return (
    <>
      <Card
        title={product.productName}
        extra={
          <div>
            <Button
              type="default"
              icon={<EyeOutlined />}
              onClick={() => handleView(product.productID)}
              className="mr-2 bg-blue-500 text-white border-blue-500"
            />
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => handleEdit(product)}
              className="mr-2 bg-green-500 text-white border-green-500"
            />
            <Button
              type="danger"
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(product.productID)}
              className="bg-red-500 text-white border-red-500"
            />
          </div>
        }
        className="mb-5 w-full relative"
      >
        <div className="relative">
          {product.listImage && product.listImage.length > 0 ? (
            <img
              src={product.listImage[0].image}
              alt={product.productName}
              className="w-full h-48 object-cover mb-2"
            />
          ) : (
            <div className="w-full h-48 bg-gray-200 flex items-center justify-center mb-2">
              <span>Không có hình ảnh</span>
            </div>
          )}
          <div
            className={`absolute top-0 right-0 m-2 p-1 text-white text-xs rounded ${getStatusClass(
              product.status
            )}`}
          >
            {getProductStatusEnum(product.status)}
          </div>
        </div>
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
              className="p-0"
            >
              {expandedDescriptions[product.productID] ? "Thu gọn" : "Xem thêm"}
            </Button>
          )}
        <p>
          <strong>Danh mục:</strong>
          {categoryNames[product.categoryID] || "Không xác định"}
        </p>
        <p>
          <strong>Thương hiệu:</strong> {getBrandName(product.brand)}
        </p>
        <p>
          <strong>Số lần thuê:</strong> {product.countRent}
        </p>
        <p>
          <span className="mr-2 text-blue-500">
            <strong>Phí giữ chỗ:</strong>{" "}
            {formatCurrency(product.depositProduct)}
          </span>
        </p>
        <p>
          <strong>Giá (Gốc):</strong> {product.originalPrice}
        </p>
        <p>
          <strong>Giá (Thuê):</strong> {renderPriceRent(product)}
        </p>
        {product.priceBuy !== null && (
          <p>
            <strong>Giá (Mua):</strong> {renderPriceBuy(product.priceBuy)}
          </p>
        )}
        {product.status === 1 && (
          <Button
            type="primary"
            onClick={() => setIsContractModalVisible(true)}
            style={{ marginLeft: "10px" }}
          >
            Thêm điều khoản khác
          </Button>
        )}
      </Card>

      <Modal
        title="Tạo Mẫu Hợp Đồng"
        visible={isContractModalVisible}
        onCancel={() => setIsContractModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleCreateContractTemplate}>
          <Form.Item
            name="templateName"
            label="Tên Mẫu"
            rules={[{ required: true, message: "Vui lòng nhập tên mẫu!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="contractTerms"
            label="Điều Khoản Hợp Đồng"
            rules={[
              { required: true, message: "Vui lòng nhập điều khoản hợp đồng!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="templateDetails"
            label="Chi Tiết Mẫu"
            rules={[{ required: true, message: "Vui lòng nhập chi tiết mẫu!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="penaltyPolicy"
            label="Chính Sách Phạt"
            rules={[
              { required: true, message: "Vui lòng nhập chính sách phạt!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Tạo Mẫu
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ProductCard;
