import React, { useState, useMemo, useEffect } from "react";
import { Search, Eye, Edit, Filter } from "lucide-react";
import crmService from "../../services/crmService";

// Options constants
const statusOptions = [
  { value: "dang_hoc", label: "Đang Học" },
  { value: "nghi_hoc", label: "Nghỉ Học" },
  { value: "hoan_thanh", label: "Hoàn Thành" },
];

const courseOptions = [
  { value: "1", label: "Tiếng Anh Cơ Bản" },
  { value: "2", label: "Tiếng Anh Nâng Cao" },
  { value: "3", label: "IELTS Preparation" },
  { value: "4", label: "TOEIC Intensive" },
];

export default function StudentList({ onEdit, onViewProfile }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [sortBy, setSortBy] = useState("ten");
  const [sortOrder, setSortOrder] = useState("asc");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load students from API
  useEffect(() => {
    const loadStudents = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await crmService.getStudents();
        setStudents(response.results || response || []);
      } catch (err) {
        console.error("Error loading students:", err);
        setError("Không thể tải danh sách học viên. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    loadStudents();
  }, []);

  // Filter and search students
  const filteredStudents = useMemo(() => {
    let filtered = students.filter((student) => {
      const matchesSearch =
        student.ten.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.sdt.includes(searchTerm) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        !statusFilter || student.trang_thai_hoc_phi === statusFilter;
      const matchesCourse =
        !courseFilter || student.courseInterest === courseFilter; // TODO: Update based on backend field

      return matchesSearch && matchesStatus && matchesCourse;
    });

    // Sort students
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (
        sortBy === "dateOfBirth" ||
        sortBy === "registrationDate" ||
        sortBy === "lastContact"
      ) {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [students, searchTerm, statusFilter, courseFilter, sortBy, sortOrder]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      dadong: { color: "bg-green-100 text-green-800", label: "Đã đóng" },
      conno: { color: "bg-yellow-100 text-yellow-800", label: "Còn nợ" },
      chuadong: { color: "bg-red-100 text-red-800", label: "Chưa đóng" },
    };

    const config = statusConfig[status] || {
      color: "bg-gray-100 text-gray-800",
      label: status,
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-main mx-auto"></div>
          <p className="mt-2 text-slate-600">Đang tải danh sách học viên...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-primary-main text-white rounded-lg hover:bg-primary-main/90"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200">
      {/* Header with search and filters */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, số điện thoại, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-3 ">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent interactive-card"
            >
              <option value="">Tất cả trạng thái</option>
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent interactive-card"
            >
              <option value="">Tất cả khóa học</option>
              {courseOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100"
                onClick={() => handleSort("ten")}
              >
                Tên học viên
                {sortBy === "ten" && (
                  <span className="ml-1">
                    {sortOrder === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100"
                onClick={() => handleSort("sdt")}
              >
                Số điện thoại
                {sortBy === "sdt" && (
                  <span className="ml-1">
                    {sortOrder === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100"
                onClick={() => handleSort("email")}
              >
                Email
                {sortBy === "email" && (
                  <span className="ml-1">
                    {sortOrder === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100"
                onClick={() => handleSort("ghi_chu")}
              >
                Ghi chú
                {sortBy === "ghi_chu" && (
                  <span className="ml-1">
                    {sortOrder === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100"
                onClick={() => handleSort("trang_thai_hoc_phi")}
              >
                Trạng thái học phí
                {sortBy === "trang_thai_hoc_phi" && (
                  <span className="ml-1">
                    {sortOrder === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Tài khoản
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {filteredStudents.map((student) => (
              <tr key={student.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-slate-900">
                    {student.ten}
                  </div>
                  <div className="text-sm text-slate-500">
                    {new Date(student.ngay_sinh).toLocaleDateString("vi-VN")}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                  {student.sdt}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                  {student.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                  {student.ghi_chu || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(student.trang_thai_hoc_phi)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                  {student.co_tai_khoan ? "Có tài khoản" : "Chưa có"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onViewProfile(student)}
                      className="text-primary-main hover:text-primary-dark p-1 rounded"
                      title="Xem chi tiết"
                    >
                      <Eye className="h-4 w-4 interactive-button" />
                    </button>
                    <button
                      onClick={() => onEdit(student)}
                      className="text-slate-600 hover:text-slate-900 p-1 rounded"
                      title="Chỉnh sửa"
                    >
                      <Edit className="h-4 w-4 interactive-button" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer with count */}
      <div className="px-6 py-3 bg-slate-50 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-600">
            Hiển thị {filteredStudents.length} trong tổng số {students.length}{" "}
            học viên
          </p>
        </div>
      </div>
    </div>
  );
}
