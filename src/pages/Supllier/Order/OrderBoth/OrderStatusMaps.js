export const orderStatusMap = {
  0: { text: "Chờ xử lý", color: "blue", icon: "fa-hourglass-start" },
  1: { text: "Sản phẩm sẵn sàng được giao", color: "green", icon: "fa-check-circle" },
  2: { text: "Hoàn thành", color: "yellow", icon: "fa-clipboard-check" },
  3: { text: "Đã nhận sản phẩm", color: "purple", icon: "fa-shopping-cart" },
  4: { text: "Đã giao hàng", color: "cyan", icon: "fa-truck" },
  5: { text: "Thanh toán thất bại", color: "cyan", icon: "fa-money-bill-wave" },
  6: { text: "Đang hủy", color: "lime", icon: "fa-box-open" },
  7: { text: "Đã hủy thành công", color: "red", icon: "fa-times-circle" },
  8: { text: "Đã Thanh toán", color: "orange", icon: "fa-money-bill-wave" },
  9: { text: "Hoàn tiền đang chờ xử lý", color: "pink", icon: "fa-clock" },
  10: { text: "Hoàn tiền thành công ", color: "brown", icon: "fa-undo" },
  11: { text: "Hoàn trả tiền đặt cọc", color: "gold", icon: "fa-piggy-bank" },
  12: { text: "Gia hạn", color: "violet", icon: "fa-calendar-plus" },
};

export const orderTypeMap = {
  0: { text: "Mua", color: "blue" },
  1: { text: "Thuê", color: "green" },
};

export const deliveryStatusMap = {
  0: { text: "Đến cửa hàng lấy hàng", color: "blue" },
  1: { text: "Cửa hàng giao hàng", color: "green" },
  2: { text: "Đã trả lại", color: "red" },
};