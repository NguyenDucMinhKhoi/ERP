import React, { useState } from "react";
import {
  Users,
  Calendar,
  Clock,
  GraduationCap,
  ArrowLeft,
  Search,
  Filter,
} from "lucide-react";

export default function ClassList({ onBack, onSelectClass }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCourse, setFilterCourse] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Dữ liệu giả cho các lớp học
  const classes = [
    {
      id: 1,
      name: "IELTS Foundation A1",
      level: "A1",
      course: "IELTS",
      schedule: "Thứ 2,4,6 - 18:00-20:00",
      students: 15,
      maxStudents: 20,
      teacher: "Ms. Sarah Johnson",
      startDate: "2024-01-15",
      status: "active",
    },
    {
      id: 2,
      name: "TOEIC Intermediate B1",
      level: "B1",
      course: "TOEIC",
      schedule: "Thứ 3,5,7 - 19:00-21:00",
      students: 18,
      maxStudents: 18,
      teacher: "Mr. David Smith",
      startDate: "2024-01-20",
      status: "active",
    },
    {
      id: 3,
      name: "IELTS Advanced C1",
      level: "C1",
      course: "IELTS",
      schedule: "Thứ 2,4,6 - 17:00-19:00",
      students: 12,
      maxStudents: 15,
      teacher: "Ms. Emily Brown",
      startDate: "2024-01-10",
      status: "active",
    },
    {
      id: 4,
      name: "TOEIC Basic A2",
      level: "A2",
      course: "TOEIC",
      schedule: "Thứ 3,5 - 18:30-20:30",
      students: 16,
      maxStudents: 20,
      teacher: "Mr. Michael Wilson",
      startDate: "2024-02-01",
      status: "active",
    },
    {
      id: 5,
      name: "IELTS Speaking & Writing",
      level: "B2",
      course: "IELTS",
      schedule: "Chủ nhật - 14:00-17:00",
      students: 8,
      maxStudents: 12,
      teacher: "Ms. Lisa Anderson",
      startDate: "2024-01-25",
      status: "active",
    },
    {
      id: 6,
      name: "TOEIC Listening & Reading",
      level: "B1",
      course: "TOEIC",
      schedule: "Thứ 2,4 - 19:30-21:30",
      students: 14,
      maxStudents: 18,
      teacher: "Mr. James Taylor",
      startDate: "2024-02-05",
      status: "active",
    },
    {
      id: 7,
      name: "TOEFL Preparation",
      level: "B2",
      course: "TOEFL",
      schedule: "Thứ 2,4,6 - 19:00-21:00",
      students: 10,
      maxStudents: 15,
      teacher: "Mr. Robert Davis",
      startDate: "2024-02-10",
      status: "active",
    },
    {
      id: 8,
      name: "Business English",
      level: "B1",
      course: "Business",
      schedule: "Thứ 3,5 - 18:00-20:00",
      students: 12,
      maxStudents: 16,
      teacher: "Ms. Jennifer Wilson",
      startDate: "2024-01-30",
      status: "inactive",
    },
    {
      id: 9,
      name: "IELTS Intensive",
      level: "C1",
      course: "IELTS",
      schedule: "Thứ 2,3,4,5,6 - 17:00-19:00",
      students: 6,
      maxStudents: 10,
      teacher: "Mr. Thomas Brown",
      startDate: "2024-02-15",
      status: "active",
    },
  ];

  // Lọc lớp học theo tìm kiếm, khóa học và trạng thái
  const filteredClasses = classes.filter((classItem) => {
    const matchesSearch =
      classItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classItem.teacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classItem.level.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCourse =
      filterCourse === "all" || classItem.course === filterCourse;
    const matchesStatus =
      filterStatus === "all" || classItem.status === filterStatus;

    return matchesSearch && matchesCourse && matchesStatus;
  });

  // Lấy danh sách các khóa học duy nhất
  const uniqueCourses = [...new Set(classes.map((cls) => cls.course))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại Dashboard
        </button>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <GraduationCap className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Danh Sách Lớp Học
            </h1>
            <p className="text-slate-600 mt-1">
              Chọn lớp để xem danh sách học viên
            </p>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <GraduationCap className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Tổng lớp học</p>
              <p className="text-xl font-bold text-gray-900">
                {classes.length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Tổng học viên</p>
              <p className="text-xl font-bold text-gray-900">
                {filteredClasses.reduce((sum, cls) => sum + cls.students, 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Calendar className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Lớp đang mở</p>
              <p className="text-xl font-bold text-gray-900">
                {
                  filteredClasses.filter((cls) => cls.status === "active")
                    .length
                }
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Clock className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Tỷ lệ đăng ký TB</p>
              <p className="text-xl font-bold text-gray-900">
                {filteredClasses.length > 0
                  ? Math.round(
                      filteredClasses.reduce(
                        (sum, cls) =>
                          sum + (cls.students / cls.maxStudents) * 100,
                        0
                      ) / filteredClasses.length
                    )
                  : 0}
                %
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên lớp, giáo viên, level..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={filterCourse}
                onChange={(e) => setFilterCourse(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tất cả khóa học</option>
                {uniqueCourses.map((course) => (
                  <option key={course} value={course}>
                    {course}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Đang mở</option>
                <option value="inactive">Tạm dừng</option>
              </select>
            </div>
          </div>
        </div>
        <div className="mt-3 text-sm text-gray-600">
          Hiển thị {filteredClasses.length} trong tổng số {classes.length} lớp
          học
        </div>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredClasses.map((classItem) => (
          <div
            key={classItem.id}
            onClick={() => onSelectClass(classItem)}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                  {classItem.name}
                </h3>
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {classItem.level}
                  </span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                    {classItem.course}
                  </span>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      classItem.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {classItem.status === "active" ? "Đang mở" : "Tạm dừng"}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                  <Users className="h-4 w-4" />
                  <span className="font-medium">
                    {classItem.students}/{classItem.maxStudents}
                  </span>
                </div>
                <div className="text-xs text-gray-500">học viên</div>
              </div>
            </div>

            <div className="space-y-3 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{classItem.schedule}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>
                  Bắt đầu:{" "}
                  {new Date(classItem.startDate).toLocaleDateString("vi-VN")}
                </span>
              </div>
              <div className="text-sm">
                <span className="font-medium">Giáo viên:</span>{" "}
                {classItem.teacher}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">Tỷ lệ đăng ký</span>
                <span className="text-sm font-medium text-gray-700">
                  {Math.round(
                    (classItem.students / classItem.maxStudents) * 100
                  )}
                  %
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{
                    width: `${
                      (classItem.students / classItem.maxStudents) * 100
                    }%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectClass(classItem);
                }}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Xem danh sách học viên
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredClasses.length === 0 && (
        <div className="text-center py-12">
          <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Không tìm thấy lớp học
          </h3>
          <p className="text-gray-600 mb-4">
            Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setFilterCourse("all");
              setFilterStatus("all");
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Xóa bộ lọc
          </button>
        </div>
      )}
    </div>
  );
}
