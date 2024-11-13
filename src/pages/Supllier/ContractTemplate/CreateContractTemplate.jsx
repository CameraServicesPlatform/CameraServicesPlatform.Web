import { message } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getSupplierIdByAccountId } from "../../../api/accountApi";
import { getProductBySupplierId } from "../../../api/productApi";
import { createContractTemplate } from "../../../api/contractTemplateApi";

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

  useEffect(() => {
    const fetchSupplierId = async () => {
      if (user.id) {
        try {
          const response = await getSupplierIdByAccountId(user.id);
          if (response?.isSuccess) {
            setSupplierId(response.result);
          } else {
            message.error("Lấy mã nhà cung cấp không thành công.");
          }
        } catch (error) {
          message.error("Lỗi khi lấy mã nhà cung cấp.");
        }
      }
    };

    fetchSupplierId();
  }, [user.id]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (supplierId) {
        try {
          const products = await getProductBySupplierId(supplierId, 1, 10);
          setProducts(products.items);
        } catch (error) {
          message.error("Lỗi khi lấy sản phẩm.");
        }
      }
    };

    fetchProducts();
  }, [supplierId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTemplateData({
      ...templateData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    <div>
      <h1>Create Contract Template</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Template Name:</label>
          <input
            type="text"
            name="templateName"
            value={templateData.templateName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Contract Terms:</label>
          <input
            type="text"
            name="contractTerms"
            value={templateData.contractTerms}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Template Details:</label>
          <input
            type="text"
            name="templateDetails"
            value={templateData.templateDetails}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Penalty Policy:</label>
          <input
            type="text"
            name="penaltyPolicy"
            value={templateData.penaltyPolicy}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Product:</label>
          <select
            name="productID"
            value={templateData.productID}
            onChange={handleChange}
            required
          >
            <option value="">Select a product</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Template"}
        </button>
      </form>
      {error && <div>Error: {error.message}</div>}
      {success && <div>Template created successfully!</div>}
    </div>
  );
};

export default CreateContractTemplate;
