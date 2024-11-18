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
  0: "Canon",
  1: "Nikon",
  2: "Sony",
  3: "Fujifilm",
  4: "Olympus",
  5: "Panasonic",
  6: "Leica",
  7: "Pentax",
  8: "Hasselblad",
  9: "Sigma",
  10: "Others",
};

const ApplicableObject = {
  System: 0,
  Supplier: 1,
  Member: 2,
};

const getPolicyType = (type) => {
  switch (type) {
    case PolicyType.System:
      return "HỆ THỐNG";
    case PolicyType.Supplier:
      return "NHÀ CUNG CẤP";
    case PolicyType.Member:
      return "THÀNH VIÊN";
    default:
      return "Unknown";
  }
};

const getProductStatusEnum = (productStatusEnumValue) => {
  return productStatusEnum[productStatusEnumValue] || "other";
};

const productStatusEnum = {
  0: "Bán", // Use string directly
  1: "Cho thuê",
  2: "Đã cho thuê",
  3: "Đã bán",
  4: "Sản phẩm ngừng cung cấp",
};

export {
  ApplicableObject,
  brandNames,
  genderLabels,
  getBrandName,
  getPolicyType,
  getProductStatusEnum,
  orderLabels,
};
