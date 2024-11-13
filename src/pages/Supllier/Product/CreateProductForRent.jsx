import { UploadOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Form,
  Input,
  message,
  Select,
  Space,
  Upload,
} from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getSupplierIdByAccountId } from "../../../api/accountApi"; // Điều chỉnh đường dẫn nếu cần
import { getAllCategories } from "../../../api/categoryApi";
import { createProductRent } from "../../../api/productApi"; // Điều chỉnh đường dẫn nếu cần

const { Option } = Select;

const CreateProductForRent = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [file, setFile] = useState(null);
  const user = useSelector((state) => state.user.user || {});
  const [supplierId, setSupplierId] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  const [specifications, setSpecifications] = useState([
    { feature: "", description: "" },
  ]);
  const [priceType, setPriceType] = useState("PricePerHour"); // Giá mặc định là theo giờ

  // Fetch Supplier ID and Categories
  useEffect(() => {
    const fetchSupplierId = async () => {
      if (user.id) {
        try {
          const response = await getSupplierIdByAccountId(user.id);
          if (response?.isSuccess) {
            setSupplierId(response.result);
          } else {
            message.error("Lấy ID Nhà cung cấp không thành công.");
          }
        } catch (error) {
          message.error("Lỗi khi lấy ID Nhà cung cấp.");
        }
      }
    };

    const fetchCategories = async () => {
      setLoading(true);
      try {
        const data = await getAllCategories(1, 100);
        if (data?.result) {
          setCategories(data.result);
        } else {
          message.error("Tải danh mục không thành công.");
        }
      } catch (error) {
        console.error("Lỗi tải:", error);
        message.error("Đã xảy ra lỗi khi tải danh mục.");
      } finally {
        setLoading(false);
      }
    };

    fetchSupplierId();
    fetchCategories();
  }, [user]);

  const handleFileChange = (info) => {
    if (info.file.status === "done" || info.file.status === "uploading") {
      setFile(info.file.originFileObj);
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreview(e.target.result);
      };
      reader.readAsDataURL(info.file.originFileObj);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setFilePreview(null);
  };

  const handleCreateProduct = async (values) => {
    const validSpecifications = specifications.filter(
      (spec) => spec.feature && spec.description
    );
    const {
      SerialNumber,
      CategoryID,
      ProductName,
      ProductDescription,
      Quality,
      PricePerHour = 0,
      PricePerDay = 0,
      PricePerWeek = 0,
      PricePerMonth = 0,
      Brand,
    } = values;

    if (!supplierId) {
      message.error("Supplier ID is missing or invalid.");
      return;
    }

    const product = {
      SerialNumber,
      SupplierID: supplierId,
      CategoryID,
      ProductName,
      ProductDescription,
      Quality,
      PricePerHour,
      PricePerDay,
      PricePerWeek,
      PricePerMonth,
      Brand,
      File: file,
      listProductSpecification: validSpecifications,
    };

    try {
      setLoading(true);
      const result = await createProductRent(product);

      if (result) {
        message.success("Product created successfully!");
        form.resetFields();
        setFile(null);
      } else {
        message.error("Failed to create product.");
      }
    } catch (error) {
      console.error("Error when creating product:", error);
      message.error("An error occurred while creating the product.");
    } finally {
      setLoading(false);
    }
  };

  const handlePriceTypeChange = (value) => {
    setPriceType(value);
    // Đặt tất cả giá còn lại thành 0 khi giá được chọn
    if (value === "PricePerHour") {
      form.setFieldsValue({
        PricePerDay: 0,
        PricePerWeek: 0,
        PricePerMonth: 0,
      });
    } else if (value === "PricePerDay") {
      form.setFieldsValue({
        PricePerHour: 0,
        PricePerWeek: 0,
        PricePerMonth: 0,
      });
    } else if (value === "PricePerWeek") {
      form.setFieldsValue({
        PricePerHour: 0,
        PricePerDay: 0,
        PricePerMonth: 0,
      });
    } else if (value === "PricePerMonth") {
      form.setFieldsValue({ PricePerHour: 0, PricePerDay: 0, PricePerWeek: 0 });
    }
  };

  const handleAddSpecification = () => {
    setSpecifications([...specifications, { feature: "", description: "" }]);
  };

  const handleSpecificationChange = (value, index) => {
    const newSpecifications = [...specifications];
    newSpecifications[index] = value;
    setSpecifications(newSpecifications);
  };

  const handleRemoveSpecification = (index) => {
    const newSpecifications = specifications.filter((_, i) => i !== index);
    setSpecifications(newSpecifications);
  };

  return (
    <Form
      form={form}
      onFinish={handleCreateProduct}
      initialValues={{
        Quality: 0,
        PricePerHour: 0,
        PricePerDay: 0,
        PricePerWeek: 0,
        PricePerMonth: 0,
      }} // Đặt giá trị mặc định nếu cần
    >
      <Form.Item
        name="SerialNumber"
        label="Số Serial"
        rules={[{ required: true, message: "Vui lòng nhập số serial!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="CategoryID"
        label="Danh mục"
        rules={[{ required: true, message: "Vui lòng chọn một danh mục!" }]}
      >
        <Select placeholder="Chọn một danh mục">
          {categories.map((category) => (
            <Option key={category.categoryID} value={category.categoryID}>
              {category.categoryName}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="ProductName"
        label="Tên sản phẩm"
        rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="ProductDescription"
        label="Mô tả"
        rules={[{ required: true, message: "Vui lòng nhập mô tả sản phẩm!" }]}
      >
        <Input.TextArea />
      </Form.Item>

      <Form.Item
        name="Quality"
        label="Chất lượng"
        rules={[
          { required: true, message: "Vui lòng nhập chất lượng sản phẩm!" },
        ]}
      >
        <Select placeholder="Đánh giá chất lượng sản phẩm">
          <Option value={0}>Mới</Option>
          <Option value={1}>Đã qua sử dụng</Option>
        </Select>
      </Form.Item>

      <Form.Item label="Chọn loại giá">
        <Checkbox.Group onChange={handlePriceTypeChange} value={priceType}>
          <Checkbox value="PricePerHour">Giá theo giờ</Checkbox>
          <Checkbox value="PricePerDay">Giá theo ngày</Checkbox>
          <Checkbox value="PricePerWeek">Giá theo tuần</Checkbox>
          <Checkbox value="PricePerMonth">Giá theo tháng</Checkbox>
        </Checkbox.Group>
      </Form.Item>

      {priceType.includes("PricePerHour") && (
        <Form.Item
          name="PricePerHour"
          label="Giá theo giờ"
          rules={[
            { required: true, message: "Vui lòng nhập giá theo giờ!" },
            { type: "number", transform: (value) => Number(value) },
          ]}
        >
          <Input type="number" placeholder="Nhập giá theo giờ" />
        </Form.Item>
      )}

      {priceType.includes("PricePerDay") && (
        <Form.Item
          name="PricePerDay"
          label="Giá theo ngày"
          rules={[
            { required: true, message: "Vui lòng nhập giá theo ngày!" },
            { type: "number", transform: (value) => Number(value) },
          ]}
        >
          <Input type="number" placeholder="Nhập giá theo ngày" />
        </Form.Item>
      )}

      {priceType.includes("PricePerWeek") && (
        <Form.Item
          name="PricePerWeek"
          label="Giá theo tuần"
          rules={[
            { required: true, message: "Vui lòng nhập giá theo tuần!" },
            { type: "number", transform: (value) => Number(value) },
          ]}
        >
          <Input type="number" placeholder="Nhập giá theo tuần" />
        </Form.Item>
      )}

      {priceType.includes("PricePerMonth") && (
        <Form.Item
          name="PricePerMonth"
          label="Giá theo tháng"
          rules={[
            { required: true, message: "Vui lòng nhập giá theo tháng!" },
            { type: "number", transform: (value) => Number(value) },
          ]}
        >
          <Input type="number" placeholder="Nhập giá theo tháng" />
        </Form.Item>
      )}

      <Form.Item
        name="Brand"
        label="Thương hiệu"
        rules={[{ required: true, message: "Vui lòng chọn một thương hiệu" }]}
      >
        <Select placeholder="Chọn một thương hiệu">
          <Option value={0}>Canon</Option>
          <Option value={1}>Nikon</Option>
          <Option value={2}>Sony</Option>
          <Option value={3}>Fujifilm</Option>
          <Option value={4}>Olympus</Option>
          <Option value={5}>Panasonic</Option>
          <Option value={6}>Leica</Option>
          <Option value={7}>Pentax</Option>
          <Option value={8}>Hasselblad</Option>
        </Select>
      </Form.Item>

      <Form.Item label="Đặc điểm sản phẩm">
        {specifications.map((specification, index) => (
          <Space key={index} style={{ display: "flex", marginBottom: 8 }}>
            <Input
              value={specification.feature}
              onChange={(e) =>
                handleSpecificationChange(e.target.value, index, "feature")
              }
              placeholder={`Đặc điểm ${index + 1}`}
              style={{ width: "100%" }}
            />
            <Input
              value={specification.description}
              onChange={(e) =>
                handleSpecificationChange(e.target.value, index, "description")
              }
              placeholder={`Mô tả ${index + 1}`}
              style={{ width: "40%" }}
            />
            <Button
              type="danger"
              onClick={() => handleRemoveSpecification(index)}
            >
              Xóa
            </Button>
          </Space>
        ))}
        <Button type="dashed" onClick={handleAddSpecification}>
          Thêm đặc điểm
        </Button>
      </Form.Item>
      <Form.Item label="Hình ảnh">
        <Upload
          name="file"
          listType="picture"
          beforeUpload={(file) => {
            const isImage = file.type.startsWith("image/");
            if (!isImage) {
              message.error("Chỉ có thể tải lên hình ảnh!");
            }
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
              message.error("Hình ảnh phải nhỏ hơn 2MB!");
            }
            return isImage && isLt2M;
          }}
          onChange={handleFileChange}
          onRemove={handleRemoveFile}
          showUploadList={false} // if you only want to display the preview below
        >
          <Button icon={<UploadOutlined />}>Tải lên hình ảnh</Button>
        </Upload>
        {filePreview && (
          <img
            src={filePreview}
            alt="Preview"
            style={{ maxWidth: "100%", marginTop: 8 }}
          />
        )}
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Tạo sản phẩm
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreateProductForRent;
