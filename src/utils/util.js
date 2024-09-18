import moment from "moment-timezone";
function formatPrice(gia) {
  /**
   * Định dạng giá tiền Việt Nam từ số nguyên thành chuỗi có dấu phân cách và ký tự đồng.
   *
   * @param {number} gia - Giá tiền cần định dạng.
   * @returns {string} - Chuỗi đã định dạng giá tiền.
   */
  if (gia !== null && gia !== undefined) {
    return gia.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
  } else {
    return "0";
  }
}

function formatDateTime(ngayGio) {
  /**
   * Định dạng thời gian thành chuỗi dd/mm/yyyy hh/mm/ss.
   *
   * @param {Date} ngayGio - Thời gian cần định dạng.
   * @returns {string} - Chuỗi đã định dạng thời gian.
   */
  var date = new Date(ngayGio);
  var ngay = date.getDate();
  var thang = date.getMonth() + 1; // Tháng trong JavaScript bắt đầu từ 0
  var nam = date.getFullYear();
  var gio = date.getHours();
  var phut = date.getMinutes();
  var giay = date.getSeconds();

  // Thêm số 0 vào trước nếu số chỉ có 1 chữ số
  if (ngay < 10) ngay = "0" + ngay;
  if (thang < 10) thang = "0" + thang;
  if (gio < 10) gio = "0" + gio;
  if (phut < 10) phut = "0" + phut;
  if (giay < 10) giay = "0" + giay;

  return ngay + "/" + thang + "/" + nam + " " + gio + ":" + phut + ":" + giay;
}

function formatDate(ngayGio) {
  /**
   * Định dạng thời gian thành chuỗi dd/mm/yyyy hh/mm/ss.
   *
   * @param {Date} ngayGio - Thời gian cần định dạng.
   * @returns {string} - Chuỗi đã định dạng thời gian.
   */
  var date = new Date(ngayGio);
  var ngay = date.getDate();
  var thang = date.getMonth() + 1; // Tháng trong JavaScript bắt đầu từ 0
  var nam = date.getFullYear();
  var gio = date.getHours();
  var phut = date.getMinutes();
  var giay = date.getSeconds();

  return ngay + "/" + thang + "/" + nam;
}
function differenceInDays(ngayGio1, ngayGio2) {
  var date1 = new Date(ngayGio1);
  var date2 = new Date(ngayGio2);

  // Lấy số mili giây của mỗi ngày
  var oneDay = 24 * 60 * 60 * 1000;

  // Chuyển đổi thời điểm thành số mili giây
  var time1 = date1.getTime();
  var time2 = date2.getTime();

  // Tính hiệu số ngày giữa hai thời điểm và làm tròn kết quả
  var difference = Math.round(Math.abs((time1 - time2) / oneDay));

  return difference;
}
function isEmptyObject(v) {
  return !!v && v.constructor === Object && Object.keys(v).length === 0;
}
function calculateCountdown(eventDate) {
  const now = new Date();
  const eventDateObj = new Date(eventDate);
  const diff = eventDateObj - now;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / 1000 / 60) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return `${days} ngày ${hours} giờ ${minutes} phút ${seconds} giây`;
}
function formatDateToISOString(date) {
  return moment(date).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
}
export {
  formatPrice,
  formatDateTime,
  formatDate,
  differenceInDays,
  isEmptyObject,
  calculateCountdown,
  formatDateToISOString,
};
