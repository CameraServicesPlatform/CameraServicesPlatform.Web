import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Form, Input, message, Modal, Table } from "antd";
import React, { useEffect, useState } from "react";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategoryByName,
  updateCategory,
} from "../../../api/categoryApi";
import LoadingComponent from "../../../components/LoadingComponent/LoadingComponent";

const ManageCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [form] = Form.useForm();

  const fetchCategories = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const data = await getAllCategories(page, pageSize);
      if (data && data.isSuccess) {
        setCategories(data.result);
      } else {
        message.error("Không thể tải danh mục.");
      }
    } catch (error) {
      message.error("Không thể tải danh mục.");
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (categoryID) => {
    const success = await deleteCategory(categoryID);
    if (success && success.isSuccess) {
      message.success("Xóa danh mục thành công!");
      setCategories(categories.filter((cat) => cat.categoryID !== categoryID));
    } else {
      message.error("Không thể xóa danh mục.");
    }
  };

  const handleCreate = async (values) => {
    const response = await createCategory(
      values.categoryName,
      values.categoryDescription
    );
    if (response && response.isSuccess) {
      message.success("Tạo danh mục thành công!");
      setCategories([...categories, response.result]);
      setModalVisible(false);
      form.resetFields();
    } else {
      const errorMessage = response.messages
        ? response.messages[0]
        : "Không thể tạo danh mục.";
      message.error(errorMessage);
    }
  };

  const handleSearch = async (values) => {
    const data = await getCategoryByName(values.filter || "", 1, 10);
    if (data && data.isSuccess) {
      setCategories(data.result);
    } else {
      message.error("Không thể tìm kiếm danh mục.");
    }
  };

  const handleUpdate = async (values) => {
    if (!selectedCategory || !selectedCategory.categoryID) {
      message.error("Danh mục được chọn không hợp lệ.");
      return;
    }

    const response = await updateCategory(
      selectedCategory.categoryID,
      values.categoryName,
      values.categoryDescription
    );

    if (response && response.isSuccess) {
      message.success("Cập nhật danh mục thành công!");
      setCategories(
        categories.map((cat) =>
          cat.categoryID === selectedCategory.categoryID
            ? { ...cat, ...values }
            : cat
        )
      );
      setModalVisible(false);
      setSelectedCategory(null);
      form.resetFields();
    } else {
      const errorMessage = response.messages
        ? response.messages[0]
        : "Không thể cập nhật danh mục.";
      message.error(errorMessage);
    }
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setModalVisible(true);
    setIsUpdating(true);
    form.setFieldsValue({
      categoryName: category.categoryName,
      categoryDescription: category.categoryDescription,
    });
  };

  if (loading) {
    return <LoadingComponent />;
  }

  return (
    <div>
      <h2>Quản lý danh mục</h2>
      <Form
        layout="inline"
        onFinish={handleSearch}
        style={{ marginBottom: "20px" }}
      >
        <Form.Item name="filter">
          <Input placeholder="Tìm kiếm theo tên" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Tìm kiếm
          </Button>
        </Form.Item>
      </Form>
      <Button
        type="primary"
        onClick={() => {
          setModalVisible(true);
          setIsUpdating(false);
          form.resetFields();
        }}
        style={{ marginBottom: "20px" }}
      >
        Tạo danh mục
      </Button>
      <Table
        dataSource={categories}
        rowKey="categoryID"
        columns={[
          {
            title: "Tên danh mục",
            dataIndex: "categoryName",
          },
          {
            title: "Mô tả",
            dataIndex: "categoryDescription",
          },
          {
            title: "Hành động",
            render: (text, record) => (
              <>
                <Button
                  icon={<EditOutlined />}
                  onClick={() => handleEdit(record)}
                ></Button>

                <Button
                  icon={<DeleteOutlined />}
                  onClick={() => handleDelete(record.categoryID)}
                  danger
                  style={{ marginLeft: 8 }}
                ></Button>
              </>
            ),
          },
        ]}
      />
      <Modal
        title={isUpdating ? "Cập nhật danh mục" : "Tạo danh mục"}
        visible={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setSelectedCategory(null);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={isUpdating ? handleUpdate : handleCreate}
        >
          <Form.Item
            label="Tên danh mục"
            name="categoryName"
            rules={[{ required: true, message: "Vui lòng nhập tên danh mục!" }]}
          >
            <Input placeholder="Nhập tên danh mục" />
          </Form.Item>
          <Form.Item
            label="Mô tả danh mục"
            name="categoryDescription"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mô tả danh mục!",
              },
            ]}
          >
            <Input.TextArea placeholder="Nhập mô tả danh mục" rows={4} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {isUpdating ? "Cập nhật danh mục" : "Tạo danh mục"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageCategory;

