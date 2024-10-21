import React, { useEffect, useState } from "react";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { getAllPolicies } from "../../api/policyApi"; // Adjust the import based on your file structure

const Policy = () => {
  const [policies, setPolicies] = useState([]); // Khởi tạo dưới dạng mảng
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const pageIndex = 1; // Điều chỉnh theo nhu cầu
  const pageSize = 10; // Điều chỉnh theo nhu cầu

  // Trạng thái để theo dõi các chính sách nào đang được mở rộng
  const [expandedPolicy, setExpandedPolicy] = useState(null);

  useEffect(() => {
    const fetchPolicies = async () => {
      setLoading(true);
      try {
        const result = await getAllPolicies(pageIndex, pageSize);
        if (result.isSuccess && Array.isArray(result.result)) {
          setPolicies(result.result);
        } else {
          setError("Không thể lấy chính sách.");
        }
      } catch (error) {
        setError("Đã xảy ra lỗi khi lấy chính sách.");
      }
      setLoading(false);
    };

    fetchPolicies();
  }, [pageIndex, pageSize]);

  // Hàm để mở rộng hoặc thu gọn chính sách
  const togglePolicy = (policyID) => {
    setExpandedPolicy(expandedPolicy === policyID ? null : policyID);
  };

  return (
    <div>
      <header className="bg-white shadow p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <span className="bg-yellow-400 text-white px-3 py-1 rounded">
              TRUNG TÂM TRỢ GIÚP
            </span>
            <h1 className="text-2xl font-bold mt-2">
              Chúng tôi có thể giúp gì cho bạn!
            </h1>
          </div>
          <div>
            <img
              src="https://thumb.ac-illust.com/96/96cdd9d61cb741de486486073b0f821a_t.jpeg"
              alt="Đại diện hỗ trợ khách hàng"
              className="rounded-full"
            />
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto mt-10">
        <section className="mt-10">
          <h2 className="text-xl font-bold mb-4">Các Chính Sách Hiện Có</h2>
          {loading ? (
            <p>Đang tải...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : policies.length > 0 ? (
            <ul className="space-y-4">
              {policies.map((policy) => (
                <li
                  key={policy.policyID}
                  className="border border-gray-300 rounded p-4 shadow"
                >
                  <h3 className="font-bold text-lg">{policy.policyContent}</h3>
                  <button
                    className="text-blue-500 mt-2"
                    onClick={() => togglePolicy(policy.policyID)}
                  >
                    {expandedPolicy === policy.policyID
                      ? "Thu gọn"
                      : "Xem chi tiết"}
                  </button>
                  {expandedPolicy === policy.policyID && (
                    <div className="mt-2">
                      <p>
                        <strong>Loại chính sách:</strong> {policy.policyType}
                      </p>
                      <p>
                        <strong>Hiệu lực:</strong>{" "}
                        {new Date(policy.effectiveDate).toLocaleString()}
                      </p>
                      <p>
                        <strong>ID chính sách:</strong> {policy.policyID}
                      </p>
                      {/* Thêm thông tin khác nếu cần */}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>Không có chính sách nào để hiển thị.</p>
          )}
        </section>
      </main>
    </div>
  );
};

export default Policy;
