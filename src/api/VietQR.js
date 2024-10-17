import { VietQR } from "vietqr";

// Khởi tạo đối tượng VietQR với clientID và apiKey của bạn
let vietQR = new VietQR({
  clientID: "c317e88b-22b0-40af-bfea-f5db5864199b",
  apiKey: "1a65ce89-b1b6-4427-a4ab-192417d9c85a",
});

// Gọi API để lấy danh sách các ngân hàng
vietQR
  .getBanks()
  .then((banks) => {
    console.log(banks); // In ra danh sách các ngân hàng hỗ trợ tạo QR code
  })
  .catch((err) => {
    console.error("Error fetching bank list:", err);
  });
