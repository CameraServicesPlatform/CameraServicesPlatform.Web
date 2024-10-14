import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React, { useEffect, useState } from "react";
import { deleteProduct, getAllProduct } from "../../../api/productApi";
import { getBrandName, getProductStatusEnum } from "../../../utils/constant";
import EditProductForm from "./EditProductForm";

const ProductListTable = () => {
  const [products, setProducts] = useState([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      const result = await getAllProduct(pageIndex, pageSize);
      if (result) {
        setProducts(result);
      } else {
        setError("Failed to load products.");
      }
      setLoading(false);
    };

    fetchProducts();
  }, [pageIndex, pageSize]);

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
      } catch (error) {
        setError("Failed to delete product.");
      }
    }
  };

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
    setSelectedProduct(null); // Reset selected product when closing modal
  };

  return (
    <div>
      <h2>Product List</h2>
      {loading ? (
        <p>Loading products...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div>
          {products.length > 0 ? (
            <table
              border="1"
              cellPadding="10"
              cellSpacing="0"
              style={{ width: "100%", textAlign: "left" }}
            >
              <thead>
                <tr>
                  <th>Product ID</th>
                  <th>Supplier ID</th>
                  <th>Category ID</th>
                  <th>Product Name</th>
                  <th>Description</th>
                  <th>Price (Rent)</th>
                  <th>Price (Buy)</th>
                  <th>Brand</th>
                  <th>Quality</th>
                  <th>Status</th>
                  <th>Rating</th>
                  <th>Created At</th>
                  <th>Updated At</th>
                  <th>Image</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
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
                          style={{
                            marginRight: "8px", // Add margin to the right
                          }}
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
          ) : (
            <p>No products available.</p>
          )}
        </div>
      )}

      {/* Pagination Controls */}
      {/* <div style={{ marginTop: "20px" }}>
        <Button
          onClick={() => setPageIndex(pageIndex - 1)}
          disabled={pageIndex === 1}
          style={{ marginRight: "8px" }}
        >
          Previous
        </Button>
        <span> Page {pageIndex} </span>
        <Button
          onClick={() => setPageIndex(pageIndex + 1)}
          disabled={products.length < pageSize}
          style={{ marginLeft: "8px" }}
        >
          Next
        </Button>
      </div> */}

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

export default ProductListTable;
