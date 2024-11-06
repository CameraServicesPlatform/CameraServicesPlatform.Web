import { Button, Card, Col, message, Modal, Row, Table } from "antd";
import React, { useEffect, useState } from "react";
import {
  createProductVoucher,
  deleteProductVoucher,
  getAllProductVouchers,
} from "../../../api/ProductVoucherApi";
import { getAllProduct, getProductById } from "../../../api/productApi";
import { getAllVouchers, getVoucherById } from "../../../api/voucherApi";
import LoadingComponent from "../../../components/LoadingComponent/LoadingComponent";
import EditCreateProductForm from "./EditCreateProductForm";

const ProductVoucher = () => {
  const [vouchers, setVouchers] = useState([]);
  const [products, setProducts] = useState([]);
  const [allVouchers, setAllVouchers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [currentVoucher, setCurrentVoucher] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedVoucher, setSelectedVoucher] = useState(null);

  const fetchProductVouchers = async () => {
    setLoading(true);
    try {
      const result = await getAllProductVouchers();
      if (result && result.isSuccess) {
        const vouchersWithDetails = await Promise.all(
          result.result.map(async (voucher) => {
            const product = await getProductById(voucher.productID);
            const voucherDetails = await getVoucherById(voucher.vourcherID);
            return {
              ...voucher,
              productName: product ? product.productName : "Unknown",
              voucherCode: voucherDetails
                ? voucherDetails.vourcherCode
                : "Unknown",
            };
          })
        );
        setVouchers(vouchersWithDetails);
      } else {
        message.error("Failed to fetch product vouchers.");
      }
    } catch (error) {
      message.error("An error occurred while fetching product vouchers.");
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const products = await getAllProduct(1, 10);
      setProducts(products);
    } catch (error) {
      message.error("Failed to fetch products.");
    } finally {
      setLoading(false);
    }
  };

  const fetchVouchers = async () => {
    setLoading(true);
    try {
      const response = await getAllVouchers(1, 10);
      if (response && response.result) {
        setAllVouchers(response.result);
      } else {
        message.error("Failed to fetch vouchers.");
      }
    } catch (error) {
      message.error("Failed to fetch vouchers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductVouchers();
    fetchProducts();
    fetchVouchers();
  }, []);

  const handleDelete = async (voucherId) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this product voucher?"
    );
    if (confirm) {
      try {
        const result = await deleteProductVoucher(voucherId);
        if (result) {
          message.success("Product voucher deleted successfully!");
          fetchProductVouchers();
        } else {
          message.error("Failed to delete product voucher.");
        }
      } catch (error) {
        message.error("An error occurred while deleting the product voucher.");
      }
    }
  };

  const handleEdit = (voucher) => {
    setIsEditing(true);
    setCurrentVoucher(voucher);
  };

  const handleCloseEditForm = () => {
    setIsEditing(false);
    setCurrentVoucher(null);
    fetchProductVouchers(); // Refresh the list after closing the form
  };

  const handleCreate = async () => {
    if (!selectedProduct || !selectedVoucher) {
      message.error("Please select a product and a voucher.");
      return;
    }

    try {
      const response = await createProductVoucher(
        selectedProduct.productID,
        selectedVoucher.voucherID
      );
      if (response) {
        message.success("Product voucher created successfully!");
        fetchProductVouchers();
        setIsCreating(false);
      } else {
        message.error("Failed to create product voucher.");
      }
    } catch (error) {
      console.error("Failed to create product voucher:", error);
      message.error("Failed to create product voucher.");
    }
  };

  const columns = [
    {
      title: "Product Voucher ID",
      dataIndex: "productVoucherID",
      key: "productVoucherID",
    },
    {
      title: "Voucher Code",
      dataIndex: "voucherCode",
      key: "voucherCode",
    },
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div>
          <Button onClick={() => handleEdit(record)} style={{ marginRight: 8 }}>
            Edit
          </Button>
          <Button
            onClick={() => handleDelete(record.productVoucherID)}
            type="danger"
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h2>Product Vouchers</h2>
      <Button
        type="primary"
        onClick={() => {
          setIsCreating(true);
          setIsEditing(false);
        }}
        style={{ marginBottom: 16 }}
      >
        Create New Product Voucher
      </Button>
      {loading ? (
        <LoadingComponent />
      ) : (
        <Table
          dataSource={vouchers}
          columns={columns}
          rowKey="productVoucherID"
        />
      )}
      <Modal
        title="Create Product Voucher"
        visible={isCreating}
        onCancel={() => setIsCreating(false)}
        footer={null}
      >
        <div className="p-4 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-semibold mb-4 text-blue-500">
            Select Product and Voucher
          </h1>
          <Row gutter={16}>
            <Col span={12}>
              <h2 className="text-xl font-semibold mb-4">Select Product</h2>
              <Row gutter={16}>
                {products.map((product) => (
                  <Col span={8} key={product.productID}>
                    <Card
                      hoverable
                      cover={
                        <img
                          alt={product.productName}
                          src={product.productImage}
                        />
                      }
                      onClick={() => setSelectedProduct(product)}
                      className={
                        selectedProduct?.productID === product.productID
                          ? "border-blue-500"
                          : ""
                      }
                    >
                      <Card.Meta title={product.productName} />
                    </Card>
                  </Col>
                ))}
              </Row>
            </Col>
            <Col span={12}>
              <h2 className="text-xl font-semibold mb-4">Select Voucher</h2>
              <Row gutter={16}>
                {allVouchers.map((voucher) => (
                  <Col span={8} key={voucher.voucherID}>
                    <Card
                      hoverable
                      onClick={() => setSelectedVoucher(voucher)}
                      className={
                        selectedVoucher?.voucherID === voucher.voucherID
                          ? "border-blue-500"
                          : ""
                      }
                    >
                      <Card.Meta
                        title={voucher.voucherCode}
                        description={voucher.description}
                      />
                    </Card>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
          <div className="flex justify-end mt-4">
            <Button type="primary" onClick={handleCreate} loading={loading}>
              Create Product Voucher
            </Button>
          </div>
        </div>
      </Modal>
      <Modal
        title="Edit Product Voucher"
        visible={isEditing}
        onCancel={handleCloseEditForm}
        footer={null}
      >
        <EditCreateProductForm
          voucher={currentVoucher}
          onClose={handleCloseEditForm}
        />
      </Modal>
    </div>
  );
};

export default ProductVoucher;
