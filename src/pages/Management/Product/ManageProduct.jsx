import {
  Button,
  Form,
  Input,
  Modal,
  Pagination,
  Spin,
  Table,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import {
  createProduct,
  deleteProduct,
  getAllProduct,
  getProductByName,
} from "../../../api/productApi";
import CreateProductForm from "./CreateProductForm";

const ManageProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(10);
  const [searchFilter, setSearchFilter] = useState(""); // Search input state
  const [editingProduct, setEditingProduct] = useState(null); // For editing product
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [pageIndex, searchFilter]); // Fetch products when pageIndex or searchFilter changes

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = searchFilter
        ? await getProductByName(searchFilter, pageIndex, pageSize)
        : await getAllProduct(pageIndex, pageSize);

      if (response && response.result) {
        setProducts(response.result.items || response.result); // Handle paginated and non-paginated responses
        setTotalProducts(response.result.total || response.result.length); // Set total number of products
      } else {
        message.error("Failed to load products.");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      message.error("An error occurred while fetching products.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (page) => {
    setPageIndex(page); // Update pageIndex on pagination change
  };

  const handleEdit = (product) => {
    setEditingProduct(product); // Set the selected product for editing
    setIsModalVisible(true); // Show the modal
  };

  const handleEditSubmit = async (values) => {
    try {
      const result = await createProduct(
        editingProduct.serialNumber,
        editingProduct.supplierID,
        editingProduct.categoryID,
        values.productName,
        values.productDescription,
        values.priceRent,
        values.priceBuy,
        editingProduct.brand,
        editingProduct.status
      );
      if (result) {
        message.success("Product updated successfully");
        fetchProducts();
        setEditingProduct(null);
        setIsModalVisible(false); // Close the modal
      } else {
        message.error("Failed to update product.");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      message.error("An error occurred while updating product.");
    }
  };

  const columns = [
    {
      title: "Product Name",
      dataIndex: ["product", "productName"],
      key: "productName",
      render: (text, record) => (
        <a onClick={() => handleEdit(record.product)}>{text}</a>
      ),
    },
    {
      title: "Description",
      dataIndex: ["product", "productDescription"],
      key: "productDescription",
    },
    {
      title: "Price (Rent)",
      dataIndex: ["product", "priceRent"],
      key: "priceRent",
    },
    {
      title: "Price (Buy)",
      dataIndex: ["product", "priceBuy"],
      key: "priceBuy",
    },
    {
      title: "Quality",
      dataIndex: ["product", "quality"],
    },
    {
      title: "Rating",
      dataIndex: ["product", "rating"],
      key: "rating",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <span>
          <Button type="link" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Button
            type="link"
            onClick={() => handleDelete(record.product.productID)}
          >
            Delete
          </Button>
        </span>
      ),
    },
  ];

  const handleDelete = async (productID) => {
    try {
      await deleteProduct(productID);
      message.success("Product deleted successfully");
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      message.error("An error occurred while deleting product.");
    }
  };

  return (
    <div>
      <h1>Manage Products</h1>
      <Input
        placeholder="Search products"
        value={searchFilter}
        onChange={(e) => setSearchFilter(e.target.value)}
        style={{ width: 200, marginBottom: 16 }}
      />
      <Button type="primary" onClick={fetchProducts} style={{ marginLeft: 8 }}>
        Search
      </Button>

      <CreateProductForm
        isVisible={isModalVisible}
        setIsVisible={setIsModalVisible}
      />

      {loading ? (
        <Spin tip="Loading..." />
      ) : (
        <Table
          columns={columns}
          dataSource={products}
          pagination={false}
          rowKey={(record) => record.product?.productID || record.id}
        />
      )}
      <Pagination
        current={pageIndex}
        pageSize={pageSize}
        total={totalProducts}
        onChange={handleChange}
        style={{ marginTop: 16, textAlign: "right" }}
      />
      <Modal
        title="Edit Product"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        {editingProduct && (
          <Form
            initialValues={{
              productName: editingProduct.productName,
              productDescription: editingProduct.productDescription,
              priceRent: editingProduct.priceRent,
              priceBuy: editingProduct.priceBuy,
              quality: editingProduct.quality,
              rating: editingProduct.rating,
            }}
            onFinish={handleEditSubmit}
          >
            <Form.Item
              label="Product Name"
              name="productName"
              rules={[
                { required: true, message: "Please enter the product name." },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="Description" name="productDescription">
              <Input.TextArea />
            </Form.Item>
            <Form.Item
              label="Price (Rent)"
              name="priceRent"
              rules={[
                { required: true, message: "Please enter the rent price." },
              ]}
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item
              label="Price (Buy)"
              name="priceBuy"
              rules={[
                { required: true, message: "Please enter the buy price." },
              ]}
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item label="Quality" name="quality">
              <Input />
            </Form.Item>
            <Form.Item label="Rating" name="rating">
              <Input type="number" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Save
              </Button>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default ManageProduct;
