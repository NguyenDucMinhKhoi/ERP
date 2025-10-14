import React, { useState, useMemo, useEffect } from 'react';
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
} from 'lucide-react';
import courseService from '../../services/courseService';

export default function ClassList({
  onAssignStudents,
  onManageSchedule,
  onTrackAttendance,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load classes from API
   useEffect(() => {
    const loadClasses = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await courseService.fetchClass(); // Use fetchClass instead of getClasses
        console.log('Classes response:', response);
        
        // Transform API response to match frontend format
        const transformedClasses = (response.results || []).map(item => ({
          id: item.id,
          name: item.ten,
          courseId: item.khoa_hoc,
          courseName: item.courseName || 'N/A',
          giang_vien: item.giang_vien || { name: 'N/A' },
          room: item.phong_hoc,
          schedule: item.schedule || [],
          maxStudents: item.so_hoc_vien_toi_da || 20,
          currentStudents: item.currentStudents || 0,
          status: item.trang_thai,
          startDate: item.ngay_bat_dau,
          endDate: item.ngay_ket_thuc,
          students: item.students || []
        }));
        
        setClasses(transformedClasses);
      } catch (err) {
        console.error('Error loading classes:', err);
        setError('Không thể tải danh sách lớp học. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    loadClasses();
  }, []);

  const filteredClasses = useMemo(() => {
    return classes.filter((classItem) => {
      const matchesSearch =
        classItem.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        classItem.courseName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        classItem.teacherName?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = !statusFilter || classItem.status === statusFilter;
      const matchesCourse =
        !courseFilter || classItem.courseId?.toString() === courseFilter;

      return matchesSearch && matchesStatus && matchesCourse;
    });
  }, [classes, searchTerm, statusFilter, courseFilter]);
  console.log('Filtered Classes:', filteredClasses);
  const getStatusBadge = (status) => {
    const statusColors = {
      'Chờ mở lớp': 'bg-yellow-100 text-yellow-800',
      'Đang học': 'bg-green-100 text-green-800',
      'Tạm dừng': 'bg-orange-100 text-orange-800',
      'Đã kết thúc': 'bg-blue-100 text-blue-800',
      'Đã hủy': 'bg-red-100 text-red-800',
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          statusColors[status] || 'bg-gray-100 text-gray-800'
        }`}
      >
        {status}
      </span>
    );
  };

  const getCourseOptions = () => {
    const uniqueCourses = Array.from(
      new Set(classes.map((c) => c.courseId))
    ).map((courseId) => {
      const classItem = classes.find((c) => c.courseId === courseId);
      return {
        id: courseId,
        name: classItem?.courseName || `Khóa học ${courseId}`,
      };
    });

    return uniqueCourses.map((course) => (
      <option key={course.id} value={course.id}>
        {course.name}
      </option>
    ));
  };

  const classStatusOptions = [
    { value: 'Chờ mở lớp', label: 'Chờ mở lớp' },
    { value: 'Đang học', label: 'Đang học' },
    { value: 'Tạm dừng', label: 'Tạm dừng' },
    { value: 'Đã kết thúc', label: 'Đã kết thúc' },
    { value: 'Đã hủy', label: 'Đã hủy' },
  ];

  // Add a handler to update currentStudents for a class after assignment
  const handleStudentsAssigned = (updatedClass) => {
    setClasses((prev) =>
      prev.map((c) =>
        c.id === updatedClass.id
          ? {
              ...c,
              currentStudents: updatedClass.currentStudents,
              students: updatedClass.students,
            }
          : c
      )
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
              className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent cursor-pointer"
            >
              <option value="">Tất cả khóa học</option>
              {getCourseOptions()}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent cursor-pointer"
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

      {/* Loading and Error States */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="text-slate-600">Đang tải danh sách lớp học...</div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Classes Table */}
      {!loading && !error && (
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
                  <tr key={classItem.id} className="">
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
                            {classItem.giang_vien.name}
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
                          onClick={() =>
                            onAssignStudents(classItem, handleStudentsAssigned)
                          }
                          className="text-primary-main hover:text-primary-dark p-1 rounded cursor-pointer"
                          title="Gán học viên"
                        >
                          <UserPlus className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onManageSchedule(classItem)}
                          className="text-slate-600 hover:text-slate-900 p-1 rounded cursor-pointer"
                          title="Quản lý lịch học"
                        >
                          <Clock className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onTrackAttendance(classItem)}
                          className="text-slate-600 hover:text-slate-900 p-1 rounded cursor-pointer"
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
                Hiển thị {filteredClasses.length} trong tổng số {classes.length}{' '}
                lớp học
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredClasses.length === 0 && (
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
