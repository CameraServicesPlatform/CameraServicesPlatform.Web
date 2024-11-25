import { useState, useEffect } from "react";
import { getCategoryById } from "../../../api/categoryApi";
import { getAllProduct } from "../../../api/productApi";
import { message } from "antd";

const useFetchProducts = (pageIndex, pageSize) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [categoryNames, setCategoryNames] = useState({});

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const result = await getAllProduct(pageIndex, pageSize);
      if (Array.isArray(result)) {
        setProducts(result);
        setTotal(result.totalCount || 0);

        // Fetch category names for each product
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
        await Promise.all(categoryPromises); // Wait for all category fetches to complete
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
    fetchProducts();
  }, [pageIndex, pageSize]);

  return { products, loading, total, categoryNames };
};

export default useFetchProducts;
