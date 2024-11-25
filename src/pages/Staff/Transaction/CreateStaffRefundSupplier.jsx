import { Button, Table, Tag, Typography, message } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getStaffByAccountId, getUserById } from "../../../api/accountApi";
import { getAllOrders } from "../../../api/orderApi";
import { getSupplierById } from "../../../api/supplierApi";
import { createStaffRefundSupplier } from "../../../api/transactionApi";

const { Title } = Typography;

const orderStatusMap = {
  0: { text: "Chờ xử lý", color: "blue", icon: "fa-hourglass-start" },
  1: {
    text: "Sản phẩm sẵn sàng được giao",
    color: "green",
    icon: "fa-check-circle",
  },
  2: { text: "Hoàn thành", color: "yellow", icon: "fa-clipboard-check" },
  3: { text: "Đã nhận sản phẩm", color: "purple", icon: "fa-shopping-cart" },
  4: { text: "Đã giao hàng", color: "cyan", icon: "fa-truck" },
  5: { text: "Thanh toán thất bại", color: "cyan", icon: "fa-money-bill-wave" },
  6: { text: "Đang hủy", color: "lime", icon: "fa-box-open" },
  7: { text: "Đã hủy thành công", color: "red", icon: "fa-times-circle" },
  8: { text: "Đã Thanh toán", color: "orange", icon: "fa-money-bill-wave" },
  9: { text: "Hoàn tiền đang chờ xử lý", color: "pink", icon: "fa-clock" },
  10: { text: "Hoàn tiền", color: "brown", icon: "fa-undo" },
  11: { text: "Hoàn trả tiền đặt cọc", color: "gold", icon: "fa-piggy-bank" },
};

const orderTypeMap = {
  0: { text: "Mua", color: "indigo", icon: "fa-shopping-bag" },
  1: { text: "Thuê", color: "green", icon: "fa-warehouse" },
};

const deliveryStatusMap = {
  0: { text: "Nhận tại cửa hàng", color: "blue", icon: "fa-store" },
  1: { text: "Giao hàng tận nơi", color: "green", icon: "fa-truck" },
  2: { text: "Trả lại", color: "red", icon: "fa-undo" },
};

