import React, { useEffect, useState } from "react";
import { Form, message, Button, Card } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { getSupplierIdByAccountId } from "../../../../api/accountApi";
import { getAllCategories } from "../../../../api/categoryApi";
import {
  createProductBuy,
  createProductRent,
} from "../../../../api/productApi";
import { getVouchersBySupplierId } from "../../../../api/voucherApi";
import CreateProductForm from "./CreateProductForm";
import VoucherModal from "./VoucherModal";
import ContractModal from "./ContractModal";

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

  useEffect(() => {
    if (supplierId) {
      fetchVouchers();
    }
  }, [supplierId]);

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

    const productData = {
      ...values,
      specifications: validSpecifications,
      file,
      supplierId,
      selectedVoucher,
      canBeRentedByMember,
    };

    setLoading(true);
    try {
      let response;
      if (productType === "rent") {
        response = await createProductRent(productData);
      } else {
        response = await createProductBuy(productData);
      }

      if (response?.isSuccess) {
        message.success("Tạo sản phẩm thành công!");
        form.resetFields();
        setFile(null);
        setFilePreview(null);
        setSpecifications([{ feature: "", description: "" }]);
        setPriceType([]);
        setProductType("rent");
        setSelectedVoucher(null);
        setCanBeRentedByMember(false);
      } else {
        message.error("Tạo sản phẩm thất bại.");
      }
    } catch (error) {
      message.error("Đã xảy ra lỗi khi tạo sản phẩm.");
    } finally {
      setLoading(false);
    }
  };

  const handleVoucherSelect = (voucher) => {
    setSelectedVoucher(voucher);
    setIsVoucherModalVisible(false);
  };

  const handleCreateContractTemplate = (values) => {
    // Handle contract template creation logic here
    setIsContractModalVisible(false);
  };

  return (
    <Card title="Tạo sản phẩm mới">
      <CreateProductForm
        form={form}
        categories={categories}
        productType={productType}
        setProductType={setProductType}
        priceType={priceType}
        setPriceType={setPriceType}
        specifications={specifications}
        setSpecifications={setSpecifications}
        handleCreateProduct={handleCreateProduct}
        handleFileChange={handleFileChange}
        handleRemoveFile={handleRemoveFile}
        filePreview={filePreview}
        loading={loading}
        canBeRentedByMember={canBeRentedByMember}
        setIsContractModalVisible={setIsContractModalVisible}
      />
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setIsVoucherModalVisible(true)}
      >
        Chọn Voucher
      </Button>
      <VoucherModal
        isVoucherModalVisible={isVoucherModalVisible}
        setIsVoucherModalVisible={setIsVoucherModalVisible}
        vouchers={vouchers}
        selectedVoucher={selectedVoucher}
        handleVoucherSelect={handleVoucherSelect}
      />
      <ContractModal
        isContractModalVisible={isContractModalVisible}
        setIsContractModalVisible={setIsContractModalVisible}
        handleCreateContractTemplate={handleCreateContractTemplate}
      />
    </Card>
  );
};

export default CreateProduct;
