import { Button, message, Modal, Table } from "antd";
import React, { useEffect, useState } from "react";
import {
  deleteProductVoucher,
  getAllProductVouchers,
} from "../../../api/ProductVoucherApi";
import LoadingComponent from "../../../components/LoadingComponent/LoadingComponent";
import CreateProductVoucherForm from "./CreateProductVourcherForm";
import EditCreateProductForm from "./EditCreateProductForm";

const ProductVoucher = () => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [currentVoucher, setCurrentVoucher] = useState(null);

  const fetchProductVouchers = async () => {
    setLoading(true);
    try {
      const result = await getAllProductVouchers();
      if (result && result.isSuccess) {
        setVouchers(result.result || []);
      } else {
        message.error("Failed to fetch product vouchers.");
      }
    } catch (error) {
      message.error("An error occurred while fetching product vouchers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductVouchers();
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

  const handleCreate = (newVoucher) => {
    setVouchers((prevVouchers) => [...prevVouchers, newVoucher]);
    setIsCreating(false);
  };

  const columns = [
    {
      title: "Product Voucher ID",
      dataIndex: "productVoucherID",
      key: "productVoucherID",
    },
    {
      title: "Voucher ID",
      dataIndex: "vourcherID",
      key: "voucherID",
    },
    {
      title: "Product ID",
      dataIndex: "productID",
      key: "productID",
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
        <CreateProductVoucherForm
          onClose={() => setIsCreating(false)}
          fetchVouchers={fetchProductVouchers}
          onCreate={handleCreate} // Pass the callback function
        />
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
