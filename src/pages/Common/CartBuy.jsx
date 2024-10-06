import React from 'react';
import { Link } from 'react-router-dom';

const CartBuy = () => {
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
                <div className="text-center text-teal-500 text-2xl font-bold mb-4">
                    $350.00
                </div>

                {/* Summary */}
                <div className="border-t pt-4">
                    {/* <div className="flex justify-between mb-2">
            <span className="text-gray-700">Giá mua</span>
            <span className="text-gray-700">$350.00</span>
          </div> */}
                    {/* <div className="flex justify-between mb-2">
            <span className="text-gray-700">Phí cọc</span>
            <span className="text-gray-700">$48.00</span>
          </div> */}
                    {/* <div className="flex justify-between mb-4">
                        <span className="text-gray-700">Shipping</span>
                        <span className="text-gray-700">$30.00</span>
                    </div> */}
                    <div className="flex justify-between text-lg font-bold mb-4">
                        <span>Tổng</span>
                        <span>$350.00</span>
                    </div>
                    <Link to="/checkout">
                        <button className="bg-teal-500 text-white w-full py-2 rounded mb-4">
                            TIẾN HÀNH THANH TOÁN
                        </button>
                    </Link>
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

export default CartBuy;
