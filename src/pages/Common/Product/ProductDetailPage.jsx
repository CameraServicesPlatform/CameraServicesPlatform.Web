import { Button, Card, Modal, Spin, Typography, message } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCategoryById } from "../../../api/categoryApi";
import { getProductById } from "../../../api/productApi";
import { getSupplierById } from "../../../api/supplierApi";
import { getBrandName } from "../../../utils/constant";

const { Title, Paragraph } = Typography;

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [supplierName, setSupplierName] = useState("");
  const [categoryName, setCategoryName] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      try {
        const data = await getProductById(id);
        //console.log("Product data:", data);

        if (data) {
          setProduct(data);

          const supplierData = await getSupplierById(data.supplierID, 1, 1);
          const categoryData = await getCategoryById(data.categoryID);

          if (
            supplierData &&
            supplierData.result &&
            supplierData.result.items.length > 0
          ) {
            const supplier = supplierData.result.items[0];
            setSupplierName(supplier.supplierName);
            //  console.log("Tên nhà cung cấp:", supplier.supplierName);
          }

          if (
            categoryData &&
            categoryData.result &&
            categoryData.result.items.length > 0
          ) {
            const category = categoryData.result.items[0];
            setCategoryName(category.categoryName);
            // console.log("Tên danh mục:", category.categoryName);
          }
        }
      } catch (error) {
        message.error("Có lỗi xảy ra khi tải sản phẩm.");
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

  if (loading) {
    return <Spin size="large" className="flex justify-center mt-10" />;
  }
  const handleCreateOrderRent = (product) => {
    message.success(`Order for renting ${product.productName} created!`);
  };

  const handleCreateOrderBuy = (product) => {
    navigate("/create-order-buy", { state: { product } });
  };
  return (
    <div className="container mx-auto p-6">
      {product && (
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 mb-4 md:mb-0 flex justify-center">
            <div className="flex flex-col h-full">
              <img
                src={
                  product.listImage.length > 0 ? product.listImage[0].image : ""
                }
                alt={product.productName}
                className="w-full h-auto cursor-pointer rounded-lg shadow-md"
                onClick={() => showImageModal(product.listImage[0].image)}
              />
            </div>
          </div>

          <div className="md:w-1/2 md:pl-6 flex justify-center">
            <Card className="shadow-lg rounded-lg w-full h-full flex flex-col">
              <Title level={2} className="text-center text-lg font-bold">
                {product.productName}
              </Title>
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
                <p>
                  <strong>Tình trạng:</strong>{" "}
                  {product.status === 1 ? (
                    <span className="text-green-600">Còn hàng</span>
                  ) : (
                    <span className="text-red-600">Hết hàng</span>
                  )}
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
                {product.priceRent != null && (
                  <Button
                    type="primary"
                    onClick={() => handleCreateOrderRent(product)}
                    className="bg-mainColor hover:bg-opacity-80 transition duration-200"
                  >
                    Create Order for Rent
                  </Button>
                )}
                {product.priceBuy != null && (
                  <Button
                    type="default"
                    onClick={() => handleCreateOrderBuy(product)}
                    className="bg-primary text-white hover:bg-opacity-80 transition duration-200"
                  >
                    Create Order for Buy
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
        visible={isModalVisible}
        footer={null}
        onCancel={handleCancel}
        width={800}
      >
        <img
          src={selectedImage}
          alt={product.productName}
          className="w-full h-auto"
        />
      </Modal>
    </div>
  );
};

export default ProductDetailPage;
