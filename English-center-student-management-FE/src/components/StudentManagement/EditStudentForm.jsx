import React, { useState, useEffect } from "react";
import {
  X,
  Save,
  User,
  Phone,
  Mail,
  MapPin,
  BookOpen,
  Calendar,
} from "lucide-react";
import { courseOptions, statusOptions, classOptions } from "./dummyData";

export default function EditStudentForm({ student, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    phone: "",
    email: "",
    address: "",
    learningNeeds: "",
    courseInterest: "",
    status: "Chờ lớp",
    class: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (student) {
      setFormData({
        fullName: student.fullName || "",
        dateOfBirth: student.dateOfBirth || "",
        phone: student.phone || "",
        email: student.email || "",
        address: student.address || "",
        learningNeeds: student.learningNeeds || "",
        courseInterest: student.courseInterest || "",
        status: student.status || "Chờ lớp",
        class: student.class || "",
        notes: student.notes || "",
      });
    }
  }, [student]);

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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Tên học viên là bắt buộc";
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Ngày sinh là bắt buộc";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Số điện thoại là bắt buộc";
    } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email là bắt buộc";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.courseInterest) {
      newErrors.courseInterest = "Khóa học quan tâm là bắt buộc";
    }

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
      console.log("Updating student:", { id: student.id, ...formData });

      onSuccess();
    } catch (error) {
      console.error("Error updating student:", error);
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
            Cập nhật thông tin học viên
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
              <User className="h-5 w-5" />
              Thông tin cơ bản
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Họ và tên *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent ${
                    errors.fullName ? "border-red-300" : "border-slate-300"
                  }`}
                  placeholder="Nhập họ và tên"
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Ngày sinh *
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent ${
                    errors.dateOfBirth ? "border-red-300" : "border-slate-300"
                  }`}
                />
                {errors.dateOfBirth && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.dateOfBirth}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Số điện thoại *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent ${
                    errors.phone ? "border-red-300" : "border-slate-300"
                  }`}
                  placeholder="0901234567"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent ${
                    errors.email ? "border-red-300" : "border-slate-300"
                  }`}
                  placeholder="example@gmail.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Địa chỉ
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
                placeholder="Nhập địa chỉ"
              />
            </div>
          </div>

          {/* Learning Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-slate-900 flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Thông tin học tập
            </h3>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Nhu cầu học
              </label>
              <input
                type="text"
                name="learningNeeds"
                value={formData.learningNeeds}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
                placeholder="Ví dụ: Giao tiếp cơ bản, IELTS Academic, Business English"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Khóa học quan tâm *
                </label>
                <select
                  name="courseInterest"
                  value={formData.courseInterest}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent ${
                    errors.courseInterest
                      ? "border-red-300"
                      : "border-slate-300"
                  }`}
                >
                  <option value="">Chọn khóa học</option>
                  {courseOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.courseInterest && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.courseInterest}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Trạng thái
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Lớp học
              </label>
              <select
                name="class"
                value={formData.class}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
              >
                <option value="">Chọn lớp học</option>
                {classOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
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
                placeholder="Ghi chú về học viên..."
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 focus:ring-2 focus:ring-primary-main focus:border-transparent"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-main border border-transparent rounded-lg hover:bg-primary-dark focus:ring-2 focus:ring-primary-main focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4" />
              {isSubmitting ? "Đang cập nhật..." : "Cập nhật"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
