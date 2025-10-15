import React, { useState, useEffect } from "react";

export default function StudentsReport({ filters, students = [], enrollments = [], courses = [], loading = false }) {
  const [stats, setStats] = useState({
    total: 0,
    newThisMonth: 0,
    completed: 0,
  });
  const [courseData, setCourseData] = useState([]);

  // Tính toán thống kê dựa trên data từ props
  useEffect(() => {
    if (!filters.to || loading) return; // Chờ filter được set và data load xong
    
    try {
      // 1. Tổng học viên (tất cả học viên đến ngày mới nhất)
      const totalStudents = students.length;

      // 2. Học viên mới trong tháng (dựa trên filter đến ngày)
      const toDate = new Date(filters.to);
      const fromDateForMonth = new Date(toDate);
      fromDateForMonth.setMonth(toDate.getMonth() - 1); // 1 tháng trước
      
      const newStudentsInMonth = students.filter(student => {
        const createdDate = new Date(student.created_at);
        return createdDate >= fromDateForMonth && createdDate <= toDate;
      }).length;

      // 3. Học viên đã hoàn thành khóa học trong tháng
      const completedStudentsInMonth = enrollments.filter(enrollment => {
        const updatedDate = new Date(enrollment.updated_at);
        return enrollment.trang_thai === 'hoan_thanh' && 
               updatedDate >= fromDateForMonth && 
               updatedDate <= toDate;
      }).length;

      // 4. Thống kê theo khóa học
      const courseStats = courses.map(course => {
        const courseEnrollments = enrollments.filter(
          enrollment => enrollment.khoahoc === course.id
        );
        
        return {
          course: course.ten,
          count: courseEnrollments.length
        };
      }).filter(item => item.count > 0);

      setStats({
        total: totalStudents,
        newThisMonth: newStudentsInMonth,
        completed: completedStudentsInMonth,
      });

      setCourseData(courseStats);
      
    } catch (error) {
      console.error("Error calculating student stats:", error);
      setStats({
        total: 0,
        newThisMonth: 0,
        completed: 0,
      });
      setCourseData([]);
    }
  }, [filters, students, enrollments, courses, loading]);

  // Tổng học viên: Số lượng học viên có trong hệ thống đến thời điểm hiện tại 
  // Học viên mới: Số lượng học viên được tạo trong tháng dựa trên ngày "đến ngày" trong filter
  // Đã hoàn thành: Số lượng học viên đã hoàn thành ít nhất 1 khóa học trong tháng dựa trên ngày "đến ngày" trong filter
  return (
    <div className="space-y-4">
      {loading && (
        <div className="text-center py-4 text-gray-500">
          Đang tải dữ liệu thống kê...
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg border">
          <div className="text-sm text-slate-600">Tổng học viên</div>
          <div className="text-2xl font-bold">{stats.total.toLocaleString()}</div>
          <div className="text-xs text-slate-500 mt-1">Đến {filters.to || 'hiện tại'}</div>
        </div>
        <div className="p-4 rounded-lg border">
          <div className="text-sm text-slate-600">Học viên mới</div>
          <div className="text-2xl font-bold">{stats.newThisMonth.toLocaleString()}</div>
          <div className="text-xs text-slate-500 mt-1">Trong tháng đến {filters.to}</div>
        </div>
        <div className="p-4 rounded-lg border">
          <div className="text-sm text-slate-600">Đã hoàn thành</div>
          <div className="text-2xl font-bold">{stats.completed.toLocaleString()}</div>
          <div className="text-xs text-slate-500 mt-1">Trong tháng đến {filters.to}</div>
        </div>
      </div>
      <div className="h-56 grid place-items-center text-slate-400 border rounded-lg">[Chart placeholder]</div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Khóa học</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Số lượng</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {courseData.map((r) => (
              <tr key={r.course}>
                <td className="px-4 py-2">{r.course}</td>
                <td className="px-4 py-2">{r.count.toLocaleString()}</td>
              </tr>
            ))}
            {courseData.length === 0 && !loading && (
              <tr>
                <td colSpan="2" className="px-4 py-8 text-center text-gray-500">
                  Không có dữ liệu khóa học
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

