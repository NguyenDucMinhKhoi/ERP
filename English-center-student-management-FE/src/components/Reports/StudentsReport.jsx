import React, { useState, useEffect } from "react";
import courseService from "../../services/courseService";

export default function StudentsReport({ filters }) {
  const [stats, setStats] = useState({
    total: 0,
    newThisMonth: 0,
    completed: 0,
  });
  const [courseData, setCourseData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Tính toán thống kê dựa trên filters
  useEffect(() => {
    const fetchStudentStats = async () => {
      if (!filters.to) return; // Chờ filter được set
      
      try {
        setLoading(true);
        
        // Lấy tổng học viên (tất cả học viên đến ngày mới nhất)
        const studentsResponse = await courseService.getStudents();
        const totalStudents = studentsResponse.results?.length || 0;

        // Lấy học viên mới trong tháng (dựa trên filter đến ngày)
        const toDate = new Date(filters.to);
        const fromDateForMonth = new Date(toDate);
        fromDateForMonth.setMonth(toDate.getMonth() - 1); // 1 tháng trước
        
        const newStudentsInMonth = studentsResponse.results?.filter(student => {
          const createdDate = new Date(student.created_at || student.ngay_tao);
          return createdDate >= fromDateForMonth && createdDate <= toDate;
        }).length || 0;

        // Lấy danh sách đăng ký để tính học viên đã hoàn thành
        const enrollmentsResponse = await courseService.getEnrollments();
        const completedStudentsInMonth = enrollmentsResponse.results?.filter(enrollment => {
          // Kiểm tra xem có hoàn thành khóa học trong tháng không
          const completedDate = new Date(enrollment.ngay_hoan_thanh || enrollment.updated_at);
          return enrollment.trang_thai === 'hoan_thanh' && 
                 completedDate >= fromDateForMonth && 
                 completedDate <= toDate;
        }).length || 0;

        // Lấy dữ liệu theo khóa học cho bảng
        const coursesResponse = await courseService.getCourses();
        const courseStats = await Promise.all(
          (coursesResponse.results || []).map(async (course) => {
            const courseEnrollments = enrollmentsResponse.results?.filter(
              enrollment => enrollment.khoahoc === course.id
            ) || [];
            
            return {
              course: course.ten,
              count: courseEnrollments.length
            };
          })
        );

        setStats({
          total: totalStudents,
          newThisMonth: newStudentsInMonth,
          completed: completedStudentsInMonth,
        });

        setCourseData(courseStats.filter(item => item.count > 0));
        
      } catch (error) {
        console.error("Error fetching student stats:", error);
        // Hiển thị 0 nếu có lỗi API thay vì mock data
        setStats({
          total: 0,
          newThisMonth: 0,
          completed: 0,
        });
        setCourseData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentStats();
  }, [filters]);

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

