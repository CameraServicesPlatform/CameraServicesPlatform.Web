import { Spin, message } from "antd";
import React, { useEffect, useState } from "react";
import { getAllProduct, getProductByName } from "../../../api/productApi";
import ProductListTable from "../../Staff/Product/ProductListTable";

const ManageProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalProducts, setTotalProducts] = useState(0);
  const [filter, setFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // State for search term

  useEffect(() => {
    fetchProducts();
  }, [pageIndex, pageSize, filter]);

  useEffect(() => {
    // Clear the search term when the filter changes
    setSearchTerm("");
  }, [filter]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      console.log(
        "Fetching products with pageIndex:",
        pageIndex,
        "and pageSize:",
        pageSize
      ); // Log the values
      const data = filter
        ? await getProductByName(filter, pageIndex, pageSize)
        : await getAllProduct(pageIndex, pageSize);

      if (data) {
        setProducts(data.items || []);
        setTotalProducts(data.total || 0);
      } else {
        message.error("Failed to fetch products");
      }
    } catch (error) {
      message.error("Error fetching products");
    }
    setLoading(false);
  };

  return <div>{loading ? <Spin /> : <ProductListTable />}</div>;
};

export default ManageProduct;
