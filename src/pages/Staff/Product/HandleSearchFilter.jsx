import { Input, Select } from "antd";
import React, { useEffect, useState } from "react";

const { Option } = Select;

const BrandEnum = {
  Canon: 0,
  Nikon: 1,
  Sony: 2,
  Fujifilm: 3,
  Olympus: 4,
  Panasonic: 5,
  Leica: 6,
  Pentax: 7,
  Hasselblad: 8,
  Sigma: 9,
};

const HandleSearchFilter = ({ products = [], onFilter }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [priceRange, setPriceRange] = useState([0, Infinity]);

  useEffect(() => {
    if (!products) return;

    const filteredProducts = products.filter((product) => {
      const matchesSearchTerm = product.productName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus =
        selectedStatus === "" || product.status === Number(selectedStatus);
      const matchesBrand =
        selectedBrand === "" || product.brand === Number(selectedBrand);
      const matchesPrice =
        product.priceBuy >= priceRange[0] && product.priceBuy <= priceRange[1];

      return matchesSearchTerm && matchesStatus && matchesBrand && matchesPrice;
    });

    onFilter(filteredProducts);
  }, [
    searchTerm,
    selectedStatus,
    selectedBrand,
    priceRange,
    products,
    onFilter,
  ]);

  return (
    <div>
      <Input
        placeholder="Search products"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: "16px" }}
      />
      <Select
        placeholder="Select Status"
        value={selectedStatus}
        onChange={(value) => setSelectedStatus(value)}
        style={{ width: "100%", marginBottom: "16px" }}
      >
        <Option value="">All Statuses</Option>
        <Option value="0">For Sale</Option>
        <Option value="1">For Rent</Option>
        <Option value="2">Rented Out</Option>
        <Option value="3">Sold</Option>
        <Option value="4">Unavailable</Option>
      </Select>
      <Select
        placeholder="Select Brand"
        value={selectedBrand}
        onChange={(value) => setSelectedBrand(value)}
        style={{ width: "100%", marginBottom: "16px" }}
      >
        <Option value="">All Brands</Option>
        {Object.keys(BrandEnum).map((brand) => (
          <Option key={BrandEnum[brand]} value={BrandEnum[brand]}>
            {brand}
          </Option>
        ))}
      </Select>
    </div>
  );
};

export default HandleSearchFilter;
