import { Button, Input, message, Space, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  deleteContractTemplateById,
  getAllContractTemplates,
} from "../../../api/contractTemplateApi";
import { getAllProduct } from "../../../api/productApi";
import UpdateContractTemplateForm from "./UpdateContractTemplateForm";

const { Search } = Input;

const ContractTemplateList = ({ refresh }) => {
  const [contractTemplates, setContractTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [products, setProducts] = useState([]);
  const user = useSelector((state) => state.user.user || {});
  const accountId = user.id;

  useEffect(() => {
    const fetchContractTemplates = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllContractTemplates();
        setContractTemplates(data.result.items);
      } catch (error) {
        setError(error);
        message.error("Lỗi khi lấy danh sách mẫu hợp đồng.");
      } finally {
        setLoading(false);
      }
    };

    const fetchProducts = async () => {
      try {
        const data = await getAllProduct(1, 100); // Provide default values for pageIndex and pageSize
        console.log("Fetched products:", data);
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
        message.error("Lỗi khi lấy danh sách sản phẩm.");
      }
    };

    fetchContractTemplates();
    fetchProducts();
  }, [refresh]);

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleUpdate = (contractTemplateId) => {
    setSelectedTemplateId(contractTemplateId);
    setUpdateModalVisible(true);
  };

  const handleDelete = async (contractTemplateId) => {
    try {
      await deleteContractTemplateById(contractTemplateId);
      message.success("Xóa mẫu hợp đồng thành công.");
      setRefreshList((prev) => !prev);
    } catch (error) {
      message.error("Lỗi khi xóa mẫu hợp đồng.");
    }
  };

  const handleUpdateSuccess = () => {
    message.success("Cập nhật mẫu hợp đồng thành công.");
    setRefreshList((prev) => !prev);
  };

  const filteredTemplates = contractTemplates.filter((template) =>
    template.templateName.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: "Tên mẫu hợp đồng",
      dataIndex: "templateName",
      key: "templateName",
    },
    {
      title: "Điều khoản hợp đồng",
      dataIndex: "contractTerms",
      key: "contractTerms",
    },
    {
      title: "Chi tiết mẫu hợp đồng",
      dataIndex: "templateDetails",
      key: "templateDetails",
    },
    {
      title: "Chính sách phạt",
      dataIndex: "penaltyPolicy",
      key: "penaltyPolicy",
    },
    {
      title: "Tên tài khoản",
      dataIndex: "accountID",
      key: "accountID",
      render: () => `${user.firstName} ${user.lastName}`,
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "productID",
      key: "productID",
      render: (productID) => {
        const product = products.find(
          (product) => product.productID === productID
        );
        return product ? product.productName : "N/A";
      },
    },
    {
      title: "Hành động",
      key: "actions",
      render: (text, record) => (
        <Space size="middle">
          <Button onClick={() => handleUpdate(record.contractTemplateID)}>
            Cập nhật
          </Button>
          <Button
            onClick={() => handleDelete(record.contractTemplateID)}
            danger
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>Lỗi: {error.message}</div>;

  return (
    <div>
      <h2>Danh sách mẫu hợp đồng</h2>
      <Search
        placeholder="Tìm kiếm theo tên mẫu hợp đồng"
        onSearch={handleSearch}
        enterButton
        style={{ marginBottom: 20 }}
      />
      <Table
        dataSource={filteredTemplates}
        columns={columns}
        rowKey="contractTemplateID"
      />
      <UpdateContractTemplateForm
        visible={updateModalVisible}
        onClose={() => setUpdateModalVisible(false)}
        contractTemplateId={selectedTemplateId}
        onUpdateSuccess={handleUpdateSuccess}
      />
    </div>
  );
};

export default ContractTemplateList;
