import { Button, message, Table } from "antd";
import React, { useEffect, useState } from "react";
import {
  deleteProductVoucher,
  getAllProductVouchers,
} from "../../../api/ProductVoucherApi";
import LoadingComponent from "../../../components/LoadingComponent/LoadingComponent";
import { CreateProductVoucherForm } from "./CreateProductVourcherForm";
import { EditCreateProductForm } from "./EditCreateProductForm";

const ProductVoucher = () => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [currentVoucher, setCurrentVoucher] = useState(null);

  const fetchProductVouchers = async () => {
    setLoading(true);
    const result = await getAllProductVouchers();
    if (result && result.isSuccess) {
      setVouchers(result.result || []);
    } else {
      message.error("Failed to fetch product vouchers.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProductVouchers();
  }, []);

  const handleDelete = async (voucherId) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this product voucher?"
    );
    if (confirm) {
      const result = await deleteProductVoucher(voucherId);
      if (result) {
        message.success("Product voucher deleted successfully!");
        fetchProductVouchers();
      } else {
        message.error("Failed to delete product voucher.");
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
    fetchProductVouchers();
  };

  const columns = [
    {
      title: "Product Voucher ID",
      dataIndex: "productVoucherID",
      key: "productVoucherID",
    },
    {
      title: "Voucher ID",
      dataIndex: "voucherID",
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
      render: (
        _,
        record // Use '_' for unused parameter
      ) => (
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
        }} // Set to create mode
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
      {isCreating && (
        <CreateProductVoucherForm
          onClose={() => setIsCreating(false)}
          fetchVouchers={fetchProductVouchers}
        />
      )}
      {isEditing && (
        <EditCreateProductForm
          voucher={currentVoucher}
          onClose={handleCloseEditForm}
        />
      )}
    </div>
  );
};

export default ProductVoucher;
