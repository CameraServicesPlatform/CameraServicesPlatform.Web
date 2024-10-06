import React from 'react';
import { Link } from 'react-router-dom';

const PaymentFailed = () => {
    return (
        <div>
            <div className="bg-red-100 p-4">
                <h1 className="text-2xl font-bold">Đặt hàng thất bại</h1>
            </div>
            <div className="flex flex-col items-center justify-center h-screen">
                <img src="./src/images/payment-fail.png" alt="Package with a checkmark" className="mb-4 w-24 h-24"/>
                <h2 className="text-xl font-bold mb-2">Đã xảy ra lỗi!</h2>
                <p className="text-gray-600 mb-6">Có sự cố khi xử lý đơn hàng của bạn. Vui lòng xem lại thông tin chi tiết và thử lại.</p>
                <Link to="/checkout">
                    <button className="bg-black text-white px-4 py-2 rounded flex items-center">
                        Thanh toán lại <i className="fas fa-arrow-right ml-2"></i>
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default PaymentFailed;
