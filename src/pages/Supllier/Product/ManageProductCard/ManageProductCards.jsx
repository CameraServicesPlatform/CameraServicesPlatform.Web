import React from "react";
import { Row, Col } from "antd";
import ProductCard from "./ProductCard";

const ManageProductCards = ({ products, ...props }) => {
  return (
    // ...existing code...
    <Row gutter={[16, 16]}>
      {products.map((product) => (
        <Col xs={24} sm={12} key={product.productID}>
          <ProductCard product={product} {...props} />
        </Col>
      ))}
    </Row>
    // ...existing code...
  );
};

export default ManageProductCards;
