import { faClock, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { cancelOrder } from "../../../api/orderApi";

const OrderCancelButton = ({ order }) => {
  const calculateRemainingTime = (orderDate) => {
    const orderTime = new Date(orderDate).getTime();
    const currentTime = new Date().getTime();
    const timeDifference = 24 * 60 * 60 * 1000 - (currentTime - orderTime);
    return timeDifference > 0 ? timeDifference : 0;
  };

  const [remainingTime, setRemainingTime] = useState(
    calculateRemainingTime(order.orderDate)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingTime(calculateRemainingTime(order.orderDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [order.orderDate]);

  const isWithin24Hours = (orderDate) => {
    const orderTime = new Date(orderDate).getTime();
    const currentTime = new Date().getTime();
    const timeDifference = currentTime - orderTime;
    return timeDifference <= 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  };

  const formatTime = (milliseconds) => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    (order.orderStatus === 0 || order.orderStatus === 8) &&
    isWithin24Hours(order.orderDate) && (
      <div className="flex justify-center items-center">
        <FontAwesomeIcon icon={faClock} className="mr-2" />
        <span className="mr-2">{formatTime(remainingTime)}</span>
        <button
          className="bg-red-500 text-white rounded-md py-2 px-4 my-2 flex items-center group"
          onClick={async (e) => {
            e.preventDefault();
            alert("Cancel Order Request clicked"); // Show alert
            console.log("Order:", order); // Log the order object
            if (!order.orderID) {
              console.error("Order ID is undefined");
              return;
            }
            try {
              const result = await cancelOrder(order.orderID);
              console.log("API Response:", result); // Log the API response
              if (result && result.isSuccess) {
                console.log("Order canceled successfully:", result);
                window.location.reload(); // Reload the page
              } else {
                console.error("Failed to cancel order:", result.messages);
              }
            } catch (err) {
              console.error("Error canceling order:", err);
            }
          }}
        >
          <FontAwesomeIcon icon={faTimes} className="mr-2 group-hover:hidden" />
          <span className="hidden group-hover:inline">
            Yêu cầu hủy đơn hàng
          </span>
        </button>
      </div>
    )
  );
};

export default OrderCancelButton;
