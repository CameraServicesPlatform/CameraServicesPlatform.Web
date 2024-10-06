import React from 'react';
import 'tailwindcss/tailwind.css';

const Checkout = () => {
    return (
        <div className="flex justify-center p-10 bg-gray-100">
            <div className="w-2/3 bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Thông tin thanh toán</h2>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Tên</label>
                        <div className="flex space-x-4">
                            <input className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="Họ và tên đệm" type="text" />
                            <input className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="Tên" type="text" />
                        </div>
                    </div>
                    {/* <div>
                        <label className="block text-sm font-medium text-gray-700">Company Name (Optional)</label>
                        <input className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" type="text" />
                    </div> */}
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Địa chỉ</label>
                    <input className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" type="text" />
                </div>
                <div className="grid grid-cols-4 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Tỉnh/Thành phố</label>
                        <select className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                            <option>Chọn...</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Quận</label>
                        <select className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                            <option>Chọn...</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Phường</label>
                        <select className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                            <option>Chọn...</option>
                        </select>
                    </div>
                    {/* <div>
                        <label className="block text-sm font-medium text-gray-700">Zip Code</label>
                        <input className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" type="text" />
                    </div> */}
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" type="email" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                        <input className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" type="text" />
                    </div>
                </div>
                {/* <div className="mb-4">
                    <label className="inline-flex items-center">
                        <input className="form-checkbox" type="checkbox" />
                        <span className="ml-2">Ship to different address</span>
                    </label>
                </div> */}

                <h2 className="text-xl font-semibold mb-4">Phương thức thanh toán</h2>
                <div className="border border-gray-300 rounded-md p-4 mb-4">
                    <div className="flex justify-between mb-4">
                        <label className="flex items-center">
                            <input className="form-radio" name="payment" type="radio" />
                            <span className="ml-2"><i className="fas fa-dollar-sign"></i> Thanh toán khi nhận hàng</span>
                        </label>
                        <label className="flex items-center">
                            <input className="form-radio" name="payment" type="radio" />
                            <span className="ml-2">MOMO</span>
                        </label>
                        <label className="flex items-center">
                            <input className="form-radio" name="payment" type="radio" />
                            <span className="ml-2">VNPAY</span>
                        </label>
                        <label className="flex items-center">
                            <input checked className="form-radio" name="payment" type="radio" />
                            <span className="ml-2"><i className="fas fa-credit-card"></i> Debit/Credit Card</span>
                        </label>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tên chủ thẻ</label>
                            <input className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" type="text" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Số thẻ</label>
                            <input className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" type="text" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Ngày hết hạn</label>
                            <input className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="DD/YY" type="text" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">CVC</label>
                            <input className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" type="text" />
                        </div>
                    </div>
                </div>

                <h2 className="text-xl font-semibold mb-4">Thông tin bổ sung</h2>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Ghi chú (Không bắt buộc)</label>
                    <textarea className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" placeholder="Ghi chú về đơn hàng của bạn, ví dụ: ghi chú đặc biệt về việc giao hàng"></textarea>
                </div>
            </div>

            <div className="w-1/3 ml-8 bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Tóm tắt đơn hàng</h2>
                <div className="flex items-center mb-4">
                    <img alt="Image of Canon EOS R5 camera" className="w-12 h-12 mr-4" src="https://storage.googleapis.com/a1aa/image/McCFHIOLLCaUIpijKe4etKa3R3ffDWktt2f3ZzXGORfUgdB5E.jpg" />
                    <div>
                        <h3 className="text-lg font-semibold text-green-600">CANON EOS R5</h3>
                        <p className="text-sm text-gray-500">Phụ kiện: LENSCAP</p>
                        <p className="text-sm text-gray-500">Số lượng: 2</p>
                        <p className="text-lg font-semibold">$398.00 / 4 giờ</p>
                    </div>
                </div>

                <div className="border-t border-gray-300 pt-4">
                    <div className="flex justify-between mb-2">
                        <span className="text-gray-700">Giá thuê</span>
                        <span className="text-gray-700">$398.00</span>
                    </div>
                    <div className="flex justify-between mb-2">
                        <span className="text-gray-700">Shipping</span>
                        <span className="text-gray-700">TBD</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg">
                        <span>Tổng</span>
                        <span>$428.00</span>
                    </div>

                    <button className="bg-teal-500 text-white w-full py-2 rounded mb-4 mt-4">
                        Thanh toán
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
