import { Image, message, Row, Spin, Table } from "antd";
import React, { useEffect, useState } from "react";
import { getCategoryById } from "../../../api/categoryApi";
import { getContractTemplateByProductId } from "../../../api/contractTemplateApi";
import { getProductById } from "../../../api/productApi";
import { getSupplierById } from "../../../api/supplierApi";
// ...existing code...
const DetailProduct = ({ product, loading, onClose }) => {
  // ...existing code...
  return (
    <div className="product-detail-container">
      <Row justify="space-between" align="middle">
        <Button onClick={onClose}>Close</Button>
      </Row>
      // ...existing code...
    </div>
  );
};

export default DetailProduct;
