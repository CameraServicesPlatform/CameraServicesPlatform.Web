import { PlusOutlined } from "@ant-design/icons";
import {
  Form as AntForm,
  Button,
  Col,
  Input,
  message,
  Modal,
  Row,
  Select,
  Spin,
  Upload,
} from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { registerSupplier } from "../../api/accountApi";

const { Option } = Select;

const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const RegisterSupplier = () => {
  const [loading, setLoading] = useState(false);
  const [banks, setBanks] = useState([]);
  const [loadingBanks, setLoadingBanks] = useState(true); // Loading state for banks
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileListFront, setFileListFront] = useState([]);
  const [fileListBack, setFileListBack] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const response = await axios.get("https://api.vietqr.io/v2/banks");
        setBanks(response.data.data); // Assuming data is in response.data.data
      } catch (error) {
        message.error("Failed to fetch bank list.");
      } finally {
        setLoadingBanks(false);
      }
    };
    fetchBanks();
  }, []);

  const handleCancel = () => setPreviewVisible(false);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  const handleChange =
    (fileType) =>
    ({ fileList }) => {
      if (fileType === "front") {
        setFileListFront(fileList);
      } else {
        setFileListBack(fileList);
      }
    };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Định dạng email không hợp lệ")
      .required("Email là bắt buộc!"),

    password: Yup.string()
      .required("Mật khẩu là bắt buộc!")
      .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
      .matches(/[A-Z]/, "Mật khẩu phải chứa ít nhất một chữ cái viết hoa")
      .matches(
        /[!@#$%^&*(),.?":{}|<>]/,
        'Mật khẩu phải chứa ít nhất một ký tự đặc biệt (!@#$%^&*(),.?":{}|<>)'
      ),

    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Mật khẩu xác nhận không khớp")
      .required("Mật khẩu xác nhận là bắt buộc!"),

    firstName: Yup.string().required("Tên là bắt buộc!"),

    lastName: Yup.string().required("Họ là bắt buộc!"),

    supplierName: Yup.string().required("Tên nhà cung cấp là bắt buộc!"),

    supplierDescription: Yup.string().required(
      "Mô tả nhà cung cấp là bắt buộc!"
    ),

    supplierAddress: Yup.string().required("Địa chỉ nhà cung cấp là bắt buộc!"),

    contactNumber: Yup.string()
      .required("Số liên hệ là bắt buộc!")
      .matches(/^\d+$/, "Số liên hệ chỉ được chứa các ký tự số"),

    phoneNumber: Yup.string().matches(
      /^\d*$/,
      "Số điện thoại chỉ được chứa các ký tự số"
    ),

    bankName: Yup.string().required("Tên ngân hàng là bắt buộc!"),

    accountNumber: Yup.string()
      .required("Số tài khoản là bắt buộc!")
      .matches(/^\d+$/, "Số tài khoản chỉ được chứa các ký tự số"),

    accountHolder: Yup.string().required(
      "Tên người đứng tên tài khoản là bắt buộc!"
    ),
  });

  const onFinish = async (values) => {
    setLoading(true);

    try {
      await validationSchema.validate(values, { abortEarly: false });

      const {
        email,
        password,
        firstName,
        lastName,
        supplierName,
        supplierDescription,
        supplierAddress,
        contactNumber,
        phoneNumber,
        bankName,
        accountNumber,
        accountHolder,
      } = values;

      const frontFile =
        fileListFront.length > 0 ? fileListFront[0].originFileObj : null;
      const backFile =
        fileListBack.length > 0 ? fileListBack[0].originFileObj : null;

      const response = await registerSupplier(
        email,
        password,
        firstName,
        lastName,
        supplierName,
        supplierDescription,
        supplierAddress,
        contactNumber,
        phoneNumber,
        frontFile,
        backFile,
        bankName,
        accountNumber,
        accountHolder
      );

      if (response) {
        message.success(
          "Supplier registered successfully! Vui lòng quay về trang Đăng nhập"
        );
        navigate("/"); // Redirect to home page after success
      } else {
        message.error("Failed to register supplier.");
      }
    } catch (error) {
      // Handle validation errors or registration errors
      if (error instanceof Yup.ValidationError) {
        error.errors.forEach((err) => message.error(err)); // Display validation error messages
      } else {
        message.error("An error occurred while registering the supplier.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-mint min-h-screen">
      <div className="relative flex flex-col m-6 space-y-8 bg-white shadow-4xl rounded-2xl md:flex-row md:space-y-0 w-full max-w-2xl p-6">
        <div className="w-full">
          <h1 className="text-3xl font-bold text-center mb-8">
            ĐĂNG KÍ NHÀ CUNG CẤP
          </h1>
          <AntForm layout="vertical" onFinish={onFinish}>
            <AntForm.Item
              label={<strong>Email</strong>}
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập email của bạn!" },
              ]}
            >
              <Input placeholder="Nhập email của bạn" />
            </AntForm.Item>
            <AntForm.Item
              label={<strong>Tên nhà cung cấp</strong>}
              name="supplierName"
              rules={[
                { required: true, message: "Vui lòng nhập tên nhà cung cấp!" },
              ]}
            >
              <Input placeholder="Nhập tên nhà cung cấp của bạn" />
            </AntForm.Item>
            <Row gutter={20}>
              <Col span={12}>
                <AntForm.Item
                  label={<strong>Mật khẩu</strong>}
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập mật khẩu của bạn!",
                    },
                  ]}
                >
                  <Input.Password placeholder="Nhập mật khẩu của bạn" />
                </AntForm.Item>
              </Col>
              <Col span={12}>
                <AntForm.Item
                  label={<strong>Xác nhận mật khẩu</strong>}
                  name="confirmPassword"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng xác nhận mật khẩu của bạn!",
                    },
                  ]}
                >
                  <Input.Password placeholder="Xác nhận mật khẩu của bạn" />
                </AntForm.Item>
              </Col>
            </Row>

            <Row gutter={20}>
              <Col span={12}>
                <AntForm.Item
                  label={<strong>Tên</strong>}
                  name="firstName"
                  rules={[
                    { required: true, message: "Vui lòng nhập tên của bạn!" },
                  ]}
                >
                  <Input placeholder="Nhập tên của bạn" />
                </AntForm.Item>
              </Col>
              <Col span={12}>
                <AntForm.Item
                  label={<strong>Họ</strong>}
                  name="lastName"
                  rules={[
                    { required: true, message: "Vui lòng nhập họ của bạn!" },
                  ]}
                >
                  <Input placeholder="Nhập họ của bạn" />
                </AntForm.Item>
              </Col>
            </Row>

            <AntForm.Item
              label={
                <strong>
                  Nhập mô tả về dịch vụ để khách hàng hiểu hơn về dịch vụ bạn
                  mang đến"
                </strong>
              }
              name="supplierDescription"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập mô tả nhà cung cấp!",
                },
              ]}
            >
              <Input.TextArea placeholder="Nhập mô tả về dịch vụ để khách hàng hiểu hơn về dịch vụ bạn mang đến" />
            </AntForm.Item>

            <AntForm.Item
              label={<strong>Địa chỉ nhà cung cấp</strong>}
              name="supplierAddress"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập địa chỉ nhà cung cấp!",
                },
              ]}
            >
              <Input placeholder="Nhập địa chỉ nhà cung cấp" />
            </AntForm.Item>
            <Row gutter={20}>
              <Col span={12}>
                <AntForm.Item
                  label={<strong>Số liên lạc</strong>}
                  name="contactNumber"
                  rules={[
                    { required: true, message: "Vui lòng nhập số liên lạc!" },
                  ]}
                >
                  <Input placeholder="Nhập số liên lạc" />
                </AntForm.Item>
              </Col>

              <Col span={12}>
                <AntForm.Item
                  label={<strong>Số điện thoại cá nhân</strong>}
                  name="phoneNumber"
                  rules={[
                    { required: true, message: "Vui lòng nhập số điện thoại!" },
                  ]}
                >
                  <Input placeholder="Nhập số điện thoại" />
                </AntForm.Item>
              </Col>
            </Row>
            <AntForm.Item
              label={<strong>Ngân hàng bạn dùng:</strong>}
              name="bankName"
              rules={[
                { required: true, message: "Vui lòng chọn ngân hàng của bạn!" },
              ]}
            >
              {loadingBanks ? (
                <Spin />
              ) : (
                <Select placeholder="Chọn ngân hàng">
                  {banks.map((bank) => (
                    <Option key={bank.code} value={bank.name}>
                      <strong>{bank.shortName}</strong> - {bank.name}
                    </Option>
                  ))}
                </Select>
              )}
            </AntForm.Item>

            <Row gutter={20}>
              <Col span={12}>
                <AntForm.Item
                  label={<strong>Số tài khoản</strong>}
                  name="accountNumber"
                  rules={[
                    { required: true, message: "Vui lòng nhập số tài khoản!" },
                  ]}
                >
                  <Input placeholder="Nhập số tài khoản" />
                </AntForm.Item>
              </Col>
              <Col span={12}>
                <AntForm.Item
                  label={<strong>Tên chủ tài khoản</strong>}
                  name="accountHolder"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập tên chủ tài khoản!",
                    },
                  ]}
                >
                  <Input placeholder="Nhập tên chủ tài khoản" />
                </AntForm.Item>
              </Col>
            </Row>

            <Row gutter={16} style={{ justifyContent: "center" }}>
              <Col
                span={12}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <AntForm.Item
                  label={<strong>Mặt trước CCCD/CMND</strong>}
                  style={{ width: "100%" }}
                  required
                >
                  <Upload
                    listType="picture-card"
                    fileList={fileListFront}
                    onPreview={handlePreview}
                    onChange={handleChange("front")}
                    beforeUpload={() => false}
                  >
                    {fileListFront.length < 1 && <PlusOutlined />}
                  </Upload>
                </AntForm.Item>
              </Col>

              <Col
                span={12}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <AntForm.Item
                  label={<strong>Mặt sau CCCD/CMND</strong>}
                  required
                  style={{ width: "100%" }}
                >
                  <Upload
                    listType="picture-card"
                    fileList={fileListBack}
                    onPreview={handlePreview}
                    onChange={handleChange("back")}
                    beforeUpload={() => false}
                  >
                    {fileListBack.length < 1 && <PlusOutlined />}
                  </Upload>
                </AntForm.Item>
              </Col>
            </Row>

            <AntForm.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                style={{ width: "100%" }}
              >
                Đăng ký nhà cung cấp
              </Button>
            </AntForm.Item>
          </AntForm>
        </div>
      </div>

      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img alt="Preview" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </div>
  );
};

export default RegisterSupplier;
