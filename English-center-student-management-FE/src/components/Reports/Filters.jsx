import React, { useState, useEffect } from "react";
import courseService from "../../services/courseService";

export default function Filters({ value, onChange }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  // Lấy danh sách khóa học và set thời gian mặc định khi component mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await courseService.getCourses();
        setCourses(response.results || []);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    // Set thời gian mặc định: 1 tháng từ ngày hiện tại
    const setDefaultDates = () => {
      const today = new Date();
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(today.getMonth() - 1);
      
      // Format về yyyy-mm-dd cho input date
      const formatDate = (date) => {
        return date.toISOString().split('T')[0];
      };

      // Chỉ set nếu chưa có giá trị
      if (!value.from && !value.to) {
        onChange({
          ...value,
          from: formatDate(oneMonthAgo),
          to: formatDate(today)
        });
      }
    };

    fetchCourses();
    setDefaultDates();
  }, []);

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Từ ngày</label>
          <input type="date" value={value.from} onChange={(e) => onChange({ ...value, from: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Đến ngày</label>
          <input type="date" value={value.to} onChange={(e) => onChange({ ...value, to: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Khóa học</label>
          <select 
            value={value.course} 
            onChange={(e) => onChange({ ...value, course: e.target.value })} 
            className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            disabled={loading}
          >
            <option value="">Tất cả khóa học</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.ten}
              </option>
            ))}
          </select>
          {loading && (
            <div className="text-xs text-gray-500 mt-1">Đang tải danh sách khóa học...</div>
          )}
        </div>
      </div>
    </div>
  );
}

