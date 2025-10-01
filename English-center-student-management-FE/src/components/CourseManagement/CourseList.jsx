import React, { useState, useMemo } from "react";
import { Search, BookOpen, Users, Clock, DollarSign, Star } from "lucide-react";
import CourseDetail from "./CourseDetail";
import { dummyCourses } from "./dummyData";

export default function CourseList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);

  const filteredCourses = useMemo(() => {
    return dummyCourses.filter((course) => {
      const matchesSearch =
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesLevel = !levelFilter || course.level === levelFilter;
      const matchesStatus = !statusFilter || course.status === statusFilter;

      return matchesSearch && matchesLevel && matchesStatus;
    });
  }, [searchTerm, levelFilter, statusFilter]);

  const getLevelBadge = (level) => {
    const levelColors = {
      "Cơ bản": "bg-green-100 text-green-800",
      "Trung cấp": "bg-yellow-100 text-yellow-800",
      "Cao cấp": "bg-red-100 text-red-800",
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          levelColors[level] || "bg-gray-100 text-gray-800"
        }`}
      >
        {level}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      "Đang mở": "bg-green-100 text-green-800",
      "Tạm dừng": "bg-orange-100 text-orange-800",
      "Đã đóng": "bg-red-100 text-red-800",
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
              placeholder="Tìm kiếm khóa học..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-3">
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent interactive-button"
            >
              <option value="">Tất cả trình độ</option>
              <option value="Cơ bản">Cơ bản</option>
              <option value="Trung cấp">Trung cấp</option>
              <option value="Cao cấp">Cao cấp</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent interactive-button"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="Đang mở">Đang mở</option>
              <option value="Tạm dừng">Tạm dừng</option>
              <option value="Đã đóng">Đã đóng</option>
            </select>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <div
            key={course.id}
            onClick={() => setSelectedCourse(course)}
            className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 interactive-card"
          >
            {/* Course Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-primary-main rounded-lg flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {course.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    {getLevelBadge(course.level)}
                    {getStatusBadge(course.status)}
                  </div>
                </div>
              </div>
            </div>

            {/* Course Description */}
            <p className="text-sm text-slate-600 mb-4 line-clamp-2">
              {course.description}
            </p>

            {/* Course Details */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Clock className="h-4 w-4" />
                <span>Thời gian: {course.duration}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Users className="h-4 w-4" />
                <span>Tối đa: {course.maxStudents} học viên</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-600">
                <DollarSign className="h-4 w-4" />
                <span className="font-medium text-slate-900">
                  {course.price}
                </span>
              </div>
            </div>

            {/* Requirements */}
            <div className="mt-4 pt-4 border-t border-slate-200">
              <div className="flex items-start gap-2">
                <Star className="h-4 w-4 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-slate-500 mb-1">
                    Yêu cầu đầu vào:
                  </p>
                  <p className="text-sm text-slate-600">
                    {course.requirements}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            Không tìm thấy khóa học
          </h3>
          <p className="text-slate-600">
            Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
          </p>
        </div>
      )}

      {/* Footer with count */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-600">
            Hiển thị {filteredCourses.length} trong tổng số{" "}
            {dummyCourses.length} khóa học
          </p>
        </div>
      </div>

      {/* Course Detail Modal */}
      {selectedCourse && (
        <CourseDetail
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
        />
      )}
    </div>
  );
}
