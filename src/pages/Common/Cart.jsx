import React from 'react';

const Cart = () => {
  return (
    <div className="p-8">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-4">
        <a className="text-gray-500 hover:underline" href="#">
          Trang chủ
        </a>
        /
        <span className="text-black"> Giỏ hàng</span>
      </div>

      {/* Cart Item */}
      <div className="flex justify-between items-center border-b pb-4 mb-4">
        <div className="flex items-center">
          <img
            alt="Canon EOS R5 camera"
            className="w-24 h-24 mr-4"
            src="https://placehold.co/100x100"
          />
          <div>
            <h2 className="text-xl font-bold">Canon EOS R5</h2>
            <div className="flex items-center mt-2">
              <select className="border rounded p-2 mr-2">
                <option>Lenscap: Damage</option>
              </select>
              <i className="fas fa-question-circle text-teal-500"></i>
            </div>
          </div>
        </div>
        <div className="flex items-center">
          <div className="mr-8">
            <h3 className="text-lg font-bold">Sl:</h3>
            <input
              className="border rounded p-2 w-16 text-center"
              type="number"
              value="2"
            />
          </div>
          <div className="mr-8">
            <h3 className="text-lg font-bold">Giá:</h3>
            <p className="text-lg">$350.00</p>
          </div>
          {/* <div>
                        <h3 className="text-lg font-bold">Coverage:</h3>
                        <p className="text-lg">$48.00</p>
                    </div> */}
        </div>
      </div>

      {/* Order Summary */}
      <div className="w-1/3 ml-auto p-4 border rounded-lg shadow-lg">
        <div className="text-right text-teal-500 text-2xl font-bold mb-4">
          $398.00 / <span className="text-lg">4 giờ</span>
        </div>

        {/* Date Selectors */}
        <div className="flex justify-between mb-4">
          <div>
            <label className="block text-gray-700">Ngày bắt đầu</label>
            <input
              className="border rounded p-2 w-full"
              type="date"
              value="2024-08-12"
            />
          </div>
          <div>
            <label className="block text-gray-700">Ngày kết thúc</label>
            <input
              className="border rounded p-2 w-full"
              type="date"
              value="2024-08-19"
            />
          </div>
        </div>

        {/* <div className="mb-4">
                    <h3 className="text-lg font-bold mb-2">Shipping:</h3>
                    <div className="flex items-center mb-2">
                        <input className="mr-2" name="shipping" type="radio" /> Delivery
                    </div>
                    <div className="flex items-center mb-2">
                        <input className="mr-2" name="shipping" type="radio" /> FedEx Office
                    </div>
                    <div className="flex items-center mb-4">
                        <input className="mr-2" name="shipping" type="radio" /> Pickup
                    </div>
                    <input
                        className="border rounded p-2 w-full mb-4"
                        placeholder="Zip Code"
                        type="text"
                    />
                    <select className="border rounded p-2 w-full">
                        <option>Let LR Decide - $30.00</option>
                    </select>
                    <p className="text-gray-500 text-sm mt-2">
                        We may choose either FedEx or UPS based on transit time and reliability.
                    </p>
                </div> */}

        {/* <div className="mb-4">
                    <h3 className="text-lg font-bold mb-2">Lensrentals HD:</h3>
                    <div className="flex items-center mb-2">
                        <i className="fas fa-shipping-fast text-teal-500 mr-2"></i>
                        <p className="text-gray-700">
                            Get free FedEx standard shipping for a year with Lensrentals HD.{' '}
                            <a className="text-teal-500 hover:underline" href="#">
                                Learn More
                            </a>
                        </p>
                    </div>
                    <div className="flex items-center">
                        <input className="mr-2" type="checkbox" /> Enroll in HD for $99 annually
                    </div>
                </div> */}

        {/* Summary */}
        <div className="border-t pt-4">
          <div className="flex justify-between mb-2">
            <span className="text-gray-700">Giá thuê</span>
            <span className="text-gray-700">$350.00</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-700">Phí cọc</span>
            <span className="text-gray-700">$48.00</span>
          </div>
          {/* <div className="flex justify-between mb-4">
                        <span className="text-gray-700">Shipping</span>
                        <span className="text-gray-700">$30.00</span>
                    </div> */}
          <div className="flex justify-between text-lg font-bold mb-4">
            <span>Tổng (đã bao gồm thuế)</span>
            <span>$428.00</span>
          </div>
          <button className="bg-teal-500 text-white w-full py-2 rounded mb-4">
            TIẾN HÀNH THANH TOÁN
          </button>
          <button className="bg-gray-200 text-gray-700 w-full py-2 rounded mb-4">
            Tiếp tục mua sắm
          </button>
          <button className="bg-gray-200 text-gray-700 w-full py-2 rounded">
            Lưu giỏ hàng này
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
