import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, Select, Spin, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import {
  createCombo,
  getAllCombos,
  getComboById,
  updateCombo,
} from "../../../api/comboApi";

const { Option } = Select;

const ComboList = ({ refresh }) => {
  const [combos, setCombos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCombo, setSelectedCombo] = useState(null);
  const [newCombo, setNewCombo] = useState({
    comboName: "",
    comboPrice: 0,
    durationCombo: 0,
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);

  useEffect(() => {
    const fetchCombos = async () => {
      setLoading(true);
      const response = await getAllCombos();
      if (response.isSuccess) {
        setCombos(response.result);
      } else {
        console.error(response.messages);
      }
      setLoading(false);
    };

    fetchCombos();
  }, [refresh]);

  const handleDelete = async (comboId) => {
    const response = await deleteCombo(comboId);
    if (response.isSuccess) {
      setCombos(combos.filter((combo) => combo.comboId !== comboId));
    } else {
      console.error(response.messages);
    }
  };

  const handleViewDetails = async (comboId) => {
    const response = await getComboById(comboId);
    if (response.isSuccess) {
      setSelectedCombo(response.result);
      setIsUpdateMode(true);
      setIsModalVisible(true);
    } else {
      console.error(response.messages);
    }
  };

  const handleCreateCombo = async (values) => {
    const response = await createCombo(values);
    if (response.isSuccess) {
      setCombos([...combos, response.result]);
      setIsModalVisible(false);
    } else {
      console.error(response.messages);
    }
  };

  const handleUpdateCombo = async () => {
    const response = await updateCombo(selectedCombo);
    if (response.isSuccess) {
      setCombos(
        combos.map((combo) =>
          combo.comboId === selectedCombo.comboId ? response.result : combo
        )
      );
      setSelectedCombo(null);
      setIsModalVisible(false);
    } else {
      console.error(response.messages);
    }
  };

  const openCreateModal = () => {
    setIsUpdateMode(false);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedCombo(null);
    setNewCombo({ comboName: "", comboPrice: 0, durationCombo: 0 });
  };

  if (loading) {
    return <Spin />;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <PlusOutlined className="mr-2" /> Danh sách combo
      </h2>
      <div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={openCreateModal}
          className="mb-4"
        >
          Tạo Combo Mới
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {combos.map((combo) => (
          <div
            key={combo.comboId}
            className="p-4 bg-white rounded shadow"
            onDoubleClick={() => handleViewDetails(combo.comboId)}
          >
            <h3 className="text-xl font-semibold">{combo.comboName}</h3>
            <p>Giá: {combo.comboPrice}</p>
            <p>Thời gian: {combo.durationCombo}</p>
            <p>Ngày tạo: {new Date(combo.createdAt).toLocaleString()}</p>
            <p>Ngày cập nhật: {new Date(combo.updatedAt).toLocaleString()}</p>
            <div className="flex justify-between mt-2">
              <Tooltip title="Chỉnh sửa">
                <Button
                  icon={<EditOutlined />}
                  onClick={() => handleViewDetails(combo.comboId)}
                />
              </Tooltip>
              <Tooltip title="Xóa">
                <Button
                  icon={<DeleteOutlined />}
                  onClick={() => handleDelete(combo.comboId)}
                  danger
                />
              </Tooltip>
            </div>
          </div>
        ))}
      </div>

      <Modal
        title={isUpdateMode ? "Cập nhật Combo" : "Tạo Combo Mới"}
        visible={isModalVisible}
        onCancel={closeModal}
        footer={null}
      >
        <Form onFinish={handleCreateCombo}>
          <Form.Item
            name="comboName"
            label="Tên Combo"
            rules={[{ required: true, message: "Vui lòng nhập tên combo!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="comboPrice"
            label="Giá Combo"
            rules={[{ required: true, message: "Vui lòng nhập giá combo!" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="durationCombo"
            label="Thời gian"
            rules={[{ required: true, message: "Vui lòng nhập thời gian!" }]}
          >
            <Select>
              <Option value={0}>1 tháng</Option>
              <Option value={1}>2 tháng</Option>
              <Option value={2}>3 tháng</Option>
              <Option value={3}>5 tháng</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Tạo
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ComboList;
