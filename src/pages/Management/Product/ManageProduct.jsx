import { Button, Input, Modal, Pagination, Spin, message } from "antd";
import React, { useEffect, useState } from "react";
import {
  createProduct,
  getAllProduct,
  getProductByName,
} from "../../../api/productApi";
import CreateProductForm from "./CreateProductForm";
import ProductListTable from "./ProductListTable";

const ManageProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalProducts, setTotalProducts] = useState(0);
  const [filter, setFilter] = useState("");
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, [pageIndex, pageSize, filter]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = filter
        ? await getProductByName(filter, pageIndex, pageSize)
        : await getAllProduct(pageIndex, pageSize);

      if (data) {
        setProducts(data.items || []);
        setTotalProducts(data.total || 0);
      } else {
        message.error("Failed to fetch products");
      }
    } catch (error) {
      message.error("Error fetching products");
    }
    setLoading(false);
  };

  const handleCreateProduct = async (values) => {
    try {
      await createProduct(values);
      message.success("Product created successfully");
      setCreateModalVisible(false);
      fetchProducts();
    } catch (error) {
      message.error("Error creating product");
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Search products by name"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          onSearch={fetchProducts}
          style={{ width: 300, marginRight: 16 }}
        />
        <Button type="primary" onClick={() => setCreateModalVisible(true)}>
          Create Product
        </Button>
      </div>

      {loading ? (
        <Spin />
      ) : (
        <ProductListTable
          products={products}
          pageIndex={pageIndex}
          pageSize={pageSize}
          totalProducts={totalProducts}
          setPageIndex={setPageIndex}
          setPageSize={setPageSize}
        />
      )}

      <Pagination
        current={pageIndex}
        pageSize={pageSize}
        total={totalProducts}
        onChange={(page, size) => {
          setPageIndex(page);
          setPageSize(size);
        }}
        style={{ marginTop: 16, textAlign: "right" }}
      />

      <Modal
        title="Create Product"
        visible={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        footer={null}
      >
        <CreateProductForm onSubmit={handleCreateProduct} />
      </Modal>
    </div>
  );
};

export default ManageProduct;
