import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Input, message, Pagination, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getSupplierIdByAccountId } from "../../../api/accountApi";
import { deleteProduct, getProductBySupplierId } from "../../../api/productApi";
import { getBrandName, getProductStatusEnum } from "../../../utils/constant";

import EditProductForm from "./EditProductForm";

const { Title } = Typography;

const ProductListBySupplier = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const user = useSelector((state) => state.user.user || {});
  const [supplierId, setSupplierId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [categories, setCategories] = useState([]);

  // Fetch supplier ID on component mount
  useEffect(() => {
    const fetchSupplierId = async () => {
      if (user.id) {
        try {
          const response = await getSupplierIdByAccountId(user.id);
          if (response?.isSuccess) {
            setSupplierId(response.result);
          } else {
            message.error("Failed to fetch supplier ID.");
          }
        } catch (error) {
          message.error("Error fetching supplier ID.");
        }
      }
    };

    fetchSupplierId();
  }, [user]);

  // Fetch products based on supplier ID, page index, and page size
  const fetchProducts = async () => {
    if (!supplierId) return;

    setLoading(true);
    try {
      const result = await getProductBySupplierId(
        supplierId,
        pageIndex,
        pageSize
      );
      if (Array.isArray(result)) {
        setProducts(result);
        setTotal(result.totalCount || 0);
      } else {
        message.error("Unable to fetch products.");
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
      message.error("Error fetching products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (supplierId) {
      fetchProducts();
    }
  }, [supplierId, pageIndex, pageSize]);

  // Handle product deletion
  const handleDelete = async (productId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (confirmed) {
      try {
        await deleteProduct(productId);
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product.productID !== productId)
        );
        message.success("Product deleted successfully.");
      } catch (error) {
        message.error("Failed to delete product.");
      }
    }
  };

  // Handle product edit modal visibility and product update
  const handleEdit = (product) => {
    setSelectedProduct(product);
    setIsEditModalVisible(true);
  };

  const handleUpdateSuccess = (updatedProduct) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
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

  // Search and filter products
  const filteredProducts = Array.isArray(products)
    ? products.filter((product) =>
        product.productName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div>
      <Title level={2}>Product List</Title>

      {/* Search Box */}
      <Input
        placeholder="Search by product name"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ marginBottom: "20px", width: "300px" }}
      />

      {loading ? (
        <p>Loading products...</p>
      ) : (
        <div>
          {filteredProducts.length > 0 ? (
            <>
              <table
                border="1"
                cellPadding="10"
                cellSpacing="0"
                style={{ width: "100%", textAlign: "left" }}
              >
                <thead>
                  <tr>
                    <th>Sản Phẩm ID</th>
                    <th>Nhà cung cấp ID</th>
                    <th>Category Name</th>
                    <th>Tên sản phẩm</th>
                    <th>Mô tả</th>
                    <th>Giá (Thuê)</th>
                    <th>Giá (Mua)</th>
                    <th>Thương hiệu</th>
                    <th>Chất lượng</th>
                    <th>Trạng thái</th>
                    <th>Xếp hạng</th>
                    <th>Tạo lúc</th>
                    <th>Cập nhật lúc</th>
                    <th>Hình ảnh</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.productID}>
                      <td>{product.productID}</td>
                      <td>{product.supplierID}</td>
                      <td>{product.categoryID}</td>
                      <td>{product.productName}</td>
                      <td>{product.productDescription}</td>
                      <td>{product.priceRent} vnd</td>
                      <td>{product.priceBuy} vnd</td>
                      <td>{getBrandName(product.brand)}</td>
                      <td>{product.quality}</td>
                      <td>{getProductStatusEnum(product.status)}</td>
                      <td>{product.rating}</td>
                      <td>{new Date(product.createdAt).toLocaleString()}</td>
                      <td>{new Date(product.updatedAt).toLocaleString()}</td>
                      <td>
                        <img
                          src={
                            product.listImage.length > 0
                              ? product.listImage[0].image
                              : "https://via.placeholder.com/100?text=No+Image"
                          }
                          alt={product.productName}
                          width="100"
                        />
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Button
                            type="primary"
                            icon={<EditOutlined />}
                            onClick={() => handleEdit(product)}
                            style={{ marginRight: "8px" }}
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Pagination
                current={pageIndex}
                pageSize={pageSize}
                total={total}
                onChange={(page, size) => {
                  setPageIndex(page);
                  setPageSize(size);
                }}
                style={{ marginTop: "20px", textAlign: "center" }}
              />
            </>
          ) : (
            <p>No products available.</p>
          )}
        </div>
      )}

      {/* Edit Product Modal */}
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

export default ProductListBySupplier;
