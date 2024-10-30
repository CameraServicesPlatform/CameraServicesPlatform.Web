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
        // Set the categories from the result
        setCategories(data.result); // Use data.result directly as it contains the array of categories
      } else {
        message.error("Failed to load categories.");
      }
    } catch (error) {
      message.error("Failed to load categories.");
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
      message.success("Category deleted successfully!");
      setCategories(categories.filter((cat) => cat.categoryID !== categoryID));
    } else {
      message.error("Failed to delete category.");
    }
  };

  const handleCreate = async (values) => {
    const response = await createCategory(
      values.categoryName,
      values.categoryDescription
    );
    if (response && response.isSuccess) {
      message.success("Category created successfully!");
      setCategories([...categories, response.result]);
      setModalVisible(false);
      form.resetFields();
    } else {
      const errorMessage = response.messages
        ? response.messages[0]
        : "Failed to create category.";
      message.error(errorMessage);
    }
  };

  const handleSearch = async (values) => {
    const data = await getCategoryByName(values.filter || "", 1, 10);
    if (data && data.isSuccess) {
      setCategories(data.result); // Update to directly set result
    } else {
      message.error("Failed to search categories.");
    }
  };

  const handleUpdate = async (values) => {
    if (!selectedCategory || !selectedCategory.categoryID) {
      message.error("Selected category is invalid.");
      return;
    }

    const response = await updateCategory(
      selectedCategory.categoryID,
      values.categoryName,
      values.categoryDescription
    );

    if (response && response.isSuccess) {
      message.success("Category updated successfully!");
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
        : "Failed to update category.";
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
      <h2>Manage Categories</h2>
      <Form
        layout="inline"
        onFinish={handleSearch}
        style={{ marginBottom: "20px" }}
      >
        <Form.Item name="filter">
          <Input placeholder="Search by name" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Search
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
        Create Category
      </Button>
      <Table
        dataSource={categories}
        rowKey="categoryID"
        columns={[
          {
            title: "Category Name",
            dataIndex: "categoryName",
          },
          {
            title: "Description",
            dataIndex: "categoryDescription",
          },
          {
            title: "Actions",
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
        title={isUpdating ? "Update Category" : "Create Category"}
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
            label="Category Name"
            name="categoryName"
            rules={[
              { required: true, message: "Please input the category name!" },
            ]}
          >
            <Input placeholder="Enter category name" />
          </Form.Item>
          <Form.Item
            label="Category Description"
            name="categoryDescription"
            rules={[
              {
                required: true,
                message: "Please input the category description!",
              },
            ]}
          >
            <Input.TextArea placeholder="Enter category description" rows={4} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {isUpdating ? "Update Category" : "Create Category"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageCategory;