const CreateStaffRefundSupplier = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [supplierNames, setSupplierNames] = useState({});
  const [accountNames, setAccountNames] = useState({});
  const [staffId, setStaffId] = useState("");

  const user = useSelector((state) => state.user.user || {});

  useEffect(() => {
    const fetchStaffId = async () => {
      if (!user || !user.id) {
        console.error("User ID is not available");
        return;
      }

      try {
        const staffData = await getStaffByAccountId(user.id);
        if (staffData && staffData.isSuccess) {
          setStaffId(staffData.result);
          console.log("Fetched staffId:", staffData.result);
        } else {
          console.error("Failed to fetch staffId:", staffData.messages);
        }
      } catch (error) {
        console.error("Error fetching staffId:", error);
      }
    };

    fetchStaffId();
  }, [user]);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const result = await getAllOrders(pageIndex, pageSize);
      if (result && result.isSuccess) {
        setOrders(result.result);
        setTotal(result.totalCount);

        // Fetch supplier and account names
        const supplierNamesMap = {};
        const accountNamesMap = {};
        await Promise.all(
          result.result.map(async (order) => {
            if (order.supplierID) {
              try {
                const supplierData = await getSupplierById(order.supplierID);
                if (
                  supplierData &&
                  supplierData.isSuccess &&
                  supplierData.result.items.length > 0
                ) {
                  supplierNamesMap[order.supplierID] =
                    supplierData.result.items[0].supplierName;
                } else {
                  console.error(
                    `No data found for supplierID: ${order.supplierID}`
                  );
                }
              } catch (error) {
                console.error(
                  `Error fetching supplierID: ${order.supplierID}`,
                  error
                );
              }
            }
            if (order.accountID) {
              try {
                const accountData = await getUserById(order.accountID);
                if (accountData && accountData.isSuccess) {
                  accountNamesMap[
                    order.accountID
                  ] = `${accountData.result.lastName} ${accountData.result.firstName}`;
                } else {
                  console.error(
                    `No data found for accountID: ${order.accountID}`
                  );
                }
              } catch (error) {
                console.error(
                  `Error fetching accountID: ${order.accountID}`,
                  error
                );
              }
            }
          })
        );
        setSupplierNames(supplierNamesMap);
        setAccountNames(accountNamesMap);
      }
      setLoading(false);
    };

    fetchOrders();
  }, [pageIndex, pageSize]);

  const handleRefund = async (orderID, orderStatus, orderType) => {
    if (!user || !user.id) {
      console.error("User ID is not available");
      return;
    }

    const staffData = await getStaffByAccountId(user.id);
    if (!staffData || !staffData.isSuccess) {
      console.error(
        "Failed to fetch staffId:",
        staffData ? staffData.messages : "No response"
      );
      return;
    }

    const staffId = staffData.result;
    console.log("Staff ID:", staffId);

    try {
      let response;
      if (orderStatus === 2) {
        response = await createStaffRefundSupplier(orderID, staffId);
      }

      if (response && response.isSuccess) {
        message.success(
          "Tạo đơn hàng thành công. Đang chuyển hướng đến thanh toán..."
        );
        window.location.href = response.result;
      } else {
        message.error("Không thể khởi tạo thanh toán.");
      }
    } catch (error) {
      message.error(
        "Không thể tạo đơn hàng. " + (error.response?.data?.title || "")
      );
      console.error(error);
    }
  };

  const columns = [
    {
      title: "Mã nhà cung cấp",
      dataIndex: "supplierID",
      key: "supplierID",
      render: (supplierID) => supplierNames[supplierID],
    },
    {
      title: "Mã đơn hàng",
      dataIndex: "orderID",
      key: "orderID",
    },
    {
      title: "Mã tài khoản",
      dataIndex: "accountID",
      key: "accountID",
      render: (accountID) => accountNames[accountID],
    },
    {
      title: "Ngày đặt hàng",
      dataIndex: "orderDate",
      key: "orderDate",
      render: (orderDate) => moment(orderDate).format("DD - MM - YYYY HH:mm"),
    },
    {
      title: "Trạng thái đơn hàng",
      dataIndex: "orderStatus",
      key: "orderStatus",
      render: (orderStatus) => {
        const status = orderStatusMap[orderStatus];
        return (
          <Tag color={status.color}>
            <i className={`fa ${status.icon}`} /> {status.text}
          </Tag>
        );
      },
    },
    {
      title: "Tổng số tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (totalAmount) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(totalAmount),
    },
    {
      title: "Loại đơn hàng",
      dataIndex: "orderType",
      key: "orderType",
      render: (orderType) => {
        const type = orderTypeMap[orderType];
        return (
          <Tag color={type.color}>
            <i className={`fa ${type.icon}`} /> {type.text}
          </Tag>
        );
      },
    },
    {
      title: "Địa chỉ giao hàng",
      dataIndex: "shippingAddress",
      key: "shippingAddress",
    },
    {
      title: "Phương thức giao hàng",
      dataIndex: "deliveriesMethod",
      key: "deliveriesMethod",
      render: (deliveriesMethod) => {
        const method = deliveryStatusMap[deliveriesMethod];
        return (
          <Tag color={method.color}>
            <i className={`fa ${method.icon}`} /> {method.text}
          </Tag>
        );
      },
    },
    {
      title: "Tiền đặt cọc",
      dataIndex: "deposit",
      key: "deposit",
      render: (deposit) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(deposit),
    },
    {
      title: "Hành động",
      key: "action",
      render: (text, record) =>
        ((record.orderStatus === 7 && record.orderType === 0) ||
          (record.orderStatus === 7 && record.orderType === 1) ||
          (record.orderStatus === 2 && record.orderType === 1)) && (
          <Button
            type="primary"
            onClick={() =>
              handleRefund(record.orderID, record.orderStatus, record.orderType)
            }
          >
            Hoàn tiền
          </Button>
        ),
    },
  ];

  return (
    <div className="p-4 max-w-4xl ">
      <Title level={2} className="text-center">
        Danh Sách Đơn Hàng
      </Title>
      <Table
        columns={columns}
        dataSource={orders}
        rowKey="orderID"
        loading={loading}
        pagination={{
          current: pageIndex,
          pageSize: pageSize,
          total: total,
          onChange: (page, pageSize) => {
            setPageIndex(page);
            setPageSize(pageSize);
          },
        }}
      />
    </div>
  );
};

export default CreateStaffRefundSupplier;
