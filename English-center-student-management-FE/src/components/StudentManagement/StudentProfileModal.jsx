import React, { useEffect } from "react";
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

export default function StudentProfileModal({ student, onClose, onEdit }) {
  // Ngăn scroll khi mở popup
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  if (!student) return null;

  const getStatusBadge = (status) => {
    const statusColors = {
      "Chờ lớp": "bg-yellow-100 text-yellow-800",
      "Đang học": "bg-green-100 text-green-800",
      "Tạm dừng": "bg-orange-100 text-orange-800",
      "Đã hoàn thành": "bg-blue-100 text-blue-800",
      "Đã hủy": "bg-red-100 text-red-800",
    };

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
          statusColors[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {status}
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
              {student.fullName?.charAt(0) || "?"}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {student.fullName}
              </h2>
              <p className="text-slate-600">ID: {student.id}</p>
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
        <div iv className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
          <div className="p-6 space-y-8">
            {/* Status and Overview */}
            <div className="bg-slate-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900">
                  Tổng quan
                </h3>
                {getStatusBadge(student.status)}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-main">
                    {student.class || "Chưa xếp lớp"}
                  </div>
                  <div className="text-sm text-slate-600">Lớp hiện tại</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900">
                    {formatDate(student.registrationDate)}
                  </div>
                  <div className="text-sm text-slate-600">Ngày đăng ký</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900">
                    {formatDate(student.lastContact)}
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
                        {formatDate(student.dateOfBirth)}
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
                        {student.phone || "Chưa cập nhật"}
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
                        {student.email || "Chưa cập nhật"}
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
                        {student.address || "Chưa cập nhật"}
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
                      {student.learningNeeds || "Chưa cập nhật"}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-slate-900 mb-1">
                      Khóa học quan tâm
                    </div>
                    <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                      {student.courseInterest || "Chưa cập nhật"}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-slate-900 mb-1">
                      Lớp học
                    </div>
                    <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                      {student.class || "Chưa xếp lớp"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            {student.notes && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Ghi chú
                </h3>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-sm text-slate-700 whitespace-pre-wrap">
                    {student.notes}
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