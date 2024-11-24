import { SearchOutlined, UpOutlined } from "@ant-design/icons";
import { Button, Input, message, Pagination, Select } from "antd";
import { useEffect, useState } from "react";
import { getAllAccount } from "../../../api/accountApi";
import LoadingComponent from "../../../components/LoadingComponent/LoadingComponent";
import { genderLabels } from "../../../utils/constant";
import GetInformationAccount from "./GetInformationAccount";

const { Option } = Select;

const ManageUserList = () => {
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(1);
  const itemsPerPage = 10;
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    gender: "",
    status: "",
  });

  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchData = async (page) => {
    try {
      setIsLoading(true);
      const data = await getAllAccount(page, itemsPerPage);
      if (data.isSuccess) {
        setAccounts(data.result?.items || []);
        setTotalItems(data.result.totalPages || 1);
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

  // Filter accounts based on search criteria
  const filteredAccounts = accounts.filter((item) => {
    const fullName = `${item.firstName} ${item.lastName}`.toLowerCase();
    const status = item.isVerified ? "true" : "false";

    return (
      fullName.includes(searchTerm.name.toLowerCase()) &&
      item.email.toLowerCase().includes(searchTerm.email.toLowerCase()) &&
      item.phoneNumber.toLowerCase().includes(searchTerm.phone.toLowerCase()) &&
      item.mainRole.toLowerCase().includes(searchTerm.role.toLowerCase()) &&
      (genderLabels[item.gender] || "Không xác định")
        .toLowerCase()
        .includes(searchTerm.gender.toLowerCase()) &&
      status.includes(searchTerm.status.toLowerCase())
    );
  });

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleResetSearch = () => {
    setSearchTerm({
      name: "",
      email: "",
      phone: "",
      role: "",
      gender: "",
      status: "",
    });
    fetchData(1);
  };

  const handleDoubleClick = (user) => {
    setSelectedAccountId(user.id);
    setModalVisible(true);
  };

  return (
    <div className="p-6">
      <LoadingComponent isLoading={isLoading} title={"Đang tải dữ liệu"} />
      <h2 className="text-center font-bold text-primary text-2xl mb-6">
        Danh Sách Người Dùng
      </h2>

      <Button
        onClick={() => setIsSearchVisible(!isSearchVisible)}
        type="primary"
        icon={isSearchVisible ? <UpOutlined /> : <SearchOutlined />}
      >
        {isSearchVisible ? "Ẩn Tìm Kiếm" : "Hiển Thị Tìm Kiếm"}
      </Button>

      {/* Phần tìm kiếm */}
      {isSearchVisible && (
        <div className="grid grid-cols-6 gap-4 mb-4">
          <div>
            <label>Tên:</label>
            <Input
              placeholder="Tìm theo tên..."
              value={searchTerm.name}
              onChange={(e) =>
                setSearchTerm({ ...searchTerm, name: e.target.value })
              }
              className="border rounded-lg p-2 shadow-md"
            />
          </div>
          <div>
            <label>Email:</label>
            <Input
              placeholder="Tìm theo email..."
              value={searchTerm.email}
              onChange={(e) =>
                setSearchTerm({ ...searchTerm, email: e.target.value })
              }
              className="border rounded-lg p-2 shadow-md"
            />
          </div>
          <div>
            <label>Số điện thoại:</label>
            <Input
              placeholder="Tìm theo số điện thoại..."
              value={searchTerm.phone}
              onChange={(e) =>
                setSearchTerm({ ...searchTerm, phone: e.target.value })
              }
              className="border rounded-lg p-2 shadow-md"
            />
          </div>
          <div>
            <label>Quyền:</label>
            <Input
              placeholder="Tìm theo quyền..."
              value={searchTerm.role}
              onChange={(e) =>
                setSearchTerm({ ...searchTerm, role: e.target.value })
              }
              className="border rounded-lg p-2 shadow-md"
            />
          </div>
          <div>
            <label>Giới tính:</label>
            <Select
              placeholder="Chọn giới tính"
              value={searchTerm.gender}
              onChange={(value) =>
                setSearchTerm({ ...searchTerm, gender: value })
              }
              className="w-full"
            >
              <Option value="">Tất cả</Option>
              <Option value="Nam">Nam</Option>
              <Option value="Nữ">Nữ</Option>
            </Select>
          </div>
          <div>
            <label>Trạng thái:</label>
            <Select
              placeholder="Chọn trạng thái"
              value={searchTerm.status}
              onChange={(value) =>
                setSearchTerm({ ...searchTerm, status: value })
              }
              className="w-full"
            >
              <Option value="">Tất cả</Option>
              <Option value="true">Đã xác thực</Option>
              <Option value="false">Chưa xác thực</Option>
            </Select>
          </div>
        </div>
      )}

      <Button onClick={handleResetSearch} type="primary" danger>
        Xóa Tìm Kiếm
      </Button>

      <div className="overflow-x-auto rounded-lg my-10 shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-primary text-white">
            <tr className="h-10">
              <th className="text-center">STT</th>
              <th className="text-center">ID</th>
              <th className="text-center">Tên</th>
              <th className="text-center">Email</th>
              <th className="text-center">Số điện thoại</th>
              <th className="text-center">Quyền</th>
              <th className="text-center">Trạng thái</th>
              <th className="text-center">Giới tính</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAccounts.length > 0 ? (
              filteredAccounts.map((item, index) => (
                <tr
                  key={item.id}
                  className="h-10 hover:bg-gray-100"
                  onDoubleClick={() => handleDoubleClick(item)}
                >
                  <td className="text-center">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
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
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11" className="text-center py-4">
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center">
        <Pagination
          current={currentPage}
          pageSize={itemsPerPage}
          total={totalItems * itemsPerPage}
          onChange={handlePageChange}
        />
      </div>
      <GetInformationAccount
        accountId={selectedAccountId}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
      />
    </div>
  );
};

export default ManageUserList;
