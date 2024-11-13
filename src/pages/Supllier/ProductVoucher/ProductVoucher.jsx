import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Table,
  Typography,
} from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import React, { useEffect, useState } from "react";
import {
  createProductVoucher,
  deleteProductVoucher,
  getAllProductVouchers,
  updateProductVoucher,
} from "../../../api/ProductVoucherApi";
import { getAllProduct, getProductById } from "../../../api/productApi";
import { getAllVouchers, getVoucherById } from "../../../api/voucherApi";
import LoadingComponent from "../../../components/LoadingComponent/LoadingComponent";

dayjs.extend(customParseFormat);

const { Option } = Select;
const { Title } = Typography;

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
  const [form] = Form.useForm();

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
              productName: product ? product.productName : "Không xác định",
              productDescription: product
                ? product.description
                : "Không xác định",
              vourcherCode: voucherDetails
                ? voucherDetails.vourcherCode
                : "Không xác định",
            };
          })
        );
        setVouchers(vouchersWithDetails);
      } else {
        message.error("Lấy dữ liệu voucher sản phẩm thất bại.");
      }
    } catch (error) {
      message.error("Đã xảy ra lỗi khi lấy dữ liệu voucher sản phẩm.");
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const products = await getAllProduct(1, 10);
      const filteredProducts = products.filter(
        (product) => product.status === 0 || product.status === 1
      );
      setProducts(filteredProducts);
    } catch (error) {
      message.error("Lấy dữ liệu sản phẩm thất bại.");
    } finally {
      setLoading(false);
    }
  };

  const fetchVouchers = async () => {
    setLoading(true);
    try {
      const response = await getAllVouchers(1, 10);
      if (response && response.result) {
        const filteredVouchers = response.result.filter((voucher) =>
          dayjs(voucher.expirationDate).isAfter(dayjs())
        );
        setAllVouchers(filteredVouchers);
      } else {
        message.error("Lấy dữ liệu voucher thất bại.");
      }
    } catch (error) {
      message.error("Lấy dữ liệu voucher thất bại.");
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
      "Bạn có chắc muốn xóa voucher sản phẩm này không?"
    );
    if (confirm) {
      try {
        const result = await deleteProductVoucher(voucherId);
        if (result) {
          message.success("Xóa voucher sản phẩm thành công!");
          fetchProductVouchers();
        } else {
          message.error("Xóa voucher sản phẩm thất bại.");
        }
      } catch (error) {
        message.error("Đã xảy ra lỗi khi xóa voucher sản phẩm.");
      }
    }
  };

  const handleEdit = (voucher) => {
    setIsEditing(true);
    setCurrentVoucher(voucher);
    form.setFieldsValue({
      productID: voucher.productID,
      vourcherID: voucher.vourcherID,
    });
  };

  const handleCloseEditForm = () => {
    setIsEditing(false);
    setCurrentVoucher(null);
    form.resetFields();
    fetchProductVouchers();
  };

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      const response = await updateProductVoucher(
        currentVoucher.productVoucherID,
        values
      );
      if (response && response.isSuccess) {
        message.success("Cập nhật voucher sản phẩm thành công!");
        handleCloseEditForm();
      } else {
        message.error(
          response.messages[0] || "Cập nhật voucher sản phẩm thất bại."
        );
      }
    } catch (error) {
      console.error("Cập nhật voucher sản phẩm thất bại:", error);
      message.error("Cập nhật voucher sản phẩm thất bại.");
    }
  };

  const handleCreate = async () => {
    if (!selectedProduct || !selectedVoucher) {
      message.error("Vui lòng chọn sản phẩm và voucher.");
      return;
    }

    try {
      const response = await createProductVoucher(
        selectedProduct.productID,
        selectedVoucher.vourcherID
      );
      if (response && response.isSuccess) {
        message.success("Tạo voucher sản phẩm thành công!");
        fetchProductVouchers();
        setIsCreating(false);
      } else {
        message.error(response.messages[0] || "Tạo voucher sản phẩm thất bại.");
      }
    } catch (error) {
      console.error("Tạo voucher sản phẩm thất bại:", error);
      message.error("Tạo voucher sản phẩm thất bại.");
    }
  };

  const columns = [
    {
      title: "Mã Voucher Sản Phẩm",
      dataIndex: "productVoucherID",
      key: "productVoucherID",
      align: "center",
    },
    {
      title: "Mã Voucher",
      dataIndex: "vourcherCode",
      key: "vourcherCode",
      align: "center",
    },
    {
      title: "Tên Sản Phẩm",
      dataIndex: "productName",
      key: "productName",
      align: "center",
      width: 200, // Adjust the width as needed
      ellipsis: true, // Add ellipsis for overflow
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => dayjs(text).format("DD/MM/YYYY HH:mm:ss A"),
      align: "center",
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (text) => dayjs(text).format("DD/MM/YYYY HH:mm:ss A"),
      align: "center",
    },
    {
      title: "Hành Động",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <div className="flex space-x-2">
          <Button
            onClick={() => handleEdit(record)}
            type="primary"
            icon={<EditOutlined />}
          >
            Sửa
          </Button>
          <Button
            onClick={() => handleDelete(record.productVoucherID)}
            danger
            icon={<DeleteOutlined />}
          >
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md">
      <Title level={2} className="text-center mb-4 text-blue-500">
        Voucher Sản Phẩm
      </Title>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => {
          setIsCreating(true);
          setIsEditing(false);
        }}
        className="mb-4 bg-blue-500 border-blue-500 hover:bg-blue-600"
      >
        Thêm Voucher
      </Button>

      {loading ? (
        <LoadingComponent />
      ) : (
        <Table
          dataSource={vouchers}
          columns={columns}
          rowKey="productVoucherID"
          className="mb-4 rounded-lg"
          pagination={{ position: ["bottomCenter"] }}
        />
      )}

      {/* Create Modal */}
      <Modal
        title="Tạo Voucher Sản Phẩm"
        open={isCreating}
        onCancel={() => setIsCreating(false)}
        footer={null}
      >
        <div className="p-4">
          <Row gutter={16}>
            <Col span={12}>
              <Title level={5} className="mb-4">
                Chọn Sản Phẩm
              </Title>
              <Row gutter={[16, 16]}>
                {products.map((product) => (
                  <Col span={24} key={product.productID}>
                    <Card
                      hoverable
                      onClick={() => setSelectedProduct(product)}
                      className={`p-4 border ${
                        selectedProduct?.productID === product.productID
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300"
                      }`}
                    >
                      <Card.Meta
                        title={
                          <div
                            style={{
                              whiteSpace: "normal",
                              wordWrap: "break-word",
                            }}
                          >
                            {product.productName}
                          </div>
                        }
                        description={product.description}
                      />
                    </Card>
                  </Col>
                ))}
              </Row>
            </Col>
            <Col span={12}>
              <Title level={5} className="mb-4">
                Chọn Voucher
              </Title>
              <Row gutter={[16, 16]}>
                {allVouchers.map((voucher) => (
                  <Col span={24} key={voucher.vourcherID}>
                    <Card
                      hoverable
                      onClick={() => setSelectedVoucher(voucher)}
                      className={`p-4 border ${
                        selectedVoucher?.vourcherID === voucher.vourcherID
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300"
                      }`}
                    >
                      <Card.Meta
                        title={
                          <div
                            style={{
                              whiteSpace: "normal",
                              wordWrap: "break-word",
                            }}
                          >
                            {voucher.vourcherCode}
                          </div>
                        }
                        description={voucher.description}
                      />
                    </Card>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
          <div className="flex justify-end mt-4">
            <Button
              type="primary"
              onClick={handleCreate}
              block
              className="bg-blue-500 border-blue-500 hover:bg-blue-600"
            >
              Xác nhận
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        title="Sửa Voucher Sản Phẩm"
        open={isEditing}
        onCancel={handleCloseEditForm}
        onOk={handleUpdate}
        footer={[
          <Button key="back" onClick={handleCloseEditForm}>
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleUpdate}
            loading={loading}
            className="bg-blue-500 border-blue-500 hover:bg-blue-600"
          >
            Cập nhật
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="productID"
            label="Mã Sản Phẩm"
            rules={[{ required: true, message: "Vui lòng nhập mã sản phẩm" }]}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="vourcherID"
            label="Mã Voucher"
            rules={[{ required: true, message: "Vui lòng nhập mã voucher" }]}
          >
            <Select>
              {allVouchers.map((voucher) => (
                <Option key={voucher.vourcherID} value={voucher.vourcherID}>
                  {voucher.vourcherCode}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductVoucher;
