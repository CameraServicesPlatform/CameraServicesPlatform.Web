import { UploadOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Select,
  Spin,
  Tooltip,
  Typography,
  Upload,
} from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "tailwindcss/tailwind.css";
import { getSupplierIdByAccountId } from "../../../../api/accountApi";
import { getAllCategories } from "../../../../api/categoryApi";
import {
  createProductBuy,
  createProductRent,
} from "../../../../api/productApi";
import { getVouchersBySupplierId } from "../../../../api/voucherApi";
import ContractModal from "./ContractModal";
import ProductTypeRadioGroup from "./ProductTypeRadioGroup";
import Specifications from "./Specifications";
import VoucherModal from "./VoucherModal";
 const { Option } = Select;
const { Title } = Typography;
const CreateProduct = ({ isCreateModalVisible, handleCreateModalCancel }) => {
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
  const [priceType, setPriceType] = useState([]);
  const [productType, setProductType] = useState("rent");
  const [vouchers, setVouchers] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [isVoucherModalVisible, setIsVoucherModalVisible] = useState(false);
  const [canBeRentedByMember, setCanBeRentedByMember] = useState(false);
  const [isContractModalVisible, setIsContractModalVisible] = useState(false);

  useEffect(() => {
    if (supplierId) {
      fetchVouchers();
    }
  }, [supplierId]);

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

  const fetchVouchers = async () => {
    setLoading(true);
    try {
      const response = await getVouchersBySupplierId(supplierId, 1, 100);
      if (response && response.result) {
        setVouchers(response.result);
      } else {
        message.error("Lấy dữ liệu voucher thất bại.");
      }
    } catch (error) {
      message.error("Lấy dữ liệu voucher thất bại.");
    } finally {
      setLoading(false);
    }
  };

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
      DepositProduct,
      PricePerHour = 0,
      PricePerDay = 0,
      PricePerWeek = 0,
      PricePerMonth = 0,
      Brand,
      Price,
      DateOfManufacture,
      OriginalPrice,
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
      Brand,
      File: file,
      listProductSpecification: validSpecifications,
      DateOfManufacture,
      OriginalPrice,
      VoucherID: selectedVoucher ? selectedVoucher.vourcherID : null,
      Status: 1,
      PriceRent: 0,
    };

    if (productType === "rent") {
      product.DepositProduct = DepositProduct;
      product.PricePerHour = PricePerHour;
      product.PricePerDay = PricePerDay;
      product.PricePerWeek = PricePerWeek;
      product.PricePerMonth = PricePerMonth;
      product.PriceRent = 0;
    } else {
      product.PriceBuy = Price;
    }

    try {
      setLoading(true);
      let result;
      if (productType === "rent") {
        result = await createProductRent(product);
      } else {
        result = await createProductBuy(product);
      }

      if (result) {
        message.success("Product created successfully!");
        form.resetFields();
        setFile(null);

        if (canBeRentedByMember) {
          setIsContractModalVisible(true);
        }
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

  const handleVoucherSelect = (voucher) => {
    setSelectedVoucher(voucher);
    setIsVoucherModalVisible(false);
    form.setFieldsValue({ Voucher: voucher.vourcherCode });
  };

  const handleCreateContractTemplate = () => {};

  const handleModalCancel = () => {
    form.resetFields();
    setFile(null);
    setFilePreview(null);
    handleCreateModalCancel();
  };

  return (
    <Spin spinning={loading}>
      <Form
        form={form}
        onFinish={handleCreateProduct}
        layout="vertical"
        initialValues={{
          Quality: 0,
          DepositProduct: "",
          PricePerHour: 0,
          PricePerDay: 0,
          PricePerWeek: 0,
          PricePerMonth: 0,
        }}
        className="space-y-4"
      >
        <ProductTypeRadioGroup
          productType={productType}
          setProductType={setProductType}
        />
        <Form.Item
          name="ProductName"
          label="Tên sản phẩm"
          rules={[
            { required: true, message: "Vui lòng nhập tên sản phẩm!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="SerialNumber"
          label="Số Serial"
          rules={[
            { required: true, message: "Vui lòng nhập số serial!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="CategoryID"
          label="Danh mục"
          rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}
        >
          <Select placeholder="Chọn danh mục">
            {categories.map((category) => (
              <Option key={category.categoryID} value={category.categoryID}>
                {category.categoryName}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="ProductDescription"
          label="Mô tả sản phẩm"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập mô tả sản phẩm!",
            },
          ]}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          name="Quality"
          label="Chất lượng"
          rules={[{ required: true, message: "Vui lòng chọn chất lượng!" }]}
        >
          <Select>
            <Option value="new">Mới</Option>
            <Option value="used">Đã qua sử dụng</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="DateOfManufacture"
          label="Date of Manufacture"
          rules={[
            {
              required: true,
              message: "Please select the date of manufacture!",
            },
          ]}
        >
          <DatePicker />
        </Form.Item>
        <Form.Item
          name="OriginalPrice"
          label="Original Price"
          rules={[
            { required: true, message: "Please input the original price!" },
          ]}
        >
          <InputNumber min={0} className="w-full" />
        </Form.Item>
        {productType === "rent" && (
          <>
            <Form.Item
              name="DepositProduct"
              label="Deposit Product"
              rules={[
                { required: true, message: "Please input the deposit amount!" },
              ]}
            >
              <InputNumber min={0} className="w-full" />
            </Form.Item>
            <Form.Item
              name="PricePerHour"
              label="Price Per Hour"
              rules={[
                { required: true, message: "Please input the price per hour!" },
              ]}
            >
              <InputNumber min={0} className="w-full" />
            </Form.Item>
            <Form.Item
              name="PricePerDay"
              label="Price Per Day"
              rules={[
                { required: true, message: "Please input the price per day!" },
              ]}
            >
              <InputNumber min={0} className="w-full" />
            </Form.Item>
            <Form.Item
              name="PricePerWeek"
              label="Price Per Week"
              rules={[
                { required: true, message: "Please input the price per week!" },
              ]}
            >
              <InputNumber min={0} className="w-full" />
            </Form.Item>
            <Form.Item
              name="PricePerMonth"
              label="Price Per Month"
              rules={[
                {
                  required: true,
                  message: "Please input the price per month!",
                },
              ]}
            >
              <InputNumber min={0} className="w-full" />
            </Form.Item>
          </>
        )}
        {productType === "buy" && (
          <Form.Item
            name="Price"
            label="Price"
            rules={[{ required: true, message: "Please input the price!" }]}
          >
            <InputNumber min={0} className="w-full" />
          </Form.Item>
        )}
        <Form.Item
          name="Brand"
          label="Brand"
          rules={[{ required: true, message: "Please select a brand!" }]}
        >
          <Select placeholder="Select a brand">
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
        <Button
          type="dashed"
          onClick={handleAddSpecification}
          className="w-full"
        >
          Thêm đặc điểm
        </Button>
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
        <Form.Item name="Voucher" label="Phiếu giảm giá">
          <Select
            value={selectedVoucher ? selectedVoucher.vourcherID : undefined}
            onChange={(value) => {
              const voucher = vouchers.find((v) => v.vourcherID === value);
              handleVoucherSelect(voucher);
            }}
          >
            {vouchers.map((voucher) => (
              <Option key={voucher.vourcherID} value={voucher.vourcherID}>
                {voucher.vourcherCode}
              </Option>
            ))}
          </Select>
          {selectedVoucher && (
            <Card className="mt-2">
              <Card.Meta
                title={selectedVoucher.vourcherCode}
                description={selectedVoucher.description}
              />
            </Card>
          )}
        </Form.Item>
        <Form.Item>
          <Tooltip title="Nhấn để tạo sản phẩm">
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full"
            >
              Tạo sản phẩm
            </Button>
          </Tooltip>
        </Form.Item>
        <VoucherModal
          isVoucherModalVisible={isVoucherModalVisible}
          setIsVoucherModalVisible={setIsVoucherModalVisible}
          vouchers={vouchers}
          handleVoucherSelect={handleVoucherSelect}
          selectedVoucher={selectedVoucher}
        />
        <ContractModal
          isContractModalVisible={isContractModalVisible}
          setIsContractModalVisible={setIsContractModalVisible}
          handleCreateContractTemplate={handleCreateContractTemplate}
        />
      </Form>
    </Spin>
  );
};

export default CreateProduct;
