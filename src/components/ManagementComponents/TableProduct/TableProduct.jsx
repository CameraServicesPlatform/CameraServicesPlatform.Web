import { useEffect, useState } from "react";
import { clothTypeLabels } from "../../../utils/constant";
import { ProductDetailModal } from "../../../pages/Management/Admin/ShopDetail/ProductDetailModal";
import {
  getProductStockByProductId,
  getRatingByProductId,
} from "../../../api/productApi";
import LoadingComponent from "../../../components/LoadingComponent/LoadingComponent";
import { decode } from "../../../utils/jwtUtil";
import { ProductStockModal } from "../ProductStock/ProductStockModal";
export const TableProduct = ({ products }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProductStockModalOpen, setIsProductStockModalOpen] = useState(false);

  const [ratings, setRating] = useState(null);
  const [productStocks, setProductStock] = useState({});

  const handleProductClick = async (product) => {
    setIsLoading(true);
    setSelectedProduct(product);
    const data = await getRatingByProductId(product.product?.id, 1, 10);
    if (data.isSuccess) {
      setRating(data.result?.items);
    }
    setIsModalOpen(true);
    setIsLoading(false);
  };
  const handleProductStockClick = async (product) => {
    setIsLoading(true);
    setSelectedProduct(product);
    const data = await getProductStockByProductId(product.product?.id);
    if (data.isSuccess) {
      setProductStock(data.result);
    }
    setIsProductStockModalOpen(true);
    setIsLoading(false);
  };
  const handleModalClose = () => {
    setIsModalOpen(false);
  };
  const role = decode(localStorage.getItem("accessToken")).role;

  return (
    <>
      <LoadingComponent isLoading={isLoading} />
      <div className="overflow-x-auto shadow-md rounded-md">
        <table className="table table-compact w-full">
          <thead>
            <tr>
              <th>Ảnh</th>
              <th>Tên sản phẩm</th>
              <th>Mô tả sản phẩm</th>
              <th>Giới tính</th>
              <th>Loại</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {products &&
              products.map((item) => (
                <tr key={item.product.id} className="cursor-pointer">
                  <td>
                    <img
                      src={item.staticFile[0]?.img}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-full"
                    />
                  </td>
                  <td>{item.product.name}</td>
                  <td>{item.product?.description}</td>
                  <td>
                    {item.product.gender === 0
                      ? "Nam"
                      : item.product.gender === 1
                      ? "Nữ"
                      : "Unisex"}
                  </td>
                  <td>{clothTypeLabels[item.product?.clothType]}</td>
                  <th>
                    <div className="flex justify-start">
                      {role === "isShop" ? (
                        <button
                          onClick={() => handleProductStockClick(item)}
                          className=" text-primary rounded-md mx-2 p-4 cursor-pointer"
                        >
                          <i className="fa-solid fa-eye"></i>
                        </button>
                      ) : (
                        <button
                          className=" text-primary rounded-md cursor-pointer p-4"
                          onClick={() => handleProductClick(item)}
                        >
                          <i className="fa-solid fa-eye"></i>
                        </button>
                      )}
                    </div>
                  </th>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <>
          <ProductDetailModal
            product={selectedProduct}
            ratings={ratings}
            onClose={handleModalClose}
          />
        </>
      )}
      {isProductStockModalOpen && (
        <>
          <ProductStockModal
            items={productStocks}
            onClose={() => setIsProductStockModalOpen(!isProductStockModalOpen)}
          />
        </>
      )}
    </>
  );
};
