import { Button, Input, message } from "antd";
import React, { useState } from "react";
import { getOrderByOrderType } from "../../../api/orderApi"; // Adjust the import based on your project structure

const FilterOrders = ({ setOrders }) => {
  const [filterType, setFilterType] = useState("");

  const handleFilterOrders = async () => {
    if (filterType) {
      try {
        const filteredOrders = await getOrderByOrderType(filterType, 0, 10);
        if (filteredOrders) {
          setOrders(
            Array.isArray(filteredOrders.result) ? filteredOrders.result : []
          );
        } else {
          message.error("Failed to fetch filtered orders.");
        }
      } catch (err) {
        message.error("Error fetching filtered orders.");
      }
    }
  };

  return (
    <div>
      <Input
        placeholder="Filter by Type"
        value={filterType}
        onChange={(e) => setFilterType(e.target.value)}
        className="w-64 mb-4 mr-2"
      />
      <Button type="default" onClick={handleFilterOrders}>
        Filter
      </Button>
    </div>
  );
};

export default FilterOrders;
