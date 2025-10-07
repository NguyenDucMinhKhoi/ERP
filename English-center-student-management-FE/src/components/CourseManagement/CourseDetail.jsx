import React, { useEffect, useState } from "react";
import { X, Book, Users, Clock, DollarSign, Calendar, User } from "lucide-react";
import courseService from "../../services/courseService";

export default function CourseDetail({ course, onClose }) {
  const [courseClasses, setCourseClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourseClasses = async () => {
      try {
        setLoading(true);
        const response = await courseService.getClasses();
        const allClasses = response.results || [];
        
        // Filter classes for this course
        const filteredClasses = allClasses.filter(cls => cls.courseId === course.id);
        setCourseClasses(filteredClasses);
      } catch (error) {
        console.error('Error loading course classes:', error);
        setCourseClasses([]);
      } finally {
        setLoading(false);
      }
    };

    loadCourseClasses();
  }, [course.id]);

  const getStatusBadge = (status) => {
    const statusColors = {
      "Đang học": "bg-green-100 text-green-800",
      "Đã kết thúc": "bg-slate-100 text-slate-800",
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
// Ngăn scroll khi mở popup
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 overflow-auto p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              {course.ten || course.name}
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              {course.mo_ta || course.description || 'Chưa có mô tả'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-8">
            {/* Thông tin khóa học */}
            <div>
              <h3 className="text-lg font-medium text-slate-900 mb-4">
                Thông tin khóa học
              </h3>
              <div className="bg-slate-50 rounded-lg p-4 space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      Lịch học
                    </p>
                    <p className="text-sm text-slate-600">{course.lich_hoc || 'Chưa có lịch'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="text-sm font-medium text-slate-700">Học phí</p>
                    <p className="text-sm text-slate-600">
                      {course.hoc_phi ? `${Number(course.hoc_phi).toLocaleString('vi-VN')} VNĐ` : course.price || 'Chưa có giá'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      Số buổi học
                    </p>
                    <p className="text-sm text-slate-600">{course.so_buoi || 'Chưa xác định'} buổi</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      Giảng viên
                    </p>
                    <p className="text-sm text-slate-600">{course.giang_vien || 'Chưa phân công'}</p>
                  </div>
                </div>

                {course.so_hoc_vien !== undefined && (
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-slate-400" />
                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        Số học viên đã đăng ký
                      </p>
                      <p className="text-sm text-slate-600">{course.so_hoc_vien} học viên</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Danh sách lớp */}
            <div>
              <h3 className="text-lg font-medium text-slate-900 mb-4">
                Danh sách lớp ({courseClasses.length} lớp)
              </h3>

              {loading && (
                <div className="text-center py-8">
                  <div className="text-slate-600">Đang tải danh sách lớp...</div>
                </div>
              )}
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                        Lớp
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                        Giáo viên
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                        Số lượng HV
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                        Lịch học
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                        Trạng thái
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {courseClasses.map((cls) => (
                      <tr key={cls.id} className="hover:bg-slate-50 cursor-pointer">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                          {cls.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                          {cls.teacherName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                          {cls.currentStudents}/{cls.maxStudents}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-900">
                          <div className="space-y-1">
                            {cls.schedule.map((sch, index) => (
                              <div key={index}>
                                {sch.day}: {sch.time}
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(cls.status)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>


          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}