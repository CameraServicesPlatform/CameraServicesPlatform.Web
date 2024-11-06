import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Input, Table, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { deleteProduct, getAllProduct } from "../../../api/productApi";
import EditProductForm from "./EditProductForm";

const ProductListTable = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedProductId, setExpandedProductId] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const result = await getAllProduct();
      setProducts(result || []);
      setLoading(false);
    };

    fetchProducts();
  }, []);

  const handleDelete = async (productId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (confirmed) {
      await deleteProduct(productId);
      setProducts(
        products.filter((product) => product.productID !== productId)
      );
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setIsEditModalVisible(true);
  };

  const handleUpdateSuccess = (updatedProduct) => {
    setProducts(
      products.map((product) =>
        product.productID === updatedProduct.productID
          ? updatedProduct
          : product
      )
    );
  };

  const handleModalClose = () => {
    setIsEditModalVisible(false);
    setSelectedProduct(null);
  };

  const handleExpandDescription = (productId) => {
    setExpandedProductId(expandedProductId === productId ? null : productId); // Toggle description visibility
  };

  const filteredProducts = products
    .filter((product) =>
      product.productName.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort by createdAt in descending order

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
  const columns = [
    {
      title: "Product ID",
      dataIndex: "productID",
      key: "productID",
      ellipsis: true,
    },
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
      ellipsis: true,
    },
    {
      title: "Description",
      dataIndex: "productDescription",
      key: "productDescription",
      render: (text, record) => (
        <div>
          <Typography.Paragraph ellipsis={{ rows: 2, expandable: true }}>
            {expandedProductId === record.productID
              ? text
              : `${text.slice(0, 10)}...`}
          </Typography.Paragraph>
          {text.length > 10 && (
            <Button
              type="link"
              onClick={() => handleExpandDescription(record.productID)}
              style={{ padding: 0 }}
            >
              {expandedProductId === record.productID ? "See Less" : "See More"}
            </Button>
          )}
        </div>
      ),
    },
    {
      title: "Price (Rent)",
      dataIndex: "priceRent",
      key: "priceRent",
      render: (price) => `${price} vnd`,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => formatDate(date),
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (date) => formatDate(date),
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, product) => (
        <div>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(product)}
            style={{ marginRight: 8 }}
          >
            Edit
          </Button>
          <Button
            type="danger"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(product.productID)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h2>Product List</h2>
      <Input
        placeholder="Search by product name"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ marginBottom: 20, width: 300 }}
      />
      <Table
        dataSource={filteredProducts}
        columns={columns}
        loading={loading}
        rowKey="productID"
        pagination={{ pageSize: 10 }}
      />
      {isEditModalVisible && (
        <EditProductForm
          visible={isEditModalVisible}
          onClose={handleModalClose}
          product={selectedProduct}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}
    </div>
  );
};

export default ProductListTable;
