import React from 'react';
import { Link } from 'react-router-dom';

const PaymentSuccess = () => {
    return (
        <div>
            <div className="bg-green-100 p-4">
                <h1 className="text-2xl font-bold">Đặt hàng thành công</h1>
            </div>
            <div className="flex flex-col items-center justify-center h-screen">
                <img src="./src/images/successful.png" alt="Package with a checkmark" className="mb-4 w-24 h-24"/>
                <h2 className="text-xl font-bold mb-2">Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi</h2>
                <p className="text-gray-600 mb-6">Đơn hàng của bạn đã được đặt thành công và hiện đang được xử lý.</p>
                <Link to="/account">
                    <button className="bg-black text-white px-4 py-2 rounded flex items-center">
                        Xem đơn đặt hàng <i className="fas fa-arrow-right ml-2"></i>
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default PaymentSuccess;
