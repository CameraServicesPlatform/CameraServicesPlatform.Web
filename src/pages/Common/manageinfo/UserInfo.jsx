import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

const UserInfo = ({ userMap, jobDescriptions, hobbyDescriptions, setIsUpdateModalOpen }) => (
  <div className="bg-white shadow-md rounded-lg p-6">
    <div className="flex items-center mb-6">
      <h2 className="text-2xl font-bold text-teal-600 flex items-center">
        <i className="fa-solid fa-user mr-2"></i> Thông tin cá nhân
      </h2>
      <button
        className="btn bg-primary text-white flex items-center"
        onClick={() => setIsUpdateModalOpen(true)}
      >
        <FontAwesomeIcon icon={faEdit} className="mr-2" />
      </button>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="flex items-center">
        <i className="fa-solid fa-user mr-2 text-gray-600"></i>
        <span>
          <strong>Tên:</strong> {userMap.name}
        </span>
      </div>
      <div className="flex items-center">
        <i className="fa-solid fa-phone mr-2 text-gray-600"></i>
        <span>
          <strong>Điện thoại:</strong> {userMap.phone}
        </span>
      </div>
      <div className="flex items-center flex-wrap">
        <i className="fa-solid fa-envelope mr-2 text-gray-600"></i>
        <span className="break-words">
          <strong>Email:</strong> {userMap.email}
        </span>
      </div>
      <div className="flex items-center">
        <i className="fa-solid fa-briefcase mr-2 text-gray-600"></i>
        <span>
          <strong>Công việc:</strong> {jobDescriptions[userMap.job]}
        </span>
      </div>
      <div className="flex items-center">
        <i className="fa-solid fa-heart mr-2 text-gray-600"></i>
        <span>
          <strong>Sở thích:</strong> {hobbyDescriptions[userMap.hobby]}
        </span>
      </div>
      <div className="flex items-center">
        <i className="fa-solid fa-venus-mars mr-2 text-gray-600"></i>
        <span>
          <strong>Giới tính:</strong>
          {userMap.gender === 0 ? "Nam" : "Nữ"}
        </span>
      </div>
      <div className="flex items-center">
        <i className="fa-solid fa-university mr-2 text-gray-600"></i>
        <span>
          <strong>Ngân hàng:</strong> {userMap.bankName}
        </span>
      </div>
      <div className="flex items-center">
        <i className="fa-solid fa-credit-card mr-2 text-gray-600"></i>
        <span>
          <strong>Số tài khoản:</strong> {userMap.accountNumber}
        </span>
      </div>
      <div className="flex items-center">
        <i className="fa-solid fa-user-tie mr-2 text-gray-600"></i>
        <span>
          <strong>Chủ tài khoản:</strong> {userMap.accountHolder}
        </span>
      </div>
    </div>
  </div>
);

export default UserInfo;