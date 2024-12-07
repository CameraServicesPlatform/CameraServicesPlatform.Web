import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Form,
  Input,
  Radio,
  Select,
  Upload,
  message,
} from "antd";
import React from "react";
import Specifications from "./Specifications";

const { Option } = Select;

const CreateProductForm = ({
  form,
  categories,
  productType,
  setProductType,
  priceType,
  setPriceType,
  specifications,
  setSpecifications,
  handleCreateProduct,
  handleFileChange,
  handleRemoveFile,
  filePreview,
  loading,
  canBeRentedByMember,
  setIsContractModalVisible,
}) => {
  const handlePriceTypeChange = (value) => {
    setPriceType(value);
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

  return (
    <Form
      form={form}
      onFinish={handleCreateProduct}
      initialValues={{
        Quality: 0,
        DepositProduct: "",
        PricePerHour: 0,
        PricePerDay: 0,
        PricePerWeek: 0,
        PricePerMonth: 0,
      }}
    >
      <Form.Item label="Loại sản phẩm">
        <Radio.Group
          onChange={(e) => setProductType(e.target.value)}
          value={productType}
        >
          <Radio value="rent">Thuê</Radio>
          <Radio value="buy">Mua</Radio>
        </Radio.Group>
      </Form.Item>

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

      <Form.Item
        name="DateOfManufacture"
        label="Ngày sản xuất"
        rules={[{ required: true, message: "Vui lòng nhập ngày sản xuất!" }]}
      >
        <Input type="date" />
      </Form.Item>

      <Form.Item
        name="OriginalPrice"
        label="Giá gốc"
        rules={[
          { required: true, message: "Vui lòng nhập giá gốc!" },
          { type: "number", transform: (value) => Number(value) },
        ]}
      >
        <Input type="number" placeholder="Nhập giá gốc" />
      </Form.Item>

      {productType === "rent" && (
        <>
          <Form.Item
            name="DepositProduct"
            label="Cọc"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập tiền cọc cho sản phẩm!",
              },
            ]}
          >
            <Input />
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
        </>
      )}

      {productType === "buy" && (
        <Form.Item
          name="Price"
          label="Giá"
          rules={[
            { required: true, message: "Vui lòng nhập giá sản phẩm!" },
            { type: "number", transform: (value) => Number(value) },
          ]}
        >
          <Input type="number" placeholder="Nhập giá sản phẩm" />
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

      <Specifications
        specifications={specifications}
        setSpecifications={setSpecifications}
      />

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
          showUploadList={false}
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
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setIsVoucherModalVisible(true)}
      >
        Chọn Voucher
      </Button>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Tạo sản phẩm
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreateProductForm;
