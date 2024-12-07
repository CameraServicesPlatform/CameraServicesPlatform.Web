import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

const ProductStatusEnum = {
  AvailableSell: 0,
  AvailableRent: 1,
  Rented: 2,
  Sold: 3,
  DiscontinuedProduct: 4,
};

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

const HandleSearchAndFilter = ({ products, onFilter }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [priceRange, setPriceRange] = useState([0, Infinity]);
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    const filteredProducts = products
      .filter((product) => {
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
      })
      .sort((a, b) => {
        if (sortOrder === "asc") {
          return new Date(a[sortField]) - new Date(b[sortField]);
        } else {
          return new Date(b[sortField]) - new Date(a[sortField]);
        }
      });

    onFilter(filteredProducts);
  }, [
    searchTerm,
    selectedStatus,
    selectedBrand,
    priceRange,
    sortField,
    sortOrder,
    products,
    onFilter,
  ]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  const handleBrandChange = (e) => {
    setSelectedBrand(e.target.value);
  };

  const handlePriceChange = (e) => {
    const [min, max] = e.target.value.split("-");
    setPriceRange([Number(min), Number(max)]);
  };

  const handleReset = () => {
    setSearchTerm("");
    setSelectedStatus("");
    setSelectedBrand("");
    setPriceRange([0, Infinity]);
  };

  const handleSortFieldChange = (e) => {
    setSortField(e.target.value);
  };

  const handleSortOrderChange = (e) => {
    setSortOrder(e.target.value);
  };

  return (
    <div className="mb-4 p-4 bg-white shadow rounded-lg">
      <div className="flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Tìm kiếm..."
          value={searchTerm}
          onChange={handleSearch}
          className="border p-2 rounded w-full md:w-1/4"
        />
        <select
          value={selectedStatus}
          onChange={handleStatusChange}
          className="border p-2 rounded w-full md:w-1/4"
        >
          <option value="">Tất cả trạng thái</option>
          <option value={ProductStatusEnum.AvailableSell}>Đang bán</option>
          <option value={ProductStatusEnum.AvailableRent}>Đang cho thuê</option>
          <option value={ProductStatusEnum.Rented}>Đã cho thuê</option>
          <option value={ProductStatusEnum.Sold}>Đã bán</option>
          <option value={ProductStatusEnum.DiscontinuedProduct}>
            Ngừng kinh doanh
          </option>
        </select>
        <select
          value={selectedBrand}
          onChange={handleBrandChange}
          className="border p-2 rounded w-full md:w-1/4"
        >
          <option value="">Tất cả thương hiệu</option>
          <option value={BrandEnum.Canon}>Canon</option>
          <option value={BrandEnum.Nikon}>Nikon</option>
          <option value={BrandEnum.Sony}>Sony</option>
          <option value={BrandEnum.Fujifilm}>Fujifilm</option>
          <option value={BrandEnum.Olympus}>Olympus</option>
          <option value={BrandEnum.Panasonic}>Panasonic</option>
          <option value={BrandEnum.Leica}>Leica</option>
          <option value={BrandEnum.Pentax}>Pentax</option>
          <option value={BrandEnum.Hasselblad}>Hasselblad</option>
          <option value={BrandEnum.Sigma}>Sigma</option>
        </select>
        <select
          value={priceRange.join("-")}
          onChange={handlePriceChange}
          className="border p-2 rounded w-full md:w-1/4"
        >
          <option value="0-Infinity">Tất cả giá</option>
          <option value="0-1000000">Dưới 1,000,000 VND</option>
          <option value="1000000-5000000">1,000,000 - 5,000,000 VND</option>
          <option value="5000000-Infinity">Trên 5,000,000 VND</option>
        </select>
        <select
          value={sortField}
          onChange={handleSortFieldChange}
          className="border p-2 rounded w-full md:w-1/4"
        >
          <option value="createdAt">Ngày tạo</option>
          <option value="updatedAt">Ngày cập nhật</option>
        </select>
        <select
          value={sortOrder}
          onChange={handleSortOrderChange}
          className="border p-2 rounded w-full md:w-1/4"
        >
          <option value="asc">Tăng dần</option>
          <option value="desc">Giảm dần</option>
        </select>
        <button
          onClick={handleReset}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Xóa
        </button>
      </div>
    </div>
  );
};

const ProductList = ({ products }) => {
  const [filteredProducts, setFilteredProducts] = useState(products);

  const handleFilter = (filtered) => {
    setFilteredProducts(filtered);
  };

  return (
    <div>
      <HandleSearchAndFilter products={products} onFilter={handleFilter} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.productID}
            product={product}
            categoryNames={{}}
            handleView={() => {}}
            handleEdit={() => {}}
            handleDelete={() => {}}
            handleExpandDescription={() => {}}
            expandedDescriptions={{}}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
