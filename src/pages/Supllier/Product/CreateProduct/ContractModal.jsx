import { Button, Form, Input, Modal, Select, message } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getSupplierIdByAccountId } from "../../../../api/accountApi";
import { getProductBySupplierId } from "../../../../api/productApi";
const { Option } = Select;

const ContractModal = ({
  isContractModalVisible,
  setIsContractModalVisible,
  handleCreateContractTemplate,
}) => {
  const user = useSelector((state) => state.user.user || {});
  const [supplierId, setSupplierId] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchSupplierId = async () => {
      if (user.id) {
        try {
          const response = await getSupplierIdByAccountId(user.id);
          if (response?.isSuccess) {
            setSupplierId(response.result);
          } else {
            message.error("Không thể lấy ID nhà cung cấp.");
            console.error("Error response:", response);
          }
        } catch (error) {
          message.error("Lỗi khi lấy ID nhà cung cấp.");
          console.error("Error fetching supplier ID:", error);
        }
      }
    };

    fetchSupplierId();
  }, [user]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!supplierId) return;

      try {
        const result = await getProductBySupplierId(supplierId);
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
      }
    };

    if (supplierId) {
      fetchProducts();
    }
  }, [supplierId]);

  return (
    <Modal
      title="Tạo Mẫu Hợp Đồng"
      open={isContractModalVisible}
      onCancel={() => setIsContractModalVisible(false)}
      footer={null}
    >
      <Form onFinish={handleCreateContractTemplate}>
        <Form.Item
          name="templateName"
          label="Tên Mẫu"
          rules={[{ required: true, message: "Vui lòng nhập tên mẫu!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="contractTerms"
          label="Điều Khoản Hợp Đồng"
          rules={[
            { required: true, message: "Vui lòng nhập điều khoản hợp đồng!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="templateDetails"
          label="Chi Tiết Mẫu"
          rules={[{ required: true, message: "Vui lòng nhập chi tiết mẫu!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="penaltyPolicy"
          label="Chính Sách Phạt"
          rules={[
            { required: true, message: "Vui lòng nhập chính sách phạt!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="productID"
          label="Sản Phẩm"
          rules={[{ required: true, message: "Vui lòng chọn sản phẩm!" }]}
        >
          <Select placeholder="Chọn sản phẩm">
            {products.map((product) => (
              <Option key={product.productID} value={product.productID}>
                {product.productName}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Tạo Mẫu
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ContractModal;
