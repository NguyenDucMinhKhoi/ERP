import React, { useState, useEffect } from "react";
import { X, Save, Calendar, Plus, Edit, Trash2, Clock } from "lucide-react";

// Constants
const timeSlots = [
  "06:00",
  "06:30",
  "07:00",
  "07:30",
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
  "21:30",
];

const daysOfWeek = {
  monday: 'Thứ 2',
  tuesday: 'Thứ 3',
  wednesday: 'Thứ 4',
  thursday: 'Thứ 5',
  friday: 'Thứ 6',
  saturday: 'Thứ 7',
  sunday: 'Chủ nhật',
};

export default function ScheduleManagement({ classData, onClose }) {
  const [schedules, setSchedules] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    date: "",
    time: "",
    topic: "",
    notes: "",
  });

  // Lock body scroll when modal opens
  useEffect(() => {
    // Save current overflow and position
    const originalOverflow = document.body.style.overflow;
    const originalPosition = document.body.style.position;
    const scrollY = window.scrollY;
    
    // Lock scroll
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    
    // Cleanup: restore scroll
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.position = originalPosition;
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollY);
    };
  }, []);

  // Get teacher name from classData
  const getTeacherName = () => {
    if (!classData?.giang_vien) return 'Chưa có giáo viên';
    return classData.giang_vien.name || classData.giang_vien.username || 'N/A';
  };

  // Format schedule display
  const getScheduleDisplay = () => {
    if (!classData?.schedule || classData.schedule.length === 0) {
      return 'Chưa có lịch học cố định';
    }
    
    return classData.schedule.map(s => {
      const dayLabel = daysOfWeek[s.day] || s.day;
      return `${dayLabel} ${s.time}`;
    }).join(', ');
  };

  useEffect(() => {
    // Load schedules for this class from API
    const loadSchedules = async () => {
      try {
        // TODO: Replace with actual API call
        // const response = await courseService.getClassSchedules(classData.id);
        // setSchedules(response.results || []);
        
        // Use existing schedule from classData if available
        if (classData?.schedule && classData.schedule.length > 0) {
          // Transform schedule to display format
          const transformedSchedules = classData.schedule.map((s, index) => ({
            id: `schedule-${index}`,
            classId: classData.id,
            date: '', // Will need actual dates from backend
            time: s.time,
            day: s.day,
            topic: 'Buổi học theo lịch',
            notes: '',
            status: 'Sắp diễn ra',
            attendance: null,
          }));
          setSchedules(transformedSchedules);
        } else {
          setSchedules([]);
        }
      } catch (error) {
        console.error("Error loading schedules:", error);
        setSchedules([]);
      }
    };

    loadSchedules();
  }, [classData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddSchedule = () => {
    setShowAddForm(true);
    setEditingSchedule(null);
    setFormData({
      date: "",
      time: "",
      topic: "",
      notes: "",
    });
  };

  const handleEditSchedule = (schedule) => {
    setEditingSchedule(schedule);
    setShowAddForm(true);
    setFormData({
      date: schedule.date,
      time: schedule.time,
      topic: schedule.topic,
      notes: schedule.notes || "",
    });
  };

  const handleDeleteSchedule = (scheduleId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa buổi học này?")) {
      setSchedules((prev) => prev.filter((s) => s.id !== scheduleId));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (editingSchedule) {
        // Update existing schedule
        setSchedules((prev) =>
          prev.map((s) =>
            s.id === editingSchedule.id
              ? { ...s, ...formData, status: "Sắp diễn ra" }
              : s
          )
        );
      } else {
        // Add new schedule
        const newSchedule = {
          id: Date.now(),
          classId: classData.id,
          ...formData,
          status: "Sắp diễn ra",
          attendance: null,
        };
        setSchedules((prev) => [...prev, newSchedule]);
      }

      setShowAddForm(false);
      setEditingSchedule(null);
      setFormData({
        date: "",
        time: "",
        topic: "",
        notes: "",
      });
    } catch (error) {
      console.error("Error saving schedule:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      "Đã hoàn thành": "bg-green-100 text-green-800",
      "Sắp diễn ra": "bg-blue-100 text-blue-800",
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
    if (!dateString) return 'Chưa xác định';
    return new Date(dateString).toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden'
      }}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 flex-shrink-0">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Quản lý lịch học
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Lớp: {classData?.name} - {classData?.courseName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content - scrollable area with hidden scrollbar */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="p-6 space-y-6">
          {/* Class Info */}
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm font-medium text-slate-500">
                  Giáo viên
                </div>
                <div className="text-sm text-slate-900">
                  {getTeacherName()}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-slate-500">
                  Phòng học
                </div>
                <div className="text-sm text-slate-900">{classData?.room}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-slate-500">
                  Lịch học cố định
                </div>
                <div className="text-sm text-slate-900">
                  {getScheduleDisplay()}
                </div>
              </div>
            </div>
          </div>

          {/* Add Schedule Button */}
          <div className="flex justify-end">
            <button
              onClick={handleAddSchedule}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-main border border-transparent rounded-lg hover:bg-primary-dark transition-colors cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Thêm buổi học
            </button>
          </div>

          {/* Schedules List */}
          <div className="space-y-4">
            {schedules.map((schedule) => (
              <div
                key={schedule.id}
                className="border border-slate-200 rounded-lg p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Calendar className="h-5 w-5 text-slate-400" />
                      <div>
                        <div className="text-lg font-medium text-slate-900">
                          {schedule.date ? formatDate(schedule.date) : (schedule.day ? daysOfWeek[schedule.day] : 'Chưa xác định')}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Clock className="h-4 w-4" />
                          <span>{schedule.time}</span>
                        </div>
                      </div>
                    </div>

                    <div className="ml-8">
                      <div className="text-sm font-medium text-slate-900 mb-1">
                        Chủ đề: {schedule.topic}
                      </div>
                      {schedule.notes && (
                        <div className="text-sm text-slate-600">
                          Ghi chú: {schedule.notes}
                        </div>
                      )}
                      {schedule.attendance && (
                        <div className="text-sm text-slate-600 mt-2">
                          Điểm danh: {schedule.attendance.present} có mặt,{" "}
                          {schedule.attendance.absent} vắng mặt
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {getStatusBadge(schedule.status)}
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEditSchedule(schedule)}
                        className="text-slate-600 hover:text-slate-900 p-1 rounded cursor-pointer"
                        title="Chỉnh sửa"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteSchedule(schedule.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded cursor-pointer"
                        title="Xóa"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {schedules.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                Chưa có lịch học
              </h3>
              <p className="text-slate-600">
                Nhấn "Thêm buổi học" để tạo lịch học đầu tiên
              </p>
            </div>
          )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 focus:ring-2 focus:ring-primary-main focus:border-transparent cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>

      {/* Add/Edit Form Modal */}
      {showAddForm && (
          <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-60 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="flex items-center justify-between p-6 border-b border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900">
                  {editingSchedule ? "Chỉnh sửa buổi học" : "Thêm buổi học mới"}
                </h3>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Ngày học *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Giờ học *
                  </label>
                  <select
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
                  >
                    <option value="">Chọn giờ học</option>
                    {timeSlots.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Chủ đề bài học *
                  </label>
                  <input
                    type="text"
                    name="topic"
                    value={formData.topic}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
                    placeholder="Ví dụ: Listening Part 1-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Ghi chú
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
                    placeholder="Ghi chú về buổi học..."
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-main border border-transparent rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <Save className="h-4 w-4" />
                    {isSubmitting ? "Đang lưu..." : "Lưu"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
    </div>
  );
}