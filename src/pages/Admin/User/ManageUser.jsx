import { message } from "antd";
import { useEffect, useState } from "react";
import { getAllAccount } from "../../../api/accountApi";
import LoadingComponent from "../../../components/LoadingComponent/LoadingComponent";
import { genderLabels } from "../../../utils/constant";
import GetInformationAccount from "./GetInformationAccount";

const ManageUser = () => {
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(1);
  const itemsPerPage = 10;
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = async (page) => {
    try {
      setIsLoading(true);
      const data = await getAllAccount(page, itemsPerPage);
      if (data.isSuccess) {
        setAccounts(data.result?.items);
        setTotalItems(data.result.totalPages);
      }
    } catch (error) {
      message.error("Đã xảy ra lỗi, vui lòng thử lại sau");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderPageNumbers = () => {
    let pages = [];
    for (let i = 1; i <= totalItems; i++) {
      pages.push(
        <button
          key={i}
          className={`px-4 py-2 mx-1 rounded-lg ${
            currentPage === i ? "bg-primary text-white" : ""
          }`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState(null);

  const handleDoubleClick = (user) => {
    setSelectedAccountId(user.id);
    setModalVisible(true);
  };

  // Function to handle search input change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  // Filter accounts based on search term
  const filteredAccounts = accounts.filter((item) => {
    const fullName = `${item.firstName} ${item.lastName}`.toLowerCase();
    return (
      fullName.includes(searchTerm) ||
      item.email.toLowerCase().includes(searchTerm) ||
      item.phoneNumber.toLowerCase().includes(searchTerm) ||
      item.mainRole.toLowerCase().includes(searchTerm) ||
      (genderLabels[item.gender] || "Không xác định")
        .toLowerCase()
        .includes(searchTerm)
    );
  });

  return (
    <div>
      <LoadingComponent isLoading={isLoading} title={"Đang tải dữ liệu"} />
      <h1 className="text-center font-bold text-primary text-xl">
        QUẢN TRỊ NGƯỜI DÙNG TẠI HỆ THỐNG CAMERA SERVICE PLATFORM
      </h1>

      {/* Search Box */}
      <div className="flex justify-center my-4">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên, email, số điện thoại, quyền, giới tính..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="border rounded-lg p-2 w-1/2"
        />
      </div>

      <div className="overflow-x-auto rounded-lg my-10 shadow-md">
        <table className="table">
          <thead className="bg-primary text-white">
            <tr className="h-10 ">
              <th className="text-center">STT</th>
              <th className="text-center">ID</th>
              <th className="text-center">Tên</th>
              <th className="text-center">Email</th>
              <th className="text-center">Số điện thoại</th>
              <th className="text-center">Quyền</th>
              <th className="text-center">Trạng thái</th>
              <th className="text-center">Giới tính</th>
              <th className="text-center">Tên đăng nhập</th>
              <th className="text-center">Địa chỉ</th>
              <th className="text-center">Ngày tạo</th>
              <th className="text-center">Ngày cập nhật</th>
            </tr>
          </thead>
          <tbody>
            {filteredAccounts.length > 0 ? (
              filteredAccounts.map((item, index) => (
                <tr
                  key={item.id}
                  className="h-10 hover"
                  onDoubleClick={() => handleDoubleClick(item)}
                >
                  <td className="text-center">{index + 1}</td>
                  <td className="text-center">{item.id}</td>
                  <td className="text-center">{`${item.firstName} ${item.lastName}`}</td>
                  <td className="text-center lowercase text-wrap">
                    {item.email}
                  </td>
                  <td className="text-center">{item.phoneNumber}</td>
                  <td className="text-center">{item.mainRole}</td>
                  <td className="text-center">
                    {item.isVerified ? (
                      <i className="fa-solid fa-circle-check text-green-600"></i>
                    ) : (
                      <i className="fa-solid fa-circle-xmark text-red-600"></i>
                    )}
                  </td>
                  <td className="text-center">
                    {genderLabels[item.gender] || "Không xác định"}
                  </td>
                  <td className="text-center">{item.userName}</td>
                  <td className="text-center">{item.address}</td>
                  <td className="text-center">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                  <td className="text-center">
                    {new Date(item.updatedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="12" className="text-center">
                  Không tìm thấy người dùng nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center mt-4">
        {currentPage > 1 && (
          <button
            className="px-4 py-2 mx-1 rounded-lg bg-primary text-white"
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Previous
          </button>
        )}
        {currentPage > 2 && <span className="px-4 py-2 mx-1">..</span>}
        {renderPageNumbers()}
        {currentPage < totalItems - 1 && (
          <span className="px-4 py-2 mx-1">..</span>
        )}
        {currentPage < totalItems && (
          <button
            className="px-4 py-2 mx-1 rounded-lg bg-primary text-white"
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </button>
        )}
      </div>

      <GetInformationAccount
        accountId={selectedAccountId}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
      />
    </div>
  );
};

export default ManageUser;
