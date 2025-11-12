import React, { useState, useEffect } from "react";
import crmService from '../../services/crmService';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function StudentsReport({ filters, allStudents = [] }) {
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

  // Tính số học viên trong khoảng thời gian filter
  const studentsInFilterPeriod = React.useMemo(() => {
    if (!filters.from || !filters.to || !allStudents.length) {
      return 0;
    }

    const fromDate = new Date(filters.from);
    const toDate = new Date(filters.to);
    toDate.setHours(23, 59, 59, 999); // Include toàn bộ ngày cuối

    return allStudents.filter(student => {
      const createdDate = student.ngay_dang_ky || student.created_at;
      if (!createdDate) return false;
      
      const date = new Date(createdDate);
      return date >= fromDate && date <= toDate;
    }).length;
  }, [allStudents, filters.from, filters.to]);

  // Mock data cho Line Chart - Học viên đăng ký theo ngày
  const registrationTrendData = React.useMemo(() => {
    // Mock data - sau này sẽ tính từ allStudents dựa trên filters
    return [
      { date: '01/11', students: 12 },
      { date: '05/11', students: 19 },
      { date: '10/11', students: 25 },
      { date: '15/11', students: 32 },
      { date: '20/11', students: 28 },
      { date: '25/11', students: 35 },
      { date: '30/11', students: 42 },
    ];
  }, [filters]);

  // Mock data cho Bar Chart - Số lượng học viên theo khóa học
  const courseComparisonData = React.useMemo(() => {
    // Mock data - sau này sẽ tính từ allStudents dựa trên filters
    return [
      { course: 'IELTS 5.0-6.0', students: 45 },
      { course: 'TOEIC', students: 38 },
      { course: 'General English A1-A2', students: 52 },
      { course: 'Business', students: 28 },
      { course: 'IELTS 6.0-7.0', students: 35 },
      { course: 'TOEFL 80-100', students: 30 },
      { course: 'TOEIC 450-650', students: 22 },
    ];
  }, [filters]);

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
            {loading ? '...' : studentsInFilterPeriod}
          </div>
        </div>
        <div className="p-4 rounded-lg border">
          <div className="text-sm text-slate-600">Đã hoàn thành</div>
          <div className="text-2xl font-bold">—</div>
        </div>
      </div>

      {/* Biểu đồ - 2 charts trong 1 hàng */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Line Chart - Xu hướng đăng ký */}
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">
            Xu hướng đăng ký học viên
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={registrationTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="date" 
                tick={{ fill: '#64748b', fontSize: 12 }}
                stroke="#cbd5e1"
              />
              <YAxis 
                tick={{ fill: '#64748b', fontSize: 12 }}
                stroke="#cbd5e1"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '8px 12px'
                }}
              />
              <Legend 
                wrapperStyle={{ fontSize: '14px', paddingTop: '10px' }}
              />
              <Line 
                type="monotone" 
                dataKey="students" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: '#3b82f6', r: 4 }}
                activeDot={{ r: 6 }}
                name="Số học viên"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart - So sánh khóa học */}
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">
            So sánh khóa học đã đăng ký
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={courseComparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="course" 
                tick={{ fill: '#64748b', fontSize: 12 }}
                stroke="#cbd5e1"
              />
              <YAxis 
                tick={{ fill: '#64748b', fontSize: 12 }}
                stroke="#cbd5e1"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '8px 12px'
                }}
              />
              <Legend 
                wrapperStyle={{ fontSize: '14px', paddingTop: '10px' }}
              />
              <Bar 
                dataKey="students" 
                fill="#10b981" 
                radius={[8, 8, 0, 0]}
                name="Số học viên"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
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