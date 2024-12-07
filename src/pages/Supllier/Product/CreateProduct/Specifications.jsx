import { Button, Form, Input, Space } from "antd";
import React from "react";

const Specifications = ({ specifications, setSpecifications }) => {
  const handleAddSpecification = () => {
    setSpecifications([...specifications, { feature: "", description: "" }]);
  };

  const handleSpecificationChange = (value, index, field) => {
    const newSpecifications = [...specifications];
    newSpecifications[index][field] = value;
    setSpecifications(newSpecifications);
  };

  const handleRemoveSpecification = (index) => {
    const newSpecifications = specifications.filter((_, i) => i !== index);
    setSpecifications(newSpecifications);
  };

  return (
    <Form.Item label="Đặc điểm sản phẩm">
      {specifications.map((specification, index) => (
        <Space key={index} style={{ display: "flex", marginBottom: 8 }}>
          <Input
            value={specification.feature}
            onChange={(e) =>
              handleSpecificationChange(e.target.value, index, "feature")
            }
            placeholder={`Đặc điểm ${index + 1}`}
            style={{ width: "100%" }}
          />
          <Input
            value={specification.description}
            onChange={(e) =>
              handleSpecificationChange(e.target.value, index, "description")
            }
            placeholder={`Mô tả ${index + 1}`}
            style={{ width: "40%" }}
          />
          <Button
            type="danger"
            onClick={() => handleRemoveSpecification(index)}
          >
            Xóa
          </Button>
        </Space>
      ))}
      <Button type="dashed" onClick={handleAddSpecification}>
        Thêm đặc điểm
      </Button>
    </Form.Item>
  );
};

export default Specifications;
