import {
  AppstoreOutlined,
  BarChartOutlined,
  DollarOutlined,
  EditOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Descriptions,
  Form,
  Input,
  List,
  message,
  Modal,
  Row,
  Spin,
  Table,
  Typography,
} from "antd";
import dayjs from "dayjs";
import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Legend, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";
import { getSupplierIdByAccountId } from "../../api/accountApi";
import { getComboById, getCombosBySupplierId } from "../../api/comboApi";
import {
  getBestSellingCategoriesBySupplier,
  getCalculateMonthlyRevenueBySupplier,
  getCalculateTotalRevenueBySupplier,
  getMonthOrderCostStatistics,
  getOrderStatusStatisticsBySupplier,
  getSupplierOrderStatistics,
  getSupplierPaymentStatistics,
  getSupplierProductStatistics,
  getSupplierRatingStatistics,
  getSupplierTransactionStatistics,
} from "../../api/dashboardApi";
import { getSupplierById, updateSupplier } from "../../api/supplierApi";
const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

// Add formatter at the top
const formatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
});

// Define duration mapping
const durationMap = {
  0: "Một tháng",
  1: "Hai tháng",
  2: "Ba tháng",
  3: "Năm tháng",
};

const DashboardSupplier = () => {
  const user = useSelector((state) => state.user.user || {});
  const accountId = user.id;
  const [supplierId, setSupplierId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    bestSellingCategories: [],
    productStatistics: [],
    orderCostStatistics: [],
    orderStatistics: {},
    totalRevenue: 0,
    monthlyRevenue: [],
    ratingStatistics: [],
    paymentStatistics: [],
    transactionStatistics: [],
    orderStatusStatistics: [],
  });
  const [dateRange, setDateRange] = useState([
    moment().subtract(1, "months"),
    moment(),
  ]);
  const [supplierDetails, setSupplierDetails] = useState(null);
  const [combos, setCombos] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [addComboForm] = Form.useForm();
  const [startDate, setStartDate] = useState(() =>
    dayjs().subtract(1, "month")
  );
  const [endDate, setEndDate] = useState(() => dayjs());
  useEffect(() => {
    const fetchSupplierId = async () => {
      if (user.id) {
        try {
          const response = await getSupplierIdByAccountId(user.id);
          if (response?.isSuccess) {
            setSupplierId(response.result);
          } else {
            message.error("Không thể lấy ID nhà cung cấp.");
          }
        } catch (error) {
          message.error("Lỗi khi lấy ID nhà cung cấp.");
        }
      }
    };

    fetchSupplierId();
  }, [user]);

  useEffect(() => {
    const fetchSupplierDetails = async () => {
      if (supplierId) {
        const response = await getSupplierById(supplierId);
        if (response?.isSuccess) {
          setSupplierDetails(response.result.items[0]);
        } else {
          message.error("Không thể lấy thông tin nhà cung cấp.");
        }
      }
    };

    fetchSupplierDetails();
  }, [supplierId]);

  useEffect(() => {
    const fetchCombos = async () => {
      if (supplierId) {
        try {
          console.log("Fetching combos for supplierId:", supplierId);
          const response = await getCombosBySupplierId(supplierId);
          console.log("Response from getCombosBySupplierId:", response);

          if (response?.isSuccess && response.result) {
            const combo = response.result;
            console.log("Fetching details for comboId:", combo.comboId);
            const comboDetail = await getComboById(combo.comboId);
            console.log("Response from getComboById:", comboDetail);

            const comboDetails = {
              ...combo,
              comboName: comboDetail?.result?.comboName || "N/A",
              comboPrice: comboDetail?.result?.comboPrice || "N/A",
              durationCombo: comboDetail?.result?.durationCombo || "N/A",
              startTime: combo.startTime || "N/A",
              endTime: combo.endTime || "N/A",
              isDisable:
                combo.isDisable !== undefined ? combo.isDisable : "N/A",
            };

            console.log("Combo details:", comboDetails);
            setCombos([comboDetails]);
          } else {
            message.error("Không thể lấy thông tin combo.");
          }
        } catch (error) {
          console.error("Error fetching combos:", error);
          message.error("Lỗi khi lấy thông tin combo.");
        }
      }
    };

    fetchCombos();
  }, [supplierId]);

  useEffect(() => {
    const fetchData = async () => {
      if (supplierId && dateRange.length === 2) {
        setLoading(true);
        try {
          const [startDate, endDate] = dateRange.map((date) =>
            date.format("YYYY-MM-DD")
          ); // Format dates

          const bestSellingCategories =
            await getBestSellingCategoriesBySupplier(
              supplierId,
              startDate,
              endDate
            );
          const productStatistics = await getSupplierProductStatistics(
            supplierId
          );
          const orderCostStatistics = await getMonthOrderCostStatistics(
            supplierId,
            startDate,
            endDate
          );
          const orderStatistics = await getSupplierOrderStatistics(
            supplierId,
            startDate,
            endDate
          );
          const totalRevenue = await getCalculateTotalRevenueBySupplier(
            supplierId
          );
          const monthlyRevenue = await getCalculateMonthlyRevenueBySupplier(
            supplierId,
            startDate,
            endDate
          );
          const ratingStatistics = await getSupplierRatingStatistics(
            supplierId
          );
          const paymentStatistics = await getSupplierPaymentStatistics(
            supplierId,
            startDate,
            endDate
          );
          const transactionStatistics = await getSupplierTransactionStatistics(
            supplierId,
            startDate,
            endDate
          );
          const orderStatusStatistics =
            await getOrderStatusStatisticsBySupplier(supplierId);

          setData({
            bestSellingCategories: Array.isArray(bestSellingCategories)
              ? bestSellingCategories
              : [],
            productStatistics: Array.isArray(productStatistics)
              ? productStatistics
              : [],
            orderCostStatistics: Array.isArray(orderCostStatistics)
              ? orderCostStatistics
              : [],
            orderStatistics: orderStatistics || {},
            totalRevenue: totalRevenue || 0,
            monthlyRevenue: Array.isArray(monthlyRevenue) ? monthlyRevenue : [],
            ratingStatistics: Array.isArray(ratingStatistics)
              ? ratingStatistics
              : [],
            paymentStatistics: Array.isArray(paymentStatistics)
              ? paymentStatistics
              : [],
            transactionStatistics: Array.isArray(transactionStatistics)
              ? transactionStatistics
              : [],
            orderStatusStatistics: Array.isArray(orderStatusStatistics)
              ? orderStatusStatistics
              : [],
          });
        } catch (error) {
          console.error("Error fetching data:", error); // Added logging
          message.error("Lỗi khi lấy dữ liệu.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [supplierId, dateRange]);

  const handleDateChange = (dates) => {
    if (dates) {
      setStartDate(dates[0]);
      setEndDate(dates[1]);
    } else {
      setStartDate(dayjs().subtract(1, "month"));
      setEndDate(dayjs());
    }
  };

  const handleUpdateSupplier = async (formData) => {
    const result = await updateSupplier(formData);
    if (result) {
      message.success("Cập nhật nhà cung cấp thành công");
      setSupplierDetails(result);
      setIsModalVisible(false);
    } else {
      message.error("Cập nhật nhà cung cấp thất bại");
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleAddCombo = () => {
    setIsAddComboModalVisible(true);
  };

  const handleAddComboCancel = () => {
    setIsAddComboModalVisible(false);
    addComboForm.resetFields();
  };

  const handleAddComboSubmit = (values) => {
    // Implement the logic to add the new combo, e.g., API call
    console.log("New Combo Details:", values);
    // Example: After successful addition
    message.success("Combo đã được thêm thành công.");
    setIsAddComboModalVisible(false);
    addComboForm.resetFields();
    // Optionally, refresh the combos list
  };

  const columns = useMemo(
    () => [
      {
        title: "Tên Sản Phẩm",
        dataIndex: "productName",
        key: "productName",
      },
    ],
    []
  );

  const orderCostColumns = useMemo(
    () => [
      {
        title: "Tháng",
        dataIndex: "month",
        key: "month",
        render: (text) => new Date(text).toLocaleDateString(),
      },
      {
        title: "Tổng Chi Phí",
        dataIndex: "totalCost",
        key: "totalCost",
        render: (text) => formatter.format(text),
      },
    ],
    []
  );

  const orderStatisticsColumns = useMemo(
    () => [
      {
        title: "Tổng Doanh Thu",
        dataIndex: "totalSales",
        key: "totalSales",
        render: (text) => formatter.format(text),
      },
      {
        title: "Tổng Số Đơn Hàng",
        dataIndex: "totalOrders",
        key: "totalOrders",
      },
      {
        title: "Chờ Xử Lý",
        dataIndex: "pendingOrders",
        key: "pendingOrders",
      },
      {
        title: "Hoàn Thành",
        dataIndex: "completedOrders",
        key: "completedOrders",
      },
      {
        title: "Bị Hủy",
        dataIndex: "canceledOrders",
        key: "canceledOrders",
      },
      {
        title: "Được Duyệt",
        dataIndex: "approvedOrders",
        key: "approvedOrders",
      },
      {
        title: "Đã Đặt",
        dataIndex: "placedOrders",
        key: "placedOrders",
      },
      {
        title: "Đã Giao",
        dataIndex: "shippedOrders",
        key: "shippedOrders",
      },
      {
        title: "Thanh Toán Thất Bại",
        dataIndex: "paymentFailOrders",
        key: "paymentFailOrders",
      },
      {
        title: "Đang Hủy",
        dataIndex: "cancelingOrders",
        key: "cancelingOrders",
      },
      {
        title: "Thanh Toán",
        dataIndex: "paymentOrders",
        key: "paymentOrders",
      },
      {
        title: "Chờ Hoàn Tiền",
        dataIndex: "pendingRefundOrders",
        key: "pendingRefundOrders",
      },
      {
        title: "Đã Hoàn Tiền",
        dataIndex: "refundOrders",
        key: "refundOrders",
      },
      {
        title: "Trả Lại Tiền Đặt Cọc",
        dataIndex: "depositReturnOrders",
        key: "depositReturnOrders",
      },
      {
        title: "Gia Hạn",
        dataIndex: "extendOrders",
        key: "extendOrders",
      },
    ],
    []
  );

  return (
    <div className="container mx-auto p-4 bg-gray-50">
      <Title level={1} className="text-center mb-8 text-blue-600">
        Bảng Điều Khiển Nhà Cung Cấp
      </Title>
      {supplierDetails && (
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card
              title={
                <span>
                  <EditOutlined /> Thông Tin Nhà Cung Cấp
                </span>
              }
              className="flex-1 shadow-lg"
            >
              <Descriptions bordered column={1} size="small">
                <Descriptions.Item label="Tên Nhà Cung Cấp">
                  {supplierDetails.supplierName}
                </Descriptions.Item>
                <Descriptions.Item label="Mô Tả Nhà Cung Cấp">
                  {supplierDetails.supplierDescription}
                </Descriptions.Item>
                <Descriptions.Item label="Địa Chỉ Nhà Cung Cấp">
                  {supplierDetails.supplierAddress}
                </Descriptions.Item>
                <Descriptions.Item label="Số Điện Thoại Liên Hệ">
                  {supplierDetails.contactNumber}
                </Descriptions.Item>
              </Descriptions>
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={showModal}
                className="mt-4"
              >
                Cập Nhật
              </Button>
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card
              title={
                <span>
                  <AppstoreOutlined /> Combo
                </span>
              }
            >
              <List
                grid={{ gutter: 16, column: 1 }}
                dataSource={combos}
                renderItem={(combo) => (
                  <List.Item>
                    <Card>
                      <Descriptions bordered column={1} size="small">
                        <Descriptions.Item label="Tên Combo">
                          {combo.comboName}
                        </Descriptions.Item>
                        <Descriptions.Item label="Giá Combo">
                          {formatter.format(combo.comboPrice)}
                        </Descriptions.Item>
                        <Descriptions.Item label="Thời Hạn">
                          {durationMap[combo.durationCombo]}
                        </Descriptions.Item>
                      </Descriptions>
                    </Card>
                  </List.Item>
                )}
                locale={{ emptyText: "Không có Combo nào." }}
              />
            </Card>
          </Col>
        </Row>
      )}
      <Modal
        title="Cập Nhật Thông Tin Nhà Cung Cấp"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        bodyStyle={{ padding: "20px" }}
      >
        <Form
          layout="vertical"
          initialValues={supplierDetails}
          onFinish={handleUpdateSupplier}
        >
          <Form.Item name="supplierName" label="Tên Nhà Cung Cấp">
            <Input />
          </Form.Item>
          <Form.Item name="supplierDescription" label="Mô Tả Nhà Cung Cấp">
            <Input />
          </Form.Item>
          <Form.Item name="supplierAddress" label="Địa Chỉ Nhà Cung Cấp">
            <Input />
          </Form.Item>
          <Form.Item name="contactNumber" label="Số Điện Thoại Liên Hệ">
            <Input />
          </Form.Item>
          <Form.Item name="supplierLogo" label="Logo Nhà Cung Cấp">
            <Input type="file" />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Cập Nhật
          </Button>
        </Form>
      </Modal>

      <Card className="mb-4 shadow-md">
        <RangePicker
          onChange={handleDateChange}
          defaultValue={[startDate, endDate]}
          className="rounded-md"
          allowClear
          ranges={{
            "Last 7 Days": [moment().subtract(7, "days"), moment()],
            "Last 30 Days": [moment().subtract(30, "days"), moment()],
            "This Month": [moment().startOf("month"), moment().endOf("month")],
            "Last Month": [
              moment().subtract(1, "months").startOf("month"),
              moment().subtract(1, "months").endOf("month"),
            ],
          }}
        />
      </Card>
      {loading ? (
        <Spin className="flex justify-center items-center h-64" size="large" />
      ) : (
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card
              title={
                <span>
                  <DollarOutlined /> Tổng Doanh Thu
                </span>
              }
              className="shadow-sm"
            >
              <Text className="text-32 text-green-600">
                {formatter.format(data.totalRevenue)}
              </Text>
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card
              title={
                <span>
                  <ShoppingCartOutlined /> Thống Kê Chi Phí Đơn Hàng
                </span>
              }
              className="shadow-sm"
            >
              <Table
                dataSource={data.orderCostStatistics}
                columns={orderCostColumns}
                pagination={{ pageSize: 5 }}
                scroll={{ y: 240 }}
              />
            </Card>
          </Col>
          <Col xs={24}>
            <Card
              title={
                <span>
                  <ShoppingCartOutlined /> Thống Kê Đơn Hàng
                </span>
              }
              className="shadow-sm"
            >
              <Table
                dataSource={[data.orderStatistics]}
                columns={orderStatisticsColumns}
                pagination={{ pageSize: 5 }}
                scroll={{ y: 240 }}
              />
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card
              title={
                <span>
                  <AppstoreOutlined /> Thống Kê Sản Phẩm
                </span>
              }
              className="shadow-sm"
            >
              <Table
                dataSource={data.productStatistics}
                columns={columns}
                pagination={{ pageSize: 5 }}
                scroll={{ y: 240 }}
              />
            </Card>
          </Col>

          <Col xs={24}>
            <Card
              title={
                <span>
                  <BarChartOutlined /> Biểu Đồ Doanh Thu Hàng Tháng
                </span>
              }
              className="shadow-sm"
            >
              <LineChart width="100%" height={300} data={data.monthlyRevenue}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="totalRevenue" stroke="#8884d8" />
              </LineChart>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default DashboardSupplier;
