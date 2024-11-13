import { Button, Form, Input, message, Select } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getSupplierIdByAccountId } from "../../../api/accountApi";
import { createContractTemplate } from "../../../api/contractTemplateApi";
import { getProductBySupplierId } from "../../../api/productApi"; // Ensure this import is correct

const { Option } = Select;

const CreateContractTemplate = () => {
  const user = useSelector((state) => state.user.user || {});
  const [supplierId, setSupplierId] = useState(null);
  const [products, setProducts] = useState([]);
  const [templateData, setTemplateData] = useState({
    templateName: "",
    contractTerms: "",
    templateDetails: "",
    penaltyPolicy: "",
    accountID: user.id,
    productID: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchSupplierId = async () => {
      if (user.id) {
        try {
          const response = await getSupplierIdByAccountId(user.id);
          if (response?.isSuccess) {
            setSupplierId(response.result);
          } else {
            message.error("Không thể lấy ID nhà cung cấp.");
          }
        } catch (error) {
          message.error("Lỗi khi lấy ID nhà cung cấp.");
        }
      }
    };

    fetchSupplierId();
  }, [user]);

  const fetchProducts = async () => {
    if (!supplierId) return;

    setLoading(true);
    try {
      const result = await getProductBySupplierId(
        supplierId,
        pageIndex,
        pageSize
      );
      console.log("Fetched products:", result);
      if (result && result.length > 0) {
        const filteredProducts = result.filter(
          (product) => product.status === 1
        );
        setProducts(filteredProducts);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm:", error);
      setProducts([]);
      message.error("Lỗi khi lấy sản phẩm.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (supplierId) {
      fetchProducts();
    }
  }, [supplierId, pageIndex, pageSize]);

  const handleChange = (name, value) => {
    setTemplateData({
      ...templateData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await createContractTemplate(templateData);
      setSuccess(true);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-lg max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Tạo Mẫu Hợp Đồng</h1>
      <Form layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Tên Mẫu"
          name="templateName"
          rules={[{ required: true, message: "Vui lòng nhập tên mẫu!" }]}
        >
          <Input
            value={templateData.templateName}
            onChange={(e) => handleChange("templateName", e.target.value)}
          />
        </Form.Item>
        <Form.Item
          label="Điều Khoản Hợp Đồng"
          name="contractTerms"
          rules={[
            { required: true, message: "Vui lòng nhập điều khoản hợp đồng!" },
          ]}
        >
          <Input
            value={templateData.contractTerms}
            onChange={(e) => handleChange("contractTerms", e.target.value)}
          />
        </Form.Item>
        <Form.Item
          label="Chi Tiết Mẫu"
          name="templateDetails"
          rules={[{ required: true, message: "Vui lòng nhập chi tiết mẫu!" }]}
        >
          <Input
            value={templateData.templateDetails}
            onChange={(e) => handleChange("templateDetails", e.target.value)}
          />
        </Form.Item>
        <Form.Item
          label="Chính Sách Phạt"
          name="penaltyPolicy"
          rules={[
            { required: true, message: "Vui lòng nhập chính sách phạt!" },
          ]}
        >
          <Input
            value={templateData.penaltyPolicy}
            onChange={(e) => handleChange("penaltyPolicy", e.target.value)}
          />
        </Form.Item>
        <Form.Item
          label="Sản Phẩm"
          name="productID"
          rules={[{ required: true, message: "Vui lòng chọn sản phẩm!" }]}
        >
          <Select
            value={templateData.productID}
            onChange={(value) => handleChange("productID", value)}
            placeholder="Chọn sản phẩm"
          >
            <Option value="">Chọn sản phẩm</Option>
            {products &&
              products.map((product) => (
                <Option key={product.productID} value={product.productID}>
                  {product.productName}
                </Option>
              ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="w-full"
          >
            {loading ? "Đang tạo..." : "Tạo Mẫu"}
          </Button>
        </Form.Item>
      </Form>
      {error && <div className="text-red-500 mt-4">Lỗi: {error.message}</div>}
      {success && (
        <div className="text-green-500 mt-4">Tạo mẫu thành công!</div>
      )}
    </div>
  );
};

export default CreateContractTemplate;
