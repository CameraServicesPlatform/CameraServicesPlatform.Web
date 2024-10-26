import { Button, Form, Input, message, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getSupplierIdByAccountId } from "../../api/accountApi"; // Đảm bảo rằng đây là đường dẫn nhập đúng
import { getSupplierById, updateSupplier } from "../../api/supplierApi";

const InformationSupplierDetail = () => {
  const { id } = useParams();
  const [supplier, setSupplier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const role = useSelector((state) => state.user.role || "");
  const user = useSelector((state) => state.user.user || {});
  const [supplierId, setSupplierId] = useState(null);

  // Hàm lấy supplierId từ accountId của người dùng hiện tại
  const fetchSupplierId = async () => {
    if (user.id) {
      try {
        const response = await getSupplierIdByAccountId(user.id);
        if (response?.isSuccess) {
          setSupplierId(response.result); // Lưu supplierId từ phản hồi API
        } else {
          message.error("Không lấy được ID nhà cung cấp.");
        }
      } catch (error) {
        message.error("Có lỗi xảy ra khi lấy ID nhà cung cấp.");
      }
    }
  };

  useEffect(() => {
    fetchSupplierId();
  }, [user]);

  useEffect(() => {
    const fetchSupplierDetails = async () => {
      setLoading(true);
      const response = await getSupplierById(id);
      if (response && response.isSuccess) {
        const supplierData = response.result.items[0];
        setSupplier(supplierData);
        form.setFieldsValue(supplierData);
      } else {
        message.error("Lấy thông tin nhà cung cấp thất bại.");
      }
      setLoading(false);
    };

    fetchSupplierDetails();
  }, [id, form]);

  const handleUpdateSupplier = async (values) => {
    const formData = new FormData();
    formData.append("SupplierID", supplier.supplierID);
    formData.append("SupplierName", values.supplierName);
    formData.append("SupplierDescription", values.supplierDescription);
    formData.append("SupplierAddress", values.supplierAddress);
    formData.append("ContactNumber", values.contactNumber);

    const logoFile = values.supplierLogo?.file;
    if (logoFile) {
      formData.append("SupplierLogo", logoFile);
    }

    const response = await updateSupplier(formData);
    if (response && response.isSuccess) {
      message.success("Cập nhật nhà cung cấp thành công!");
      setIsEditing(false);
      setSupplier({ ...supplier, ...values });
      form.resetFields();
    } else {
      message.error("Cập nhật nhà cung cấp thất bại.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!supplier) {
    return <div>Không tìm thấy dữ liệu nhà cung cấp.</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Thông Tin Nhà Cung Cấp</h1>
      {isEditing ? (
        <Form form={form} layout="vertical" onFinish={handleUpdateSupplier}>
          <Form.Item
            label="Tên Nhà Cung Cấp"
            name="supplierName"
            rules={[
              { required: true, message: "Vui lòng nhập tên nhà cung cấp!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Mô Tả"
            name="supplierDescription"
            rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            label="Địa Chỉ"
            name="supplierAddress"
            rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Số Điện Thoại"
            name="contactNumber"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Logo Nhà Cung Cấp" name="supplierLogo">
            <Input type="file" accept="image/*" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Cập Nhật Nhà Cung Cấp
            </Button>
            <Button className="ml-2" onClick={() => setIsEditing(false)}>
              Hủy
            </Button>
          </Form.Item>
        </Form>
      ) : (
        <div>
          <p>
            <strong>Tên:</strong> {supplier.supplierName}
          </p>
          <p>
            <strong>Mô Tả:</strong> {supplier.supplierDescription}
          </p>
          <p>
            <strong>Địa Chỉ:</strong> {supplier.supplierAddress}
          </p>
          <p>
            <strong>Liên Hệ:</strong> {supplier.contactNumber}
          </p>
          {/* Kiểm tra nếu supplierId của người dùng khớp với supplier.supplierID */}
          {supplierId === supplier.supplierID && (
            <Button type="primary" onClick={() => setIsEditing(true)}>
              Chỉnh Sửa Thông tin trang cá nhân
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default InformationSupplierDetail;
