import { Button, Input, message, Modal } from "antd";
import React, { useState } from "react";
import { formatDateTime, formatPrice } from "../../../utils/util";
import OrderCancelButton from "./OrderCancelButton";

const StatusBadge = ({ status, map }) => {
  const statusInfo = map[status] || {
    text: "Thanh toán thất bại",
    color: "gray",
    icon: "fa-question-circle",
  };
  return (
    <span className="flex items-center space-x-1 px-2 py-1 text-xs font-semibold rounded-full bg-opacity-20">
      <i
        className={`fa-solid ${statusInfo.icon} text-${statusInfo.color}-500`}
      ></i>
      <span className={`text-${statusInfo.color}-700`}>{statusInfo.text}</span>
    </span>
  );
};
const OrderItem = ({
  order,
  supplierMap,
  orderStatusMap,
  deliveryStatusMap,
  orderTypeMap,
  handleClick,
  handlePaymentAgain,
  updateOrderStatusPlaced,
  openUploadPopup,
}) => {
  const [isExtendModalVisible, setIsExtendModalVisible] = useState(false);
  const [extendData, setExtendData] = useState({});

  const showExtendModal = () => {
    setIsExtendModalVisible(true);
  };

  const handleExtendChange = (e) => {
    const { name, value } = e.target;
    setExtendData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleExtendSubmit = async () => {
    await handleExtend({ ...extendData, orderId: order.orderID });
    setIsExtendModalVisible(false);
  };
  return (
    <tr
      key={order.orderID}
      className={
        order.orderStatus === 1 && order.deliveriesMethod === 0
          ? "bg-yellow-100"
          : "cursor-pointer hover:bg-gray-50 transition-colors"
      }
      onClick={() => handleClick(order)}
    >
      <td className="py-3 px-4 border-b">{order.orderID}</td>
      <td className="py-3 px-4 border-b">
        <div>
          <strong>Tên nhà cung cấp:</strong>
          {supplierMap[order.supplierID]?.supplierName || " "}
        </div>
        <div>
          <strong>Địa chỉ:</strong>
          {supplierMap[order.supplierID]?.supplierAddress || " "}
        </div>
        <div>
          <strong>Mô tả:</strong>
          {supplierMap[order.supplierID]?.supplierDescription || " "}
        </div>
        <div>
          <strong>Số điện thoại liên hệ:</strong>
          {supplierMap[order.supplierID]?.contactNumber || ""}
        </div>
      </td>
      <td className="py-3 px-4 border-b">
        <StatusBadge status={order.orderStatus} map={orderStatusMap} />
      </td>
      <td className="py-3 px-4 border-b hidden md:table-cell">
        {order.shippingAddress}
      </td>
      <td className="py-3 px-4 border-b hidden lg:table-cell">
        <StatusBadge status={order.deliveriesMethod} map={deliveryStatusMap} />
      </td>
      <td className="py-3 px-4 border-b">
        <StatusBadge status={order.orderType} map={orderTypeMap} />
      </td>
      <td className="py-3 px-4 border-b hidden sm:table-cell">
        {formatDateTime(order.orderDate)}
      </td>
      <td className="py-3 px-4 border-b">{formatPrice(order.totalAmount)}</td>
      <td>
        {order.orderStatus === 0 && (
          <div className="flex justify-center">
            <button
              className="bg-primary text-white rounded-md py-2 px-4 my-2"
              onClick={(e) => {
                e.stopPropagation();
                handlePaymentAgain(order.orderID);
              }}
            >
              Thanh toán ngay
            </button>
          </div>
        )}
      </td>
      <td>
        <OrderCancelButton order={order} />
        {order.orderStatus === 1 && order.deliveriesMethod === 0 && (
          <button
            className="bg-blue-500 text-white rounded-md py-2 px-4 my-2"
            onClick={async (e) => {
              e.stopPropagation();
              await updateOrderStatusPlaced(order.orderID);
              message.success("Order status updated to 'Đến nhận'");
            }}
          >
            Đến nhận
          </button>
        )}
      </td>

      <td>
        {order.orderStatus !== 1 &&
          order.orderStatus !== 2 &&
          order.orderType === 1 && (
            <button
              className="bg-green-500 text-white rounded-md py-2 px-4 my-2"
              onClick={(e) => {
                e.stopPropagation();
                openUploadPopup(order.orderID, "after");
              }}
            >
              Thêm ảnh sản phẩm trước khi trả hàng
            </button>
          )}
      </td>
      <td className="py-3 px-6 border-b">
        {order.orderType === 1 && order.orderStatus === 3 && (
          <button onClick={showExtendModal}>Extend Order</button>
        )}
      </td>

      <td>
        {order.orderStatus === 3 &&
          order.deliveriesMethod === 0 &&
          order.orderType === 0 && (
            <button
              className="bg-green-500 text-white rounded-md py-2 px-4 my-2"
              onClick={async (e) => {
                e.stopPropagation();
                const data = {
                  orderID: order.orderID,
                  returnDate: new Date().toISOString(),
                  condition: "Good",  
                };
                const result = await createReturnDetailForMember(data);
                if (result && result.isSuccess) {
                  message.success("Return detail created successfully");
                  openUploadPopup(order.orderID, "after");
                } else {
                  message.error("Failed to create return detail");
                }
              }}
            >
              Thêm ảnh sản phẩm trước khi trả hàng
            </button>
          )}
      </td>
      <td></td>
      <Modal
        title="Extend Order"
        visible={isExtendModalVisible}
        onCancel={() => setIsExtendModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsExtendModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleExtendSubmit}>
            Submit
          </Button>,
        ]}
      >
        <Input
          name="extendReason"
          placeholder="Reason for extension"
          onChange={handleExtendChange}
        />
       </Modal>
    </tr>
  );
};
export default OrderItem;
