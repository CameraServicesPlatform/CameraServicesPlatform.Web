import React, { useEffect, useState } from "react";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import {
  getAllPolicies,
  getPoliciesByApplicableObject,
} from "../../api/policyApi"; // Adjust the import based on your file structure

const Policy = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageIndex, setPageIndex] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;
  const [policyType, setPolicyType] = useState(null); // New state for policy type

  const [expandedPolicy, setExpandedPolicy] = useState(null);

  useEffect(() => {
    const fetchPolicies = async () => {
      setLoading(true);
      try {
        const result =
          policyType !== null
            ? await getPoliciesByApplicableObject(
                policyType,
                pageIndex,
                pageSize
              )
            : await getAllPolicies(pageIndex, pageSize);
        console.log("API Result:", result); // Log the API result
        if (result && result.isSuccess) {
          if (Array.isArray(result.result)) {
            // Handle case where result is an array
            setPolicies(result.result);
            setTotalPages(Math.ceil(result.result.length / pageSize));
          } else if (result.result.items) {
            // Handle case where result is an object with items and totalPages
            setPolicies(result.result.items);
            setTotalPages(
              result.result.totalPages > 0 ? result.result.totalPages : 1
            );
          } else {
            setError("Không thể lấy chính sách.");
          }
        } else {
          setError("Không thể lấy chính sách.");
        }
      } catch (error) {
        console.error("Error fetching policies:", error);
        setError("Đã xảy ra lỗi khi lấy chính sách.");
      }
      setLoading(false);
    };

    fetchPolicies();
  }, [pageIndex, pageSize, policyType]);

  const togglePolicy = (policyID) => {
    setExpandedPolicy(expandedPolicy === policyID ? null : policyID);
  };

  const handlePrevious = () => {
    if (pageIndex > 1) setPageIndex(pageIndex - 1);
  };

  const handleNext = () => {
    if (pageIndex < totalPages) setPageIndex(pageIndex + 1);
  };

  const handlePolicyTypeChange = (type) => {
    if (policyType === type) {
      setPolicyType(null); // Reset to show all policies if the same button is double-clicked
    } else {
      setPolicyType(type);
    }
    setPageIndex(1); // Reset to first page when policy type changes
  };

  return (
    <div>
      <header className="bg-gray-800 shadow p-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div>
            <span className="bg-indigo-500 text-white px-3 py-1 rounded">
              TRUNG TÂM TRỢ GIÚP
            </span>
            <h1 className="text-3xl font-bold mt-2 text-white">
              Chúng tôi có thể giúp gì cho bạn!
            </h1>
          </div>
          <div className="mt-4 md:mt-0">
            <img
              src="https://thumb.ac-illust.com/96/96cdd9d61cb741de486486073b0f821a_t.jpeg"
              alt="Đại diện hỗ trợ khách hàng"
              className="rounded-full w-24 h-24 object-cover border-2 border-white"
            />
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto mt-10 px-4">
        <section className="mt-10">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Các Chính Sách Hiện Có
          </h2>
          <div className="mb-6">
            <button
              onClick={() => handlePolicyTypeChange(0)}
              className={`px-4 py-2 rounded mr-2 ${
                policyType === 0 ? "bg-indigo-600 text-white" : "bg-gray-300"
              }`}
            >
              System
            </button>
            <button
              onClick={() => handlePolicyTypeChange(1)}
              className={`px-4 py-2 rounded mr-2 ${
                policyType === 1 ? "bg-indigo-600 text-white" : "bg-gray-300"
              }`}
            >
              Supplier
            </button>
            <button
              onClick={() => handlePolicyTypeChange(2)}
              className={`px-4 py-2 rounded ${
                policyType === 2 ? "bg-indigo-600 text-white" : "bg-gray-300"
              }`}
            >
              Member
            </button>
          </div>
          {loading ? (
            <div className="flex justify-center items-center">
              <svg
                className="animate-spin h-8 w-8 text-indigo-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-label="Loading"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                ></path>
              </svg>
              <span className="ml-2 text-indigo-500">Đang tải...</span>
            </div>
          ) : error ? (
            <p className="text-red-500 text-center" role="alert">
              {error}
            </p>
          ) : policies.length > 0 ? (
            <>
              <ul className="space-y-6">
                {policies.map((policy) => (
                  <li
                    key={policy.policyID}
                    className="border border-gray-300 rounded-lg p-6 shadow hover:shadow-xl transition-shadow duration-300"
                  >
                    <h3 className="font-bold text-xl text-gray-700">
                      {policy.policyContent}
                    </h3>
                    <button
                      className="text-indigo-500 mt-4 hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded"
                      onClick={() => togglePolicy(policy.policyID)}
                      aria-expanded={expandedPolicy === policy.policyID}
                      aria-controls={`policy-details-${policy.policyID}`}
                    >
                      {expandedPolicy === policy.policyID
                        ? "Thu gọn"
                        : "Xem chi tiết"}
                    </button>
                    {expandedPolicy === policy.policyID && (
                      <div
                        id={`policy-details-${policy.policyID}`}
                        className="mt-4 bg-gray-50 p-4 rounded transition-all duration-300"
                      >
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
              <div className="flex justify-center mt-8 space-x-4">
                <button
                  onClick={handlePrevious}
                  disabled={pageIndex === 1}
                  className={`px-4 py-2 rounded ${
                    pageIndex === 1
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  }`}
                  aria-disabled={pageIndex === 1}
                >
                  Trước
                </button>
                <span className="flex items-center text-gray-700">
                  Trang {pageIndex} / {totalPages}
                </span>
                <button
                  onClick={handleNext}
                  disabled={pageIndex === totalPages}
                  className={`px-4 py-2 rounded ${
                    pageIndex === totalPages
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  }`}
                  aria-disabled={pageIndex === totalPages}
                >
                  Tiếp theo
                </button>
              </div>
            </>
          ) : (
            <p className="text-center text-gray-600">
              Không có chính sách nào để hiển thị.
            </p>
          )}
        </section>
      </main>
    </div>
  );
};

export default Policy;
