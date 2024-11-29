import React from 'react';
import OrderItem from './OrderItem';

const OrderList = ({ orders, supplierMap, orderStatusMap, deliveryStatusMap, orderTypeMap, handleClick, handlePaymentAgain, updateOrderStatusPlaced, openUploadPopup }) => (
  <div className="lg:col-span-3 bg-white shadow-lg rounded-lg p-6">
    <h2 className="text-2xl font-bold text-teal-600 mb-6 text-center">
      Đơn hàng của bạn
    </h2>
    {orders.length === 0 ? (
      <p className="text-center text-gray-500">No orders found.</p>
    ) : (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 border-b">Mã đơn hàng</th>
              <th className="py-3 px-4 border-b">Mã nhà cung cấp</th>
              <th className="py-3 px-4 border-b">Trạng thái</th>
              <th className="py-3 px-4 border-b hidden md:table-cell">
                Địa chỉ giao hàng
              </th>
              <th className="py-3 px-4 border-b hidden lg:table-cell">
                Phương thức giao hàng
              </th>
              <th className="py-3 px-4 border-b">Loại</th>
              <th className="py-3 px-4 border-b hidden sm:table-cell">
                Ngày đặt hàng
              </th>
              <th className="py-3 px-4 border-b">Tổng số tiền</th>
              <th className="py-3 px-6 border-b"> </th>
              <th className="py-3 px-6 border-b"> </th>
              <th className="py-3 px-6 border-b"> </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <OrderItem
                key={order.orderID}
                order={order}
                supplierMap={supplierMap}
                orderStatusMap={orderStatusMap}
                deliveryStatusMap={deliveryStatusMap}
                orderTypeMap={orderTypeMap}
                handleClick={handleClick}
                handlePaymentAgain={handlePaymentAgain}
                updateOrderStatusPlaced={updateOrderStatusPlaced}
                openUploadPopup={openUploadPopup}
              />
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);

export default OrderList;