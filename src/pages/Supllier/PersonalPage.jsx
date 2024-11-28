import { Button, Card, DatePicker, Form, message } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getSupplierIdByAccountId } from "../../api/accountApi";
import { createComboOfSupplier, getAllCombos } from "../../api/comboApi";

const PersonalPage = () => {
  const user = useSelector((state) => state.user.user || {});
  const [supplierId, setSupplierId] = useState(null);
  const [combos, setCombos] = useState([]);
  const [selectedComboId, setSelectedComboId] = useState(null);
  const [form] = Form.useForm();

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

  return (
    <div>
      <h1>Trang Cá Nhân</h1>
      <div className="combo-cards">
        {combos.map((combo) => (
          <Card
            key={combo.comboId}
            title={combo.comboName}
            style={{
              marginTop: 16,
              borderColor:
                selectedComboId === combo.comboId ? "blue" : "default",
              borderWidth: selectedComboId === combo.comboId ? 2 : 1,
            }}
            onClick={() => handleCardClick(combo.comboId)}
          >
            <p>Giá: {combo.comboPrice}</p>
            <p>Thời hạn: {combo.durationCombo}</p>
            <p>Ngày tạo: {new Date(combo.createdAt).toLocaleString()}</p>
            <p>Ngày cập nhật: {new Date(combo.updatedAt).toLocaleString()}</p>
          </Card>
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
          <DatePicker showTime />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Tạo Combo
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default PersonalPage;
