import { Button, Form, message, Select, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getSupplierIdByAccountId } from "../../../../api/accountApi";
import { getAllCategories } from "../../../../api/categoryApi";
import {
  createProductBuy,
  createProductRent,
} from "../../../../api/productApi";
import { getVouchersBySupplierId } from "../../../../api/voucherApi";

const { Option } = Select;
const { Title } = Typography;

const CreateProduct = () => {
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
    if (user.id) {
      fetchSupplierId();
      fetchCategories();
    }
  }, [user.id]);

  useEffect(() => {
    if (supplierId) {
      fetchVouchers();
    }
  }, [supplierId]);

  const fetchSupplierId = async () => {
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
      <ProductTypeRadioGroup
        productType={productType}
        setProductType={setProductType}
      />
      <SerialNumberInput />
      <CategorySelect categories={categories} />
      <ProductNameInput />
      <ProductDescriptionInput />
      <QualitySelect />
      <DateOfManufactureInput />
      <OriginalPriceInput />
      {productType === "rent" && (
        <RentPriceInputs
          priceType={priceType}
          handlePriceTypeChange={handlePriceTypeChange}
        />
      )}
      {productType === "buy" && <BuyPriceInput />}
      <BrandSelect />
      <Specifications
        specifications={specifications}
        handleAddSpecification={handleAddSpecification}
        handleSpecificationChange={handleSpecificationChange}
        handleRemoveSpecification={handleRemoveSpecification}
      />
      <ImageUpload
        filePreview={filePreview}
        handleFileChange={handleFileChange}
        handleRemoveFile={handleRemoveFile}
      />
      <VoucherSelect
        selectedVoucher={selectedVoucher}
        setIsVoucherModalVisible={setIsVoucherModalVisible}
      />
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Tạo sản phẩm
        </Button>
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
  );
};

export default CreateProduct;

// ...other components like ProductTypeRadioGroup, SerialNumberInput, CategorySelect, etc.
