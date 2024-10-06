import React, { useState } from 'react';

function ProductList() {
  // Dữ liệu mẫu sản phẩm
  const products = [
    { id: 1, name: 'Sản phẩm 1', price: 500000, status: 'for rent', type: 'type1', brand: 'brand1', image: 'link-to-image-1' },
    { id: 2, name: 'Sản phẩm 2', price: 300000, status: 'for buy', type: 'type2', brand: 'brand2', image: 'link-to-image-2' },
    { id: 3, name: 'Sản phẩm 3', price: 700000, status: 'for rent', type: 'type1', brand: 'brand3', image: 'link-to-image-3' },
    { id: 4, name: 'Sản phẩm 4', price: 250000, status: 'for buy', type: 'type3', brand: 'brand1', image: 'link-to-image-4' },
  ];

  // State cho các bộ lọc
  const [filters, setFilters] = useState({
    priceRange: 'all',
    status: 'all',
    type: 'all',
    brand: 'all',
  });

  // Hàm thay đổi bộ lọc
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  // Lọc sản phẩm dựa trên bộ lọc
  const filteredProducts = products.filter((product) => {
    const { priceRange, status, type, brand } = filters;
    return (
      (priceRange === 'all' || 
       (priceRange === 'low' && product.price < 400000) || 
       (priceRange === 'medium' && product.price >= 400000 && product.price <= 600000) || 
       (priceRange === 'high' && product.price > 600000)) &&
      (status === 'all' || product.status === status) &&
      (type === 'all' || product.type === type) &&
      (brand === 'all' || product.brand === brand)
    );
  });

  return (
    <div className="container mx-auto p-6 flex">
      {/* Cột filter */}
      <div className="w-1/4 pr-6">
        <h2 className="text-2xl font-bold mb-4">Lọc sản phẩm</h2>
        
        {/* Lọc theo giá */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Giá</h3>
          <select name="priceRange" value={filters.priceRange} onChange={handleFilterChange} className="w-full p-2 border rounded">
            <option value="all">Tất cả</option>
            <option value="low">Dưới 400,000 VND</option>
            <option value="medium">400,000 - 600,000 VND</option>
            <option value="high">Trên 600,000 VND</option>
          </select>
        </div>

        {/* Lọc theo tình trạng */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Tình trạng</h3>
          <select name="status" value={filters.status} onChange={handleFilterChange} className="w-full p-2 border rounded">
            <option value="all">Tất cả</option>
            <option value="for rent">Cho thuê</option>
            <option value="for buy">Bán</option>
          </select>
        </div>

        {/* Lọc theo loại sản phẩm */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Loại sản phẩm</h3>
          <select name="type" value={filters.type} onChange={handleFilterChange} className="w-full p-2 border rounded">
            <option value="all">Tất cả</option>
            <option value="type1">Loại 1</option>
            <option value="type2">Loại 2</option>
            <option value="type3">Loại 3</option>
          </select>
        </div>

        {/* Lọc theo thương hiệu */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Thương hiệu</h3>
          <select name="brand" value={filters.brand} onChange={handleFilterChange} className="w-full p-2 border rounded">
            <option value="all">Tất cả</option>
            <option value="brand1">Thương hiệu 1</option>
            <option value="brand2">Thương hiệu 2</option>
            <option value="brand3">Thương hiệu 3</option>
          </select>
        </div>
      </div>

      {/* Danh sách sản phẩm */}
      <div className="w-3/4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product.id} className="border rounded-lg shadow-lg p-4">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover rounded-t-lg mb-4"
              />
              <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
              <p className="text-lg text-gray-700 mb-4">{product.price.toLocaleString('vi-VN')} VND</p>
              <div className="flex justify-between items-center">
                {/* <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                  Thêm vào giỏ hàng
                </button> */}
                <button className="text-blue-500 hover:underline">Xem chi tiết</button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-4">Không có sản phẩm nào.</p>
        )}
      </div>
    </div>
  );
}

export default ProductList;
