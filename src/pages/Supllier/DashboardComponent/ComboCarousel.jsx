import React from "react";
import { Card, Carousel, Descriptions, Typography } from "antd";
import { AppstoreOutlined } from "@ant-design/icons";

const formatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});

const durationMap = {
  0: "1",
  1: "2",
  2: "3",
  3: "5",
};

const ComboCarousel = ({ combos, totalCombos, totalDuration }) => (
  <Card
    title={
      <span>
        <AppstoreOutlined /> Gói Combo Đăng Kí
      </span>
    }
  >
    {combos.length > 0 ? (
      <Carousel dots={false} infinite autoplay>
        {combos.map((combo) => (
          <div key={combo.comboOfSupplierId}>
            <Card size="small" style={{ margin: "0 10px" }}>
              <Descriptions bordered column={1} size="small">
                <Descriptions.Item label="Tên Combo">
                  {combo.comboName}
                </Descriptions.Item>
                <Descriptions.Item label="Giá Combo">
                  {formatter.format(combo.comboPrice)}
                </Descriptions.Item>
                <Descriptions.Item label="Thời Hạn">
                  {durationMap[combo.durationCombo]} Tháng
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </div>
        ))}
      </Carousel>
    ) : (
      <Typography.Text>Không có Combo nào.</Typography.Text>
    )}
    <div style={{ marginBottom: "16px" }}>
      <Typography.Text strong>Tổng Số Combo:</Typography.Text> {totalCombos}
      <br />
      <Typography.Text strong>Tổng Thời Hạn:</Typography.Text> {totalDuration} Tháng
    </div>
  </Card>
);

export default ComboCarousel;
