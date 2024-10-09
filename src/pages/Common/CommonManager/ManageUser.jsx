import { message } from "antd";
import { useEffect, useState } from "react";
import { getAllAccount } from "../../../api/accountApi";
import LoadingComponent from "../../../components/LoadingComponent/LoadingComponent";
import AssignRoleForm from "./AssignRoleForm";
import AssignUserModal from "./AssignUserModal ";
const ManageUser = () => {
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(1);
  const itemsPerPage = 10;
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
  const roleStaff = ["member", "supllier", "staff"];
  const roleSupliler = ["member", "supllier"];
  const roleMem = ["member"];

  const roleAdmin = ["member", "admin", "supllier", "staff"];

  const renderRoles = (roleArray) => {
    const roles = roleArray.map((role) => role.normalizedName);
    if (roleStaff.every((role) => roles.includes(role))) return "Nhân viên";
    else if (roleSupliler.every((role) => roles.includes(role)))
      return "Nhà cung cấp dịch vụ";
    else if (roleAdmin.every((role) => roles.includes(role)))
      return "Quản trị hệ thống";
    else return "Thành viên";
  };
  const renderPermissionButtons = (roleArray) => {
    const permissions = [];
    if (renderRoles(roleArray) === "Thành viên") {
      permissions.push(
        <button
          key="nhacungcapdichvu"
          className="bg-yellow-600 text-white my-2 px-4 py-2 w-48 rounded-md"
        >
          <i className="fas fa-user-edit"></i> Nhà cung cấp dịch vụ
        </button>
      );
      permissions.push(
        <button
          key="nhanvien"
          className="bg-green-600 text-white px-4 py-2 w-48 rounded-md"
        >
          <i className="fas fa-user-edit"></i> Nhân viên
        </button>
      );
    }
    console.log(permissions);

    return <div className=" flex flex-col">{permissions}</div>;
  };
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const handleDoubleClick = (user) => {
    setSelectedUser(user);
    setIsFormVisible(true);
  };

  const handleFormClose = () => {
    setIsFormVisible(false);
    setSelectedUser(null);
  };
  const [modalVisible, setModalVisible] = useState(false);
  const [userId, setUserId] = useState("");

  const showModal = (id) => {
    setUserId(id);
    setModalVisible(true);
  };
  const hideModal = () => setModalVisible(false);
  return (
    <div>
      <LoadingComponent isLoading={isLoading} title={"Đang tải dữ liệu"} />
      <h1 className="text-center font-bold text-primary text-xl">
        QUẢN TRỊ NGƯỜI DÙNG TẠI HỆ THỐNG CAMERA SERVICE PLATFORM
      </h1>
      <div className="overflow-x-auto rounded-lg my-10 shadow-md">
        <table className="table">
          <thead className="bg-primary text-white">
            <tr className="h-10 ">
              <th className="text-center">STT</th>
              <th className="text-center">Tên</th>
              <th className="text-center">Email</th>
              <th className="text-center">Số điện thoại</th>
              <th className="text-center">Quyền</th>
              <th className="text-center">Trạng thái </th>
              {/* <th>Hành động</th> */}
            </tr>
          </thead>
          <tbody>
            {accounts &&
              accounts.length > 0 &&
              accounts.map((item, index) => (
                <tr
                  key={index}
                  className="h-10 hover"
                  onDoubleClick={() => handleDoubleClick(item)}
                >
                  <td className="text-center">{index + 1}</td>
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
                  {/* <td>{renderPermissionButtons(item.role)}</td> */}
                  {/* <td>
                    <Button onClick={() => showModal(item.id)}>
                      Assign User to Supplier
                    </Button>
                  </td> */}
                </tr>
              ))}
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
            className="px-4 py-2 mx-1 rounded-lg  bg-primary text-white"
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </button>
        )}
      </div>
      {selectedUser && (
        <AssignRoleForm
          visible={isFormVisible}
          onClose={handleFormClose}
          userId={selectedUser.id}
          fetchData={fetchData}
          currentPage={currentPage}
        />
      )}
      <AssignUserModal
        visible={modalVisible}
        onCancel={hideModal}
        userId={userId}
      />
    </div>
  );
};
export default ManageUser;
