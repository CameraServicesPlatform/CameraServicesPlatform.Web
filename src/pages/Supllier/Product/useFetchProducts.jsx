import { message } from "antd";
import { useEffect, useState } from "react";
import { getSupplierIdByAccountId } from "../../../api/accountApi";
import { getCategoryById } from "../../../api/categoryApi"; // Import the API for fetching category by ID
import { getProductBySupplierId } from "../../../api/productApi";

const useFetchProducts = (user) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [supplierId, setSupplierId] = useState(null);
  const [categoryNames, setCategoryNames] = useState({});

  useEffect(() => {
    const fetchSupplierId = async () => {
      if (user.id) {
        try {
          const response = await getSupplierIdByAccountId(user.id);
          if (response?.isSuccess) {
            setSupplierId(response.result);
          } else {
            message.error("Failed to fetch supplier ID.");
          }
        } catch (error) {
          message.error("Error fetching supplier ID.");
        }
      }
    };

    fetchSupplierId();
  }, [user]);

  const fetchProducts = async () => {
    if (!supplierId) return;

    setLoading(true);
    try {
      const result = await getProductBySupplierId(
        supplierId,
        pageIndex,
        pageSize
      );
      if (Array.isArray(result)) {
        setProducts(result);
        setTotal(result.totalCount || 0);

        if (result.totalCount === 50) {
          alert("Hệ thống đã giúp bạn phân trang.");
        }

        const categoryPromises = result.map(async (product) => {
          if (product.categoryID) {
            const categoryResponse = await getCategoryById(product.categoryID);
            if (categoryResponse?.isSuccess) {
              setCategoryNames((prev) => ({
                ...prev,
                [product.categoryID]: categoryResponse.result.categoryName,
              }));
            }
          }
        });
        await Promise.all(categoryPromises);
      } else {
        message.error("Unable to fetch products.");
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
      message.error("Error fetching products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (supplierId) {
      fetchProducts();
    }
  }, [supplierId, pageIndex, pageSize]);

  return {
    products,
    loading,
    pageIndex,
    pageSize,
    total,
    setPageIndex,
    setPageSize,
    categoryNames,
  };
};

export default useFetchProducts;
