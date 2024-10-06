import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import 'tailwindcss/tailwind.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Account = () => {
    const [activeTab, setActiveTab] = useState('renter');
    return (
        <div className="min-h-screen flex flex-col">
            <header className="flex justify-between items-center p-4 border-b border-gray-200">
                <div className="text-sm text-gray-500">
                    <a href="#" className="text-gray-500">Trang chủ</a> / <span>Tài khoản</span>
                </div>
                <div className="text-sm text-gray-500">
                    Xin chào! <span className="text-red-500">Md Rimel</span>
                </div>
            </header>
            <div className="flex flex-1">
                <aside className="w-1/4 p-4 border-r border-gray-200">
                    <nav className="space-y-4">
                        <div>
                            <h2 className="font-bold text-lg">Quản lý tài khoản</h2>
                            <ul className="mt-2 space-y-2">
                                <li><a href="#" className="text-red-500">Hồ sơ của tôi</a></li>
                                <li><a href="#" className="text-gray-500">Sổ địa chỉ</a></li>
                                <li><a href="#" className="text-gray-500">Phương thức thanh toán</a></li>
                            </ul>
                        </div>
                        <div>
                            <h2 className="font-bold text-lg">Đơn hàng của tôi</h2>
                            <ul className="mt-2 space-y-2">
                                <li><a href="#" className="text-gray-500">Chờ thanh toán</a></li>
                                <li><a href="#" className="text-gray-500">Vận chuyển</a></li>
                                <li><a href="#" className="text-gray-500">Đã hoàn thành</a></li>
                                <li><a href="#" className="text-gray-500">Đã huỷ</a></li>
                            </ul>
                        </div>

                    </nav>
                </aside>
                <main className="flex-1 p-8">
                    <div className="flex mb-4">
                        <button
                            className={`py-2 px-4 font-semibold ${activeTab === 'renter' ? 'border-b-2 border-red-500' : 'text-gray-500'}`}
                            onClick={() => setActiveTab('renter')}
                        >
                            Người thuê
                        </button>
                        <button
                            className={`py-2 px-4 font-semibold ${activeTab === 'supplier' ? 'border-b-2 border-red-500' : 'text-gray-500'}`}
                            onClick={() => setActiveTab('supplier')}
                        >
                            Người cung cấp
                        </button>
                    </div>

                    {activeTab === 'renter' && (
                        <div className="border border-gray-200 rounded-lg p-8">
                            <h1 className="text-2xl font-bold mb-6">Hồ sơ</h1>
                            <form className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Tên</label>
                                    <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <input type="email" className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                                    <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Khu vực</label>
                                    <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                                </div>
                                <div className="flex justify-end">
                                    <button type="submit" className="bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-full">Lưu thay đổi</button>
                                </div>
                            </form>
                        </div>
                    )}

                    {activeTab === 'supplier' && (
                        <div className="border border-gray-200 rounded-lg p-8">
                            <h1 className="text-2xl font-bold mb-6">Đăng ký thông tin cho thuê</h1>
                            <form className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Company Name</label>
                                    <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Contact Person</label>
                                    <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <input type="email" className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                                    <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Address</label>
                                    <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                                </div>
                                <div className="flex justify-end">
                                    <button type="submit" className="bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-full">Lưu thông tin</button>
                                </div>
                            </form>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Account;
