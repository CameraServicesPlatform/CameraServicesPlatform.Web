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
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Nhà Cung Cấp</h1>
      {loading ? (
        <div className="flex justify-center">
          <Spin size="large" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {suppliers.map((supplier) => (
            <Card
              key={supplier.supplierID}
              title={supplier.supplierName}
              className="shadow-md cursor-pointer"
              extra={
                <img
                  src={supplier.supplierLogo}
                  alt={`${supplier.supplierName} logo`}
                  className="w-16 h-16 object-cover"
                />
              }
              onDoubleClick={() => handleCardDoubleClick(supplier.supplierID)}
            >
              <p className="text-gray-700">{supplier.supplierDescription}</p>
              <p className="text-gray-500">
                <strong>Địa Chỉ: </strong> {supplier.supplierAddress}
              </p>
              <p className="text-gray-500">
                <strong>Liên Hệ:</strong> {supplier.contactNumber}
              </p>
            </Card>
          ))}
        </div>
      )}
      <div className="mt-4 flex justify-center">
        <Pagination
          current={pageIndex}
          pageSize={pageSize}
          total={totalPages * pageSize}
          onChange={(page) => setPageIndex(page)}
          showSizeChanger={false}
        />
      </div>
    </div>
  );
};

export default InformationSupplier;
