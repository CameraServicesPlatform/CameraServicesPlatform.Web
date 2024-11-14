import {
  DollarOutlined,
  FileTextOutlined,
  InfoCircleOutlined,
  PictureOutlined,
  TagOutlined,
} from "@ant-design/icons";
import { Card, Col, Descriptions, Row, Spin } from "antd";
import React from "react";

const ProductDetailsInfoBuy = ({ product, loading }) => {
  return (
    <Card
      title="Thông tin sản phẩm"
      bordered={false}
      style={{ marginBottom: "24px" }}
    >
      {loading ? (
        <Spin tip="Đang tải thông tin sản phẩm..." />
      ) : product ? (
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
                    <DollarOutlined /> Giá
                  </span>
                }
              >
                <div style={{ color: "#52c41a" }}>
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(product.priceBuy)}
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
      ) : (
        <p>Không tìm thấy thông tin sản phẩm.</p>
      )}
    </Card>
  );
};

export default ProductDetailsInfoBuy;
