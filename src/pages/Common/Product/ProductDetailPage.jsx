import { Button, Card, Modal, Spin, Typography, message } from "antd";
import React, { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa"; // Import heart icons
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getCategoryById } from "../../../api/categoryApi";
import { getProductById } from "../../../api/productApi";
import { getSupplierById } from "../../../api/supplierApi";
import { createWishlist } from "../../../api/wishlistApi"; // Import createWishlist function
import { getBrandName, getProductStatusEnum } from "../../../utils/constant";

const { Title, Paragraph } = Typography;

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [supplierName, setSupplierName] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [isWishlisted, setIsWishlisted] = useState(false); // State to track wishlist status

  const user = useSelector((state) => state.user.user || {});
  const accountId = user.id;
  const navigate = useNavigate();

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      try {
        const data = await getProductById(id);
        console.log("Product data:", data);

        if (data) {
          setProduct(data);

          const supplierData = await getSupplierById(data.supplierID, 1, 1);
          const categoryData = await getCategoryById(data.categoryID);
          console.log("Category data:", categoryData);

          if (
            supplierData &&
            supplierData.result &&
            Array.isArray(supplierData.result.items) &&
            supplierData.result.items.length > 0
          ) {
            const supplier = supplierData.result.items[0];
            setSupplierName(supplier.supplierName);
          }

          if (categoryData && categoryData.result) {
            // Adjust this part based on the actual structure of categoryData
            const category = categoryData.result;
            setCategoryName(category.categoryName);
            console.log("Category name:", category.categoryName);
          } else {
            console.log(
              "Category data is not in the expected format or is empty."
            );
          }
        }
      } catch (error) {
        console.error("Failed to load product:", error);
        message.error("Failed to load product. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  const showImageModal = (image) => {
    setSelectedImage(image);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedImage("");
  };

  const handleCreateOrderRent = (product) => {
    navigate("/create-order-rent", {
      state: {
        productID: product.productID,
        supplierID: product.supplierID,
        product,
      },
    });
  };

  const handleCreateOrderBuy = (product) => {
    navigate("/create-order-buy", {
      state: {
        productID: product.productID,
        supplierID: product.supplierID,
        product,
      },
    });
  };

  const handleAddToWishlist = async () => {
    try {
      const data = {
        accountId: accountId,
        productID: product.productID,
        // Add any other necessary data here
      };
      const result = await createWishlist(data);
      if (result) {
        message.success("Product added to wishlist!");
        setIsWishlisted(true);
      } else {
        message.error("Failed to add product to wishlist.");
      }
    } catch (error) {
      console.error("Error adding product to wishlist:", error);
      message.error("Failed to add product to wishlist.");
    }
  };

  if (loading) {
    return <Spin size="large" className="flex justify-center mt-10" />;
  }

  return (
    <div className="container mx-auto p-6">
      {product && (
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 mb-4 md:mb-0 flex justify-center">
            <div className="flex flex-col h-full">
              {product.listImage && product.listImage.length > 0 ? (
                <img
                  src={product.listImage[0].image}
                  alt={product.productName}
                  className="w-full h-auto cursor-pointer rounded-lg shadow-md"
                  onClick={() => showImageModal(product.listImage[0].image)}
                />
              ) : (
                <div className="w-full h-auto cursor-pointer rounded-lg shadow-md bg-gray-200 flex items-center justify-center">
                  <span>No Image Available</span>
                </div>
              )}
            </div>
          </div>

          <div className="md:w-1/2 md:pl-6 flex justify-center">
            <Card className="shadow-lg rounded-lg w-full h-full flex flex-col">
              <div className="flex justify-between items-center">
                <Title level={2} className="text-center text-lg font-bold">
                  {product.productName}
                </Title>
                <button
                  onClick={handleAddToWishlist}
                  className="focus:outline-none"
                >
                  {isWishlisted ? (
                    <FaHeart size={24} className="text-red-500" />
                  ) : (
                    <FaRegHeart size={24} className="text-gray-500" />
                  )}
                </button>
              </div>
              <Paragraph className="text-center">
                {product.productDescription}
              </Paragraph>
              <div className="text-center">
                {product.priceRent != null && (
                  <p className="font-bold">
                    Giá thuê:{" "}
                    <span className="text-green-500">
                      VND/giờ {product.priceRent.toFixed(2)}
                    </span>
                  </p>
                )}
                {product.priceBuy != null && (
                  <p className="font-bold">
                    Giá mua:{" "}
                    <span className="text-green-500">
                      VND {product.priceBuy.toFixed(2)}
                    </span>
                  </p>
                )}
              </div>

              <div className="mt-4">
                <p>
                  <strong>Thương hiệu:</strong> {getBrandName(product.brand)}
                </p>
                <p>
                  <strong>Nhà cung cấp:</strong> {supplierName}
                </p>
                <p>
                  <strong>Danh mục:</strong> {categoryName}
                </p>
                <p className="font-semibold text-left">
                  <strong>Tình trạng:</strong>{" "}
                  <span
                    className={
                      product.status === 0
                        ? "text-green-600"
                        : product.status === 1
                        ? "text-blue-600"
                        : product.status === 3
                        ? "text-gray-600"
                        : "text-orange-600"
                    }
                  >
                    {getProductStatusEnum(product.status) || "Unknown Status"}
                    {/* Fallback for undefined statuses */}
                  </span>
                </p>

                <p>
                  <strong>Chất lượng:</strong> {product.quality}
                </p>
                <p>
                  <strong>Serial Number:</strong> {product.serialNumber}
                </p>
                <p>
                  <strong>Ngày tạo:</strong>{" "}
                  {new Date(product.createdAt).toLocaleString()}
                </p>
                <p>
                  <strong>Ngày cập nhật:</strong>{" "}
                  {new Date(product.updatedAt).toLocaleString()}
                </p>
              </div>
              <div className="flex justify-between mt-4">
                {product.status === 0 && (
                  <Button
                    type="default"
                    onClick={() => handleCreateOrderBuy(product)}
                    className="bg-primary text-white hover:bg-opacity-80 transition duration-200"
                  >
                    Create Order for Buy
                  </Button>
                )}
                {product.status === 1 && (
                  <Button
                    type="primary"
                    onClick={() => handleCreateOrderRent(product)}
                    className="bg-mainColor hover:bg-opacity-80 transition duration-200"
                  >
                    Create Order for Rent
                  </Button>
                )}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Modal hiển thị hình ảnh sản phẩm */}
      <Modal
        title={product?.productName}
        open={isModalVisible} // Changed from `visible` to `open`
        footer={null}
        onCancel={handleCancel}
        width={800}
      >
        {product && (
          <img
            src={selectedImage}
            alt={product.productName}
            className="w-full h-auto"
          />
        )}
      </Modal>
    </div>
  );
};

export default ProductDetailPage;
