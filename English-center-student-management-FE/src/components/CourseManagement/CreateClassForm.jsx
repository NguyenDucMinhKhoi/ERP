import React, { useState } from "react";
import { X, Save, BookOpen, User, Calendar, MapPin, Users } from "lucide-react";

// Constants
const daysOfWeek = [
  { value: "monday", label: "Thứ 2" },
  { value: "tuesday", label: "Thứ 3" },
  { value: "wednesday", label: "Thứ 4" },
  { value: "thursday", label: "Thứ 5" },
  { value: "friday", label: "Thứ 6" },
  { value: "saturday", label: "Thứ 7" },
  { value: "sunday", label: "Chủ nhật" }
];

const timeSlots = [
  "06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30",
  "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
  "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"
];

// Temporary data - replace with API calls
const dummyCourses = [
  { id: 1, ten: "Tiếng Anh Cơ Bản" },
  { id: 2, ten: "Tiếng Anh Nâng Cao" },
  { id: 3, ten: "IELTS Preparation" },
  { id: 4, ten: "TOEIC Intensive" }
];

const dummyTeachers = [
  { id: 1, ten: "Nguyễn Văn A" },
  { id: 2, ten: "Trần Thị B" },
  { id: 3, ten: "Lê Văn C" },
  { id: 4, ten: "Phạm Thị D" }
];

export default function CreateClassForm({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    courseId: "",
    teacherId: "",
    startDate: "",
    endDate: "",
    room: "",
    maxStudents: "",
    status: "Chờ mở lớp",
    schedule: [],
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleScheduleChange = (index, field, value) => {
    const newSchedule = [...formData.schedule];
    newSchedule[index] = { ...newSchedule[index], [field]: value };
    setFormData((prev) => ({
      ...prev,
      schedule: newSchedule,
    }));
  };

  const addScheduleItem = () => {
    setFormData((prev) => ({
      ...prev,
      schedule: [...prev.schedule, { day: "", time: "" }],
    }));
  };

  const removeScheduleItem = (index) => {
    const newSchedule = formData.schedule.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      schedule: newSchedule,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Tên lớp là bắt buộc";
    }

    if (!formData.courseId) {
      newErrors.courseId = "Khóa học là bắt buộc";
    }

    if (!formData.teacherId) {
      newErrors.teacherId = "Giáo viên là bắt buộc";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Ngày bắt đầu là bắt buộc";
    }

    if (!formData.endDate) {
      newErrors.endDate = "Ngày kết thúc là bắt buộc";
    }

    if (!formData.room.trim()) {
      newErrors.room = "Phòng học là bắt buộc";
    }

    if (!formData.maxStudents || formData.maxStudents < 1) {
      newErrors.maxStudents = "Số học viên tối đa phải lớn hơn 0";
    }

    if (formData.schedule.length === 0) {
      newErrors.schedule = "Lịch học là bắt buộc";
    }

    // Validate schedule items
    formData.schedule.forEach((item, index) => {
      if (!item.day) {
        newErrors[`schedule_${index}_day`] = "Ngày học là bắt buộc";
      }
      if (!item.time) {
        newErrors[`schedule_${index}_time`] = "Giờ học là bắt buộc";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In real app, this would be an API call
      console.log("Creating class:", formData);

      onSuccess();
    } catch (error) {
      console.error("Error creating class:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900">
            Tạo lớp học mới
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-slate-900 flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Thông tin cơ bản
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Tên lớp *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent ${
                    errors.name ? "border-red-300" : "border-slate-300"
                  }`}
                  placeholder="Ví dụ: TOEIC-A1"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Khóa học *
                </label>
                <select
                  name="courseId"
                  value={formData.courseId}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent ${
                    errors.courseId ? "border-red-300" : "border-slate-300"
                  }`}
                >
                  <option value="">Chọn khóa học</option>
                  {dummyCourses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.name}
                    </option>
                  ))}
                </select>
                {errors.courseId && (
                  <p className="mt-1 text-sm text-red-600">{errors.courseId}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Giáo viên *
                </label>
                <select
                  name="teacherId"
                  value={formData.teacherId}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent ${
                    errors.teacherId ? "border-red-300" : "border-slate-300"
                  }`}
                >
                  <option value="">Chọn giáo viên</option>
                  {dummyTeachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </option>
                  ))}
                </select>
                {errors.teacherId && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.teacherId}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Phòng học *
                </label>
                <input
                  type="text"
                  name="room"
                  value={formData.room}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent ${
                    errors.room ? "border-red-300" : "border-slate-300"
                  }`}
                  placeholder="Ví dụ: Phòng A101"
                />
                {errors.room && (
                  <p className="mt-1 text-sm text-red-600">{errors.room}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Ngày bắt đầu *
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent ${
                    errors.startDate ? "border-red-300" : "border-slate-300"
                  }`}
                />
                {errors.startDate && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.startDate}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Ngày kết thúc *
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent ${
                    errors.endDate ? "border-red-300" : "border-slate-300"
                  }`}
                />
                {errors.endDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Số học viên tối đa *
                </label>
                <input
                  type="number"
                  name="maxStudents"
                  value={formData.maxStudents}
                  onChange={handleChange}
                  min="1"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent ${
                    errors.maxStudents ? "border-red-300" : "border-slate-300"
                  }`}
                  placeholder="20"
                />
                {errors.maxStudents && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.maxStudents}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-slate-900 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Lịch học
              </h3>
              <button
                type="button"
                onClick={addScheduleItem}
                className="text-sm text-primary-main hover:text-primary-dark font-medium cursor-pointer"
              >
                + Thêm buổi học
              </button>
            </div>

            {formData.schedule.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg"
              >
                <div className="flex-1">
                  <select
                    value={item.day}
                    onChange={(e) =>
                      handleScheduleChange(index, "day", e.target.value)
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent ${
                      errors[`schedule_${index}_day`]
                        ? "border-red-300"
                        : "border-slate-300"
                    }`}
                  >
                    <option value="">Chọn ngày</option>
                    {daysOfWeek.map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                  {errors[`schedule_${index}_day`] && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors[`schedule_${index}_day`]}
                    </p>
                  )}
                </div>

                <div className="flex-1">
                  <select
                    value={item.time}
                    onChange={(e) =>
                      handleScheduleChange(index, "time", e.target.value)
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent ${
                      errors[`schedule_${index}_time`]
                        ? "border-red-300"
                        : "border-slate-300"
                    }`}
                  >
                    <option value="">Chọn giờ</option>
                    {timeSlots.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                  {errors[`schedule_${index}_time`] && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors[`schedule_${index}_time`]}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => removeScheduleItem(index)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}

            {errors.schedule && (
              <p className="text-sm text-red-600">{errors.schedule}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 focus:ring-2 focus:ring-primary-main focus:border-transparent cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-main border border-transparent rounded-lg hover:bg-primary-dark focus:ring-2 focus:ring-primary-main focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <Save className="h-4 w-4" />
              {isSubmitting ? "Đang tạo..." : "Tạo lớp học"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
