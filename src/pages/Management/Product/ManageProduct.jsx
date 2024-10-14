import { Input, Pagination, Spin, message } from "antd";
import React, { useEffect, useState } from "react";
import { getAllProduct, getProductByName } from "../../../api/productApi";
import ProductListTable from "./ProductListTable";

const ManageProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalProducts, setTotalProducts] = useState(0);
  const [filter, setFilter] = useState("");
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
    </div>
  );
};

export default ManageProduct;
