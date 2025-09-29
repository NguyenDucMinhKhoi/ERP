import React, { useState, useMemo } from "react";
import {
  Search,
  Users,
  Calendar,
  MapPin,
  User,
  MoreVertical,
  UserPlus,
  Clock,
  CheckSquare,
} from "lucide-react";
import { dummyClasses, classStatusOptions } from "./dummyData";

export default function ClassList({
  onAssignStudents,
  onManageSchedule,
  onTrackAttendance,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [courseFilter, setCourseFilter] = useState("");

  const filteredClasses = useMemo(() => {
    return dummyClasses.filter((classItem) => {
      const matchesSearch =
        classItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        classItem.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        classItem.teacherName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = !statusFilter || classItem.status === statusFilter;
      const matchesCourse =
        !courseFilter || classItem.courseId.toString() === courseFilter;

      return matchesSearch && matchesStatus && matchesCourse;
    });
  }, [searchTerm, statusFilter, courseFilter]);

  const getStatusBadge = (status) => {
    const statusColors = {
      "Chờ mở lớp": "bg-yellow-100 text-yellow-800",
      "Đang học": "bg-green-100 text-green-800",
      "Tạm dừng": "bg-orange-100 text-orange-800",
      "Đã kết thúc": "bg-blue-100 text-blue-800",
      "Đã hủy": "bg-red-100 text-red-800",
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          statusColors[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {status}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const getCourseOptions = () => {
    const courses = [
      ...new Set(
        dummyClasses.map((c) => ({ id: c.courseId, name: c.courseName }))
      ),
    ];
    return courses.map((course) => (
      <option key={course.id} value={course.id}>
        {course.name}
      </option>
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header with search and filters */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Tìm kiếm lớp học, khóa học, giáo viên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-3">
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
            >
              <option value="">Tất cả khóa học</option>
              {getCourseOptions()}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
            >
              <option value="">Tất cả trạng thái</option>
              {classStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Classes Table */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Lớp học
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Khóa học
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Giáo viên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Học viên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Lịch học
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredClasses.map((classItem) => (
                <tr key={classItem.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-900">
                      {classItem.name}
                    </div>
                    <div className="text-sm text-slate-500">
                      {classItem.room}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {classItem.courseName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 bg-slate-200 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-slate-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-900">
                          {classItem.teacherName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-slate-400" />
                      <span className="text-sm text-slate-900">
                        {classItem.currentStudents}/{classItem.maxStudents}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-900">
                      {classItem.schedule.map((s, index) => (
                        <div key={index} className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-slate-400" />
                          <span>
                            {s.day} {s.time}
                          </span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(classItem.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onAssignStudents(classItem)}
                        className="text-primary-main hover:text-primary-dark p-1 rounded"
                        title="Gán học viên"
                      >
                        <UserPlus className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onManageSchedule(classItem)}
                        className="text-slate-600 hover:text-slate-900 p-1 rounded"
                        title="Quản lý lịch học"
                      >
                        <Clock className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onTrackAttendance(classItem)}
                        className="text-slate-600 hover:text-slate-900 p-1 rounded"
                        title="Điểm danh"
                      >
                        <CheckSquare className="h-4 w-4" />
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
              Hiển thị {filteredClasses.length} trong tổng số{" "}
              {dummyClasses.length} lớp học
            </p>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredClasses.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            Không tìm thấy lớp học
          </h3>
          <p className="text-slate-600">
            Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
          </p>
        </div>
      )}
    </div>
  );
}
