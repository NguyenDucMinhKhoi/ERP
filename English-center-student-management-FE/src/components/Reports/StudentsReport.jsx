import React, { useState, useEffect } from "react";
import crmService from '../../services/crmService';

export default function StudentsReport({ filters }) {
  const [stats, setStats] = useState({
    total_students: 0,
    students_this_month: 0
  });
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const data = await crmService.getStudentStats();
        if (!mounted) return;
        setStats({
          total_students: data.total_students || 0,
          students_this_month: data.students_this_month || 0
        });
        setCourses(data.courses || []);
      } catch (err) {
        console.error('Error loading student stats:', err);
        if (mounted) setError('Không thể tải thống kê học viên');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg border">
          <div className="text-sm text-slate-600">Tổng học viên</div>
          <div className="text-2xl font-bold">
            {loading ? '...' : stats.total_students}
          </div>
        </div>
        <div className="p-4 rounded-lg border">
          <div className="text-sm text-slate-600">Tháng này</div>
          <div className="text-2xl font-bold">
            {loading ? '...' : stats.students_this_month}
          </div>
        </div>
        <div className="p-4 rounded-lg border">
          <div className="text-sm text-slate-600">Đã hoàn thành</div>
          <div className="text-2xl font-bold">—</div>
        </div>
      </div>

      <div className="h-56 grid place-items-center text-slate-400 border rounded-lg">
        {loading ? 'Đang tải biểu đồ...' : '[Chart placeholder]'}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Khóa học</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Số lượng</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {error && (
              <tr>
                <td colSpan={2} className="px-4 py-2 text-sm text-red-600">{error}</td>
              </tr>
            )}
            {!error && (courses.length === 0 && !loading) && (
              <tr>
                <td colSpan={2} className="px-4 py-2 text-sm text-slate-600">Không có dữ liệu</td>
              </tr>
            )}
            {courses.map((c) => (
              <tr key={c.id}>
                <td className="px-4 py-2">{c.ten}</td>
                <td className="px-4 py-2">{c.student_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

