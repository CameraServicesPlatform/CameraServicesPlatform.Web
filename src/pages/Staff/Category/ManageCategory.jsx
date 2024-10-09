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
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getAllCategories(1, 10);
      if (data) {
        setCategories(data.result.items);
      }
      setLoading(false);
    };

    fetchCategories();
  }, []);

  const handleDelete = async (categoryID) => {
    const success = await deleteCategory(categoryID);
    if (success) {
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
      setIsCreating(false);
      form.resetFields();
    } else {
      const errorMessage = response.errors?.categoryResponse
        ? response.errors.categoryResponse[0]
        : "Failed to create category.";
      message.error(errorMessage);
    }
  };

  const handleSearch = async (values) => {
    const data = await getCategoryByName(values.filter || "", 1, 10);
    if (data) {
      setCategories(data.result.items);
    }
  };

  const handleUpdate = async (values) => {
    if (!selectedCategory || !selectedCategory.categoryID) {
      message.error("Selected category is invalid.");
      return;
    }

    // Ensure the categoryID is a string (valid GUID)
    const categoryIDString = String(selectedCategory.categoryID);

    const payload = {
      categoryResponse: {
        // Ensure correct structure
        categoryID: categoryIDString, // Should be a valid string GUID
        categoryName: values.categoryName,
        categoryDescription: values.categoryDescription,
      },
    };

    try {
      // Call the updateCategory with the corrected payload
      const response = await updateCategory(payload);

      if (response && response.isSuccess) {
        message.success("Category updated successfully!");
        setCategories(
          categories.map((cat) =>
            cat.categoryID === categoryIDString ? { ...cat, ...values } : cat
          )
        );
        setIsUpdating(false);
        setSelectedCategory(null);
        form.resetFields();
      } else {
        const errorMessage = response?.errors?.categoryResponse
          ? response.errors.categoryResponse[0]
          : "Failed to update category.";
        message.error(errorMessage);
      }
    } catch (error) {
      // Handle errors from the API call
      console.error("Error updating category:", error);
      const errorResponse = error.response?.data; // Get the error response data
      if (errorResponse) {
        const errorMessage = errorResponse.errors?.categoryResponse
          ? errorResponse.errors.categoryResponse[0]
          : "An error occurred while updating the category.";
        message.error(errorMessage);
      } else {
        message.error("An error occurred while updating the category.");
      }
    }
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
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
        onClick={() => setIsCreating(true)}
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
                <Button onClick={() => handleEdit(record)}>Edit</Button>
                <Button
                  onClick={() => handleDelete(record.categoryID)}
                  danger
                  style={{ marginLeft: 8 }}
                >
                  Delete
                </Button>
              </>
            ),
          },
        ]}
      />
      <Modal
        title={isUpdating ? "Update Category" : "Create Category"}
        visible={isCreating || isUpdating}
        onCancel={() => {
          setIsCreating(false);
          setIsUpdating(false);
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
