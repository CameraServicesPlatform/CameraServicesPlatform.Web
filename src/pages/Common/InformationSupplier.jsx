import { Card, Pagination, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllSuppliers } from "../../api/supplierApi";
 
const InformationSupplier = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuppliers = async () => {
      setLoading(true);
      const response = await getAllSuppliers(pageIndex, pageSize);
      if (response && response.isSuccess) {
        setSuppliers(response.result.items);
        setTotalPages(response.result.totalPages);
      } else {
        console.error("Lấy thông tin nhà cung cấp thất bại.");
      }
      setLoading(false);
    };

    fetchSuppliers();
  }, [pageIndex, pageSize]);

  const handleCardDoubleClick = (supplierID) => {
    navigate(`/supplier-information-detail/${supplierID}`);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-teal-600 mb-6">Nhà Cung Cấp</h1>
      {loading ? (
        <div className="flex justify-center">
          <Spin size="large" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {suppliers.map((supplier) => (
              <div
                key={supplier.supplierID}
                className="bg-white shadow-md rounded-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300"
                onDoubleClick={() => handleCardDoubleClick(supplier.supplierID)}
              >
                <div className="flex items-center p-4">
                  <img
                    src={supplier.supplierLogo}
                    alt={`${supplier.supplierName} logo`}
                    className="w-16 h-16 object-cover rounded-full mr-4"
                  />
                  <h2 className="text-xl font-semibold text-teal-600">{supplier.supplierName}</h2>
                </div>
                <div className="px-4 pb-4">
                  <p className="text-gray-700 mb-2">{supplier.supplierDescription}</p>
                  <p className="text-gray-500"><strong>Địa Chỉ:</strong> {supplier.supplierAddress}</p>
                  <p className="text-gray-500"><strong>Liên Hệ:</strong> {supplier.contactNumber}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-center">
            <Pagination
              current={pageIndex}
              pageSize={pageSize}
              total={totalPages * pageSize}
              onChange={(page) => setPageIndex(page)}
              showSizeChanger={false}
              className="text-teal-600"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default InformationSupplier;
