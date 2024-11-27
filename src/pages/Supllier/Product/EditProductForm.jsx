import { Button, Form, Input, Modal, Select, message } from "antd";
import React, { useEffect, useState } from "react";
import { getAllCategories } from "../../../api/categoryApi";
import { updateProduct, updateProductRent } from "../../../api/productApi";

const { Option } = Select;

const EditProductForm = ({ open, onClose, product, onUpdateSuccess }) => {
  const [form] = Form.useForm();
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(product?.imageUrl || null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(
    product?.categoryID || null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(product?.status || 0);

  useEffect(() => {
    if (open) {
      fetchCategories();
    }
  }, [open]);

  useEffect(() => {
    if (product) {
      form.setFieldsValue({
        productName: product.productName,
        productDescription: product.productDescription,
        priceRent: product.priceRent,
        priceBuy: product.priceBuy,
        brand: product.brand,
        quality: product.quality,
        status: product.status,
        serialNumber: product.serialNumber,
        CategoryID: product.categoryID,
        pricePerHour: product.pricePerHour,
        pricePerDay: product.pricePerDay,
        pricePerWeek: product.pricePerWeek,
        pricePerMonth: product.pricePerMonth,
        originalPrice: product.originalPrice,
        countRent: product.countRent,
        depositProduct: product.depositProduct,
      });
      setSelectedCategory(product.categoryID);
      setStatus(product.status);
      setImageUrl(product.imageUrl);
    }
  }, [product, form]);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const data = await getAllCategories(1, 100);
      if (data && data.result) {
        setCategories(data.result);
      } else {
        message.error("Không thể tải danh mục. Vui lòng thử lại sau.");
      }
    } catch (error) {
      console.error("Lỗi khi tải danh mục:", error);
      message.error("Đã xảy ra lỗi khi tải danh mục.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImageUrl(null);
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("ProductID", product.productID);
      formData.append("SerialNumber", values.serialNumber);
      formData.append("CategoryID", selectedCategory);
      formData.append("ProductName", values.productName);
      formData.append("ProductDescription", values.productDescription);
      formData.append("PriceRent", values.priceRent || 0);
      formData.append("PriceBuy", values.priceBuy);
      formData.append("Brand", values.brand);
      formData.append("Quality", values.quality);
      formData.append("Status", values.status);
      formData.append("DateOfManufacture", values.dateOfManufacture);
      formData.append("OriginalPrice", values.originalPrice);
      formData.append("CountRent", values.countRent);
      formData.append("DepositProduct", values.depositProduct);
      formData.append(
        "listProductSpecification",
        values.listProductSpecification
      );

      if (file) {
        formData.append("File", file);
      }

      let result;
      if (values.status === 0) {
        result = await updateProduct(formData);
      } else if (values.status === 1) {
        result = await updateProductRent({
          productID: product.productID,
          serialNumber: values.serialNumber,
          categoryID: selectedCategory,
          productName: values.productName,
          productDescription: values.productDescription,
          pricePerHour: values.pricePerHour,
          pricePerDay: values.pricePerDay,
          pricePerWeek: values.pricePerWeek,
          pricePerMonth: values.pricePerMonth,
          brand: values.brand,
          quality: values.quality,
          status: values.status,
          listProductSpecification: values.listProductSpecification,
        });
      }

      if (result) {
        onUpdateSuccess(result);
        message.success("Cập nhật sản phẩm thành công!");
        form.resetFields();
        onClose();
      } else {
        message.error("Cập nhật sản phẩm thất bại.");
      }
    } catch (error) {
      console.error("Cập nhật thất bại:", error);
      message.error("Cập nhật thất bại: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const filterOption = (inputValue, option) =>
    option.children.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title="Chỉnh Sửa Sản Phẩm"
      open={open}
      onCancel={handleClose}
      footer={null}
    >
      <Form form={form} onFinish={handleSubmit}>
        <Form.Item
          name="productName"
          label="Tên Sản Phẩm"
          rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="productDescription" label="Mô Tả">
          <Input.TextArea />
        </Form.Item>
        {status === 0 && (
          <>
            <Form.Item
              name="priceBuy"
              label="Giá Bán"
              rules={[{ required: true, message: "Vui lòng nhập giá bán" }]}
            >
              <Input type="number" />
            </Form.Item>
          </>
        )}
        <Form.Item
          name="brand"
          label="Thương Hiệu"
          rules={[{ required: true, message: "Vui lòng chọn thương hiệu" }]}
        >
          <Select placeholder="Chọn thương hiệu">
            <Option value={0}>Canon</Option>
            <Option value={1}>Nikon</Option>
            <Option value={2}>Sony</Option>
            <Option value={3}>Fujifilm</Option>
            <Option value={4}>Olympus</Option>
            <Option value={5}>Panasonic</Option>
            <Option value={6}>Leica</Option>
            <Option value={7}>Pentax</Option>
            <Option value={8}>Hasselblad</Option>
            <Option value={9}>Sigma</Option>
            <Option value={10}>Khác</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="quality"
          label="Chất Lượng"
          rules={[{ required: true, message: "Vui lòng chọn chất lượng" }]}
        >
          <Select placeholder="Chọn chất lượng">
            <Option value="High">Cao</Option>
            <Option value="Medium">Trung Bình</Option>
            <Option value="Low">Thấp</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="status"
          label="Trạng Thái"
          rules={[
            { required: true, message: "Vui lòng chọn trạng thái sản phẩm" },
          ]}
        >
          <Select
            placeholder="Chọn trạng thái"
            onChange={(value) => setStatus(value)}
          >
            <Option value={0}>Sẵn Bán</Option>
            <Option value={1}>Có Sẵn Để Thuê</Option>
            <Option value={4}>Ngừng Kinh Doanh</Option>
          </Select>
        </Form.Item>
        {status === 1 && (
          <>
            <Form.Item name="depositProduct" label="Giá Cọc">
              <Input type="number" />
            </Form.Item>
            <Form.Item name="pricePerHour" label="Giá Theo Giờ">
              <Input type="number" />
            </Form.Item>
            <Form.Item name="pricePerDay" label="Giá Theo Ngày">
              <Input type="number" />
            </Form.Item>
            <Form.Item name="pricePerWeek" label="Giá Theo Tuần">
              <Input type="number" />
            </Form.Item>
            <Form.Item name="pricePerMonth" label="Giá Theo Tháng">
              <Input type="number" />
            </Form.Item>
          </>
        )}
        <Form.Item
          name="serialNumber"
          label="Số Serial"
          rules={[{ required: true, message: "Vui lòng nhập số serial" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="CategoryID"
          label="Danh Mục"
          rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}
        >
          <Select
            showSearch
            placeholder="Chọn danh mục"
            filterOption={filterOption}
            loading={isLoading}
            onChange={(value) => setSelectedCategory(value)}
            value={selectedCategory}
          >
            {categories.map((category) => (
              <Option key={category.categoryID} value={category.categoryID}>
                {category.categoryName}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="originalPrice"
          label="Giá Gốc"
          rules={[{ required: true, message: "Vui lòng nhập giá gốc" }]}
        >
          <Input type="number" />
        </Form.Item>
        <Form.Item
          name="countRent"
          label="Số Lần Thuê"
          rules={[{ required: true, message: "Vui lòng nhập số lần thuê" }]}
        >
          <Input type="number" />
        </Form.Item>
        <Form.Item label="Tải Lên Hình Ảnh">
          <Input type="file" accept="image/*" onChange={handleFileChange} />
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Selected"
              style={{ marginTop: "10px", maxWidth: "100%" }}
            />
          )}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Cập Nhật Sản Phẩm
          </Button>
          <Button onClick={handleClose}>Cancel</Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditProductForm;
