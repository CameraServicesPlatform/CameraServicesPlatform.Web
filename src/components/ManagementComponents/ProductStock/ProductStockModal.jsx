import {
  clothTypeLabels,
  clothingSizeLabels,
  genderLabels,
  shoeSizeLabels,
} from "../../../utils/constant";

export const ProductStockModal = ({ items, onClose }) => {
  console.log(items);
  return (
    <>
      <div className="modal modal-open">
        <div className="modal-box relative max-w-6xl">
          <div>
            <h3 className="text-primary text-2xl font-bold text-center uppercase">
              KHO HÀNG
            </h3>
            <div className="card bg-base-100 shadow-xl mb-4">
              <div className="card-body">
                <h2 className="card-title">Thông tin sản phẩm</h2>
                <div className="flex flex-col">
                  <div className="flex items-center mb-2">
                    <span className="font-semibold mr-2">Tên sản phẩm:</span>
                    <span>{items.product.name}</span>
                  </div>
                  <div className="flex items-center mb-2">
                    <span className="font-semibold mr-2">Mô tả:</span>
                    <span>{items.product.description}</span>
                  </div>
                  <div className="flex items-center mb-2">
                    <span className="font-semibold mr-2">Loại:</span>
                    <span>{clothTypeLabels[items.product.clothType]}</span>
                  </div>
                  <div className="flex items-center mb-2">
                    <span className="font-semibold mr-2">Giới tính:</span>
                    <span>{genderLabels[items.product.gender]}</span>
                  </div>
                  <div className="flex items-center mb-2">
                    <span className="font-semibold mr-2">Tên cửa hàng:</span>
                    <span>{items.product?.shop?.name}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold mr-2">
                      Địa chỉ cửa hàng:
                    </span>
                    <span>{items.product?.shop?.address}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Size</th>
                    <th>Số lượng trong kho</th>
                    <th>Giá</th>
                    <th>Tên kho</th>
                    <th>Địa chỉ kho</th>
                  </tr>
                </thead>
                <tbody>
                  {items.productStock.map((stock, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>
                        {stock.shoeSize
                          ? shoeSizeLabels[stock.shoeSize]
                          : clothingSizeLabels[stock.clothingSize]}
                      </td>
                      <td>{stock.quantity}</td>
                      <td>{stock.price}</td>
                      <td>{stock.warehouse?.name}</td>
                      <td>{stock.warehouse?.address}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="modal-action">
            <button
              className="bg-primary bor px-4 py-2 rounded-md text-white cursor-pointer"
              onClick={onClose}
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
