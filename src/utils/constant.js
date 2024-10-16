const genderLabels = {
  0: "Nam",
  1: "Nữ",
  2: "N/A",
};

const orderLabels = {
  0: "Chờ xác nhận",
  1: "Đang chuẩn bị",
  2: "Đang giao hàng",
  3: "Thanh toán thành công",
  4: "Thất bại",
  5: "Trả hàng",
  6: "Đã giao hàng",
};
const getBrandName = (brandEnumValue) => {
  return brandNames[brandEnumValue] || "Others";
};
const brandNames = {
  1: "Canon",
  2: "Nikon",
  3: "Sony",
  4: "Fujifilm",
  5: "Olympus",
  6: "Panasonic",
  7: "Leica",
  8: "Pentax",
  9: "Hasselblad",
  10: "Sigma",
  11: "Others",
};

const getProductStatusEnum = (productStatusEnumValue) => {
  return productStatusEnum[productStatusEnumValue] || "other";
};
const productStatusEnum = {
  0: "Both", // Use string directly
  1: "Rented",
  2: "Sold",
  3: "Shipping",
  4: "Discontinued Product",
};

export {
  brandNames,
  genderLabels,
  getBrandName,
  getProductStatusEnum,
  orderLabels,
};
