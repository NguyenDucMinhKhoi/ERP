import React, { useEffect, useState } from "react";
import {
  X,
  Edit,
  Phone,
  Mail,
  MapPin,
  Calendar,
  BookOpen,
  User,
  Clock,
  CheckCircle,
} from "lucide-react";
import crmService from "../../services/crmService";

export default function StudentProfileModal({ student, onClose, onEdit }) {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Ngăn scroll khi mở popup
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  // Fetch student details from API
  useEffect(() => {
    const fetchStudentDetails = async () => {
      if (!student?.id) return;
      
      try {
        setLoading(true);
        setError(null);
        const data = await crmService.getStudent(student.id);
        setStudentData(data);
      } catch (err) {
        console.error("Error fetching student details:", err);
        setError("Không thể tải thông tin học viên. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentDetails();
  }, [student?.id]);

  if (!student) return null;

  // Sử dụng dữ liệu từ API nếu có, fallback về student prop
  const displayStudent = studentData || student;

  const getStatusBadge = (status) => {
    const statusColors = {
      "cho_lop": "bg-yellow-100 text-yellow-800",
      "dang_hoc": "bg-green-100 text-green-800",
      "tam_dung": "bg-orange-100 text-orange-800",
      "da_hoan_thanh": "bg-blue-100 text-blue-800",
      "da_huy": "bg-red-100 text-red-800",
    };

    const statusLabels = {
      "cho_lop": "Chờ lớp",
      "dang_hoc": "Đang học",
      "tam_dung": "Tạm dừng",
      "da_hoan_thanh": "Đã hoàn thành",
      "da_huy": "Đã hủy",
    };

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
          statusColors[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {statusLabels[status] || status}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Chưa cập nhật";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 bg-primary-main rounded-full flex items-center justify-center text-white text-xl font-bold">
              {displayStudent.ten?.charAt(0)?.toUpperCase() || "?"}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {displayStudent.ten || "Chưa có tên"}
              </h2>
              <p className="text-slate-600">ID: {displayStudent.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onEdit}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-main bg-primary-light border border-primary-main rounded-lg hover:bg-primary-main hover:text-white transition-colors"
            >
              <Edit className="h-4 w-4 interactive-button" />
              Chỉnh sửa
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1 rounded interactive-button"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content - Scrollable area */}
        <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-main mx-auto"></div>
                <p className="mt-4 text-slate-600">Đang tải thông tin học viên...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center p-12">
              <div className="text-center">
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-primary-main text-white rounded-lg hover:bg-primary-dark"
                >
                  Thử lại
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 space-y-8">
              {/* Status and Overview */}
              <div className="bg-slate-50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900">
                    Tổng quan
                  </h3>
                  {getStatusBadge(displayStudent.trang_thai)}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-main">
                      {displayStudent.lop_hoc || "Chưa xếp lớp"}
                    </div>
                    <div className="text-sm text-slate-600">Lớp hiện tại</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-900">
                      {formatDate(displayStudent.ngay_dang_ky)}
                    </div>
                    <div className="text-sm text-slate-600">Ngày đăng ký</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-900">
                      {formatDate(displayStudent.ngay_lien_he_cuoi)}
                    </div>
                    <div className="text-sm text-slate-600">Liên hệ cuối</div>
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Thông tin cá nhân
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-slate-400 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-slate-900">
                          Ngày sinh
                        </div>
                        <div className="text-sm text-slate-600">
                          {formatDate(displayStudent.ngay_sinh)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-slate-400 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-slate-900">
                          Số điện thoại
                        </div>
                        <div className="text-sm text-slate-600">
                          {displayStudent.sdt || "Chưa cập nhật"}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-slate-400 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-slate-900">
                          Email
                        </div>
                        <div className="text-sm text-slate-600">
                          {displayStudent.email || "Chưa cập nhật"}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-slate-400 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-slate-900">
                          Địa chỉ
                        </div>
                        <div className="text-sm text-slate-600">
                          {displayStudent.dia_chi || "Chưa cập nhật"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Thông tin học tập
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-medium text-slate-900 mb-1">
                        Nhu cầu học
                      </div>
                      <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                        {displayStudent.nhu_cau_hoc || "Chưa cập nhật"}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium text-slate-900 mb-1">
                        Khóa học quan tâm
                      </div>
                      <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                        {displayStudent.khoa_hoc_quan_tam || "Chưa cập nhật"}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium text-slate-900 mb-1">
                        Lớp học
                      </div>
                      <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                        {displayStudent.lop_hoc || "Chưa xếp lớp"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {displayStudent.ghi_chu && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Ghi chú
                  </h3>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-sm text-slate-700 whitespace-pre-wrap">
                      {displayStudent.ghi_chu}
                    </p>
                  </div>
                </div>
              )}

              {/* Learning Progress (Placeholder for future implementation) */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Tiến độ học tập
                </h3>
                <div className="bg-slate-50 p-6 rounded-lg text-center">
                  <div className="text-slate-500 text-sm">
                    Tính năng theo dõi tiến độ học tập sẽ được phát triển trong
                    phiên bản tiếp theo
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 focus:ring-2 focus:ring-primary-main focus:border-transparent interactive-button"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
