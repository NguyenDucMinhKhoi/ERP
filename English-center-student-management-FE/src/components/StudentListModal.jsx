import React, { useState } from "react";
import {
  X,
  Users,
  Phone,
  Mail,
  Calendar,
  UserCheck,
  AlertCircle,
  Search,
  Filter,
} from "lucide-react";

export default function StudentListModal({ isOpen, onClose, selectedClass }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Dữ liệu giả cho sinh viên
  const students = [
    {
      id: 1,
      name: "Nguyễn Văn An",
      email: "an.nguyen@email.com",
      phone: "0901234567",
      studentId: "HV001",
      joinDate: "2024-01-15",
      status: "active",
      attendance: 95,
      paymentStatus: "paid",
      lastClass: "2024-01-20",
    },
    {
      id: 2,
      name: "Trần Thị Bình",
      email: "binh.tran@email.com",
      phone: "0901234568",
      studentId: "HV002",
      joinDate: "2024-01-15",
      status: "active",
      attendance: 88,
      paymentStatus: "paid",
      lastClass: "2024-01-20",
    },
    {
      id: 3,
      name: "Lê Văn Cường",
      email: "cuong.le@email.com",
      phone: "0901234569",
      studentId: "HV003",
      joinDate: "2024-01-20",
      status: "active",
      attendance: 92,
      paymentStatus: "pending",
      lastClass: "2024-01-20",
    },
    {
      id: 4,
      name: "Phạm Thị Dung",
      email: "dung.pham@email.com",
      phone: "0901234570",
      studentId: "HV004",
      joinDate: "2024-01-20",
      status: "inactive",
      attendance: 75,
      paymentStatus: "overdue",
      lastClass: "2024-01-18",
    },
    {
      id: 5,
      name: "Hoàng Văn Em",
      email: "em.hoang@email.com",
      phone: "0901234571",
      studentId: "HV005",
      joinDate: "2024-01-25",
      status: "active",
      attendance: 100,
      paymentStatus: "paid",
      lastClass: "2024-01-20",
    },
    {
      id: 6,
      name: "Vũ Thị Phương",
      email: "phuong.vu@email.com",
      phone: "0901234572",
      studentId: "HV006",
      joinDate: "2024-01-25",
      status: "active",
      attendance: 85,
      paymentStatus: "paid",
      lastClass: "2024-01-20",
    },
    {
      id: 7,
      name: "Đặng Văn Giang",
      email: "giang.dang@email.com",
      phone: "0901234573",
      studentId: "HV007",
      joinDate: "2024-02-01",
      status: "active",
      attendance: 90,
      paymentStatus: "pending",
      lastClass: "2024-01-20",
    },
    {
      id: 8,
      name: "Bùi Thị Hoa",
      email: "hoa.bui@email.com",
      phone: "0901234574",
      studentId: "HV008",
      joinDate: "2024-02-01",
      status: "active",
      attendance: 78,
      paymentStatus: "paid",
      lastClass: "2024-01-20",
    },
  ];

  // Lọc sinh viên theo tìm kiếm và trạng thái
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === "all" || student.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getAttendanceColor = (attendance) => {
    if (attendance >= 90) return "text-green-600";
    if (attendance >= 80) return "text-yellow-600";
    return "text-red-600";
  };

  if (!isOpen || !selectedClass) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Danh Sách Học Viên - {selectedClass.name}
              </h2>
              <p className="text-sm text-gray-600">
                {selectedClass.level} • {selectedClass.schedule} •{" "}
                {filteredStudents.length} học viên
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Search and Filter */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, mã học viên, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Đang học</option>
                <option value="inactive">Tạm dừng</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredStudents.map((student) => (
                <div
                  key={student.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">
                          {student.name}
                        </h3>
                        <span className="text-sm text-gray-500">
                          #{student.studentId}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          <span className="truncate max-w-[150px]">
                            {student.email}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          <span>{student.phone}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                          student.status
                        )}`}
                      >
                        {student.status === "active" ? "Đang học" : "Tạm dừng"}
                      </span>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${getPaymentStatusColor(
                          student.paymentStatus
                        )}`}
                      >
                        {student.paymentStatus === "paid"
                          ? "Đã thanh toán"
                          : student.paymentStatus === "pending"
                          ? "Chờ thanh toán"
                          : "Quá hạn"}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="flex items-center gap-1 text-gray-600 mb-1">
                        <Calendar className="h-3 w-3" />
                        <span>Ngày nhập học:</span>
                      </div>
                      <span className="text-gray-900">
                        {new Date(student.joinDate).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-gray-600 mb-1">
                        <UserCheck className="h-3 w-3" />
                        <span>Điểm danh:</span>
                      </div>
                      <span
                        className={`font-medium ${getAttendanceColor(
                          student.attendance
                        )}`}
                      >
                        {student.attendance}%
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Lớp cuối:</span>
                      <span className="text-gray-900">
                        {new Date(student.lastClass).toLocaleDateString(
                          "vi-VN"
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredStudents.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Không tìm thấy học viên
                </h3>
                <p className="text-gray-600">
                  Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            Hiển thị {filteredStudents.length} trong tổng số {students.length}{" "}
            học viên
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
