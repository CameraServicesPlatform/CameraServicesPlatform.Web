import { EditOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Spin,
  Table,
  Typography,
} from "antd";
import React, { useCallback, useEffect, useMemo, useState } from "react";
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
  const [dateRange, setDateRange] = useState([]);
  const [supplierDetails, setSupplierDetails] = useState(null);
  const [combos, setCombos] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

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
          const [startDate, endDate] = dateRange;
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
          message.error("Lỗi khi lấy dữ liệu.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [supplierId, dateRange]);

  const handleDateChange = useCallback((dates) => {
    if (dates) {
      setDateRange([
        dates[0].format("YYYY-MM-DD"),
        dates[1].format("YYYY-MM-DD"),
      ]);
    } else {
      setDateRange([]);
    }
  }, []);

  const handleUpdateSupplier = async (formData) => {
    const result = await updateSupplier(formData);
    if (result) {
      message.success("Supplier updated successfully");
      setSupplierDetails(result);
      setIsModalVisible(false);
    } else {
      message.error("Failed to update supplier");
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const columns = useMemo(
    () => [
      {
        title: "Product ID",
        dataIndex: "productId",
        key: "productId",
      },
      {
        title: "Product Name",
        dataIndex: "productName",
        key: "productName",
      },
    ],
    []
  );

  const orderCostColumns = useMemo(
    () => [
      {
        title: "Month",
        dataIndex: "month",
        key: "month",
        render: (text) => new Date(text).toLocaleDateString(),
      },
      {
        title: "Total Cost",
        dataIndex: "totalCost",
        key: "totalCost",
      },
    ],
    []
  );

  const orderStatisticsColumns = useMemo(
    () => [
      {
        title: "Total Sales",
        dataIndex: "totalSales",
        key: "totalSales",
      },
      {
        title: "Total Orders",
        dataIndex: "totalOrders",
        key: "totalOrders",
      },
      {
        title: "Pending Orders",
        dataIndex: "pendingOrders",
        key: "pendingOrders",
      },
      {
        title: "Completed Orders",
        dataIndex: "completedOrders",
        key: "completedOrders",
      },
      {
        title: "Canceled Orders",
        dataIndex: "canceledOrders",
        key: "canceledOrders",
      },
    ],
    []
  );

  return (
    <div className="container mx-auto p-4">
      <Title level={1} className="text-center mb-8">
        Bảng Điều Khiển Nhà Cung Cấp
      </Title>
      {supplierDetails && (
        <div className="flex flex-wrap gap-4">
          <Card title="Supplier Details" className="flex-1">
            <p>Supplier Name: {supplierDetails.supplierName}</p>
            <p>Supplier Description: {supplierDetails.supplierDescription}</p>
            <p>Supplier Address: {supplierDetails.supplierAddress}</p>
            <p>Contact Number: {supplierDetails.contactNumber}</p>
            <Button type="primary" icon={<EditOutlined />} onClick={showModal}>
              Update
            </Button>
          </Card>
          <Card title="Combos" className="flex-1">
            {combos.map((combo) => (
              <Card key={combo.comboOfSupplierId} className="mb-4">
                <p>Combo Name: {combo.comboName}</p>
                <p>Combo Price: {combo.comboPrice}</p>
                <p>Duration: {combo.durationCombo}</p>
              </Card>
            ))}
          </Card>
        </div>
      )}
      <Modal
        title="Update Supplier Details"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form initialValues={supplierDetails} onFinish={handleUpdateSupplier}>
          <Form.Item name="supplierName" label="Supplier Name">
            <Input />
          </Form.Item>
          <Form.Item name="supplierDescription" label="Supplier Description">
            <Input />
          </Form.Item>
          <Form.Item name="supplierAddress" label="Supplier Address">
            <Input />
          </Form.Item>
          <Form.Item name="contactNumber" label="Contact Number">
            <Input />
          </Form.Item>
          <Form.Item name="supplierLogo" label="Supplier Logo">
            <Input type="file" />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Update
          </Button>
        </Form>
      </Modal>
      <Card className="mb-4">
        <RangePicker onChange={handleDateChange} />
      </Card>
      {loading ? (
        <Spin className="flex justify-center items-center h-64" />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          <Card title="Thống Kê Đơn Hàng">
            <Table
              dataSource={[data.orderStatistics]}
              columns={orderStatisticsColumns}
              pagination={false}
            />
          </Card>
          <Card title="Thống Kê Sản Phẩm">
            <Table
              dataSource={data.productStatistics}
              columns={columns}
              pagination={false}
            />
          </Card>
          <Card title="Thống Kê Chi Phí Đơn Hàng">
            <Table
              dataSource={data.orderCostStatistics}
              columns={orderCostColumns}
              pagination={false}
            />
          </Card>

          <Card title="Tổng Doanh Thu">
            <Text className="text-lg">{data.totalRevenue}</Text>
          </Card>
          <Card title="Biểu Đồ Doanh Thu Hàng Tháng">
            <LineChart width={500} height={300} data={data.monthlyRevenue}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="totalRevenue" stroke="#8884d8" />
            </LineChart>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DashboardSupplier;
