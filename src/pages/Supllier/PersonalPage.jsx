import { UploadOutlined } from "@ant-design/icons";
import { Button, DatePicker, Form, Input, message, Modal, Upload } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getSupplierIdByAccountId } from "../../api/accountApi";
import { createComboOfSupplier, getAllCombos } from "../../api/comboApi";
import { getSupplierById, updateSupplier } from "../../api/supplierApi"; // Import updateSupplier

const PersonalPage = () => {
  const { user } = useSelector((state) => state.user || {});
  const [supplierId, setSupplierId] = useState(null);
  const [supplierInfo, setSupplierInfo] = useState(null);
  const [combos, setCombos] = useState([]);
  const [selectedComboId, setSelectedComboId] = useState(null);
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [fileList, setFileList] = useState([]);

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
    const fetchSupplierInfo = async () => {
      if (supplierId) {
        try {
          const response = await getSupplierById(supplierId);
          if (response?.isSuccess) {
            setSupplierInfo(response.result.items[0]);
            if (response.result.items[0].supplierLogo) {
              setFileList([
                {
                  uid: "-1",
                  name: "logo.png",
                  status: "done",
                  url: response.result.items[0].supplierLogo,
                },
              ]);
            }
          } else {
            message.error("Không thể lấy thông tin nhà cung cấp.");
          }
        } catch (error) {
          message.error("Lỗi khi lấy thông tin nhà cung cấp.");
        }
      }
    };

    fetchSupplierInfo();
  }, [supplierId]);

  useEffect(() => {
    const fetchCombos = async () => {
      try {
        const response = await getAllCombos();
        if (response?.isSuccess) {
          setCombos(response.result);
        } else {
          message.error("Không thể lấy danh sách combo.");
        }
      } catch (error) {
        message.error("Lỗi khi lấy danh sách combo.");
      }
    };

    fetchCombos();
  }, []);

  const handleCreateCombo = async (values) => {
    const comboData = {
      ...values,
      supplierID: supplierId,
      comboId: selectedComboId,
      startTime: values.startTime.toISOString(),
    };

    try {
      const response = await createComboOfSupplier(comboData);
      if (response?.isSuccess) {
        message.success("Tạo combo thành công.");
        form.resetFields();
        window.location.href = response.result; // Redirect to the provided URL
      } else {
        message.error("Tạo combo thất bại.");
      }
    } catch (error) {
      message.error("Lỗi khi tạo combo.");
    }
  };

  const handleCardClick = (comboId) => {
    setSelectedComboId(comboId);
    form.setFieldsValue({ comboId });
  };

  const handleUpdateSupplier = async (values) => {
    const formData = new FormData();
    formData.append("SupplierID", supplierId);
    formData.append("SupplierName", values.supplierName);
    formData.append("SupplierDescription", values.supplierDescription);
    formData.append("SupplierAddress", values.supplierAddress);
    formData.append("ContactNumber", values.contactNumber);
    if (values.supplierLogo && values.supplierLogo.file) {
      formData.append("SupplierLogo", values.supplierLogo.file);
    }

    try {
      const response = await updateSupplier(formData);
      if (response?.isSuccess) {
        message.success("Cập nhật thông tin nhà cung cấp thành công.");
        setSupplierInfo({ ...supplierInfo, ...values });
        setIsModalVisible(false);
      } else {
        message.error("Cập nhật thông tin nhà cung cấp thất bại.");
      }
    } catch (error) {
      message.error("Lỗi khi cập nhật thông tin nhà cung cấp.");
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleUploadChange = ({ fileList }) => {
    setFileList(fileList || []);
  };

  return (
    <div>
      <h1>Trang Cá Nhân</h1>
      {supplierInfo && (
        <div className="bg-white max-w-2xl shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Thông tin nhà cung cấp
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Chi tiết và thông tin về nhà cung cấp.
            </p>
            <Button type="primary" onClick={showModal}>
              Cập nhật thông tin
            </Button>
            <div className="flex justify-center bg-white px-4 py-5 sm:px-6">
              <img
                className="w-20 h-20 p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500"
                src={supplierInfo.supplierLogo}
                alt="Supplier Logo"
              />
            </div>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Tên</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {supplierInfo.supplierName}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {supplierInfo.email}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Số điện thoại
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {supplierInfo.contactNumber}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Địa chỉ</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {supplierInfo.supplierAddress}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Mô tả</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {supplierInfo.supplierDescription}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      )}
      <div
        className="combo-cards"
        style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}
      >
        {combos.map((combo) => (
          <div
            key={combo.comboId}
            className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700"
            style={{
              borderColor:
                selectedComboId === combo.comboId ? "blue" : "#f0f0f0",
              borderWidth: selectedComboId === combo.comboId ? 2 : 1,
            }}
            onClick={() => handleCardClick(combo.comboId)}
          >
            <h5 className="mb-4 text-xl font-medium text-gray-500 dark:text-gray-400">
              {combo.comboName}
            </h5>
            <div className="flex items-baseline text-gray-900 dark:text-white">
              <span className="text-3xl font-semibold">$</span>
              <span className="text-5xl font-extrabold tracking-tight">
                {combo.comboPrice}
              </span>
              <span className="ms-1 text-xl font-normal text-gray-500 dark:text-gray-400">
                /month
              </span>
            </div>
            <ul role="list" className="space-y-5 my-7">
              <li className="flex items-center">
                <svg
                  className="flex-shrink-0 w-4 h-4 text-blue-700 dark:text-blue-500"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                </svg>
                <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400 ms-3">
                  Thời hạn: {combo.durationCombo}
                </span>
              </li>
              <li className="flex items-center">
                <svg
                  className="flex-shrink-0 w-4 h-4 text-blue-700 dark:text-blue-500"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                </svg>
                <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400 ms-3">
                  Ngày tạo: {new Date(combo.createdAt).toLocaleString()}
                </span>
              </li>
              <li className="flex items-center">
                <svg
                  className="flex-shrink-0 w-4 h-4 text-blue-700 dark:text-blue-500"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                </svg>
                <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400 ms-3">
                  Ngày cập nhật: {new Date(combo.updatedAt).toLocaleString()}
                </span>
              </li>
            </ul>
            <button
              type="button"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-200 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-900 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex justify-center w-full text-center"
            >
              Choose plan
            </button>
          </div>
        ))}
      </div>
      <Form form={form} layout="vertical" onFinish={handleCreateCombo}>
        <Form.Item
          label="Thời gian bắt đầu"
          name="startTime"
          rules={[
            { required: true, message: "Vui lòng chọn thời gian bắt đầu!" },
          ]}
        >
          <DatePicker showTime style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Tạo Combo
          </Button>
        </Form.Item>
      </Form>
      <Modal
        title="Cập nhật thông tin nhà cung cấp"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          layout="vertical"
          onFinish={handleUpdateSupplier}
          initialValues={supplierInfo}
        >
          <Form.Item
            label="Tên nhà cung cấp"
            name="supplierName"
            rules={[
              { required: true, message: "Vui lòng nhập tên nhà cung cấp!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Mô tả"
            name="supplierDescription"
            rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            label="Địa chỉ"
            name="supplierAddress"
            rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Số điện thoại"
            name="contactNumber"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Logo nhà cung cấp"
            name="supplierLogo"
            valuePropName="fileList"
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
          >
            <Upload
              listType="picture"
              beforeUpload={() => false}
              fileList={fileList}
              onChange={handleUploadChange}
            >
              <Button icon={<UploadOutlined />}>Chọn logo</Button>
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Cập nhật thông tin
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PersonalPage;
