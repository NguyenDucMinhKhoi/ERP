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
import crmService from "../../services/crmService";
import courseService from "../../services/courseService";

// Options for dropdowns
const statusOptions = [
  { value: "chuadong", label: "Chưa đóng" },
  { value: "dadong", label: "Đã đóng" },
  { value: "conno", label: "Còn nợ" },
  { value: "tamdung", label: "Tạm dừng" },
  { value: "hoanthanh", label: "Hoàn thành" },
  { value: "danghi", label: "Đã nghỉ" },
];

export default function EditStudentForm({ student, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    ten: "",
    ngay_sinh: "",
    sdt: "",
    email: "",
    address: "",
    nhu_cau_hoc: "",
    khoa_hoc_quan_tam: "",
    trang_thai_hoc_phi: "chuadong",
    lop_hoc: "",
    ghi_chu: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [courses, setCourses] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingClasses, setLoadingClasses] = useState(true);

  // Ngăn scroll khi mở popup
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  // Load courses from API
  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoadingCourses(true);
        const response = await courseService.getCourses();
        setCourses(response.results || response || []);
      } catch (err) {
        console.error("Error loading courses:", err);
      } finally {
        setLoadingCourses(false);
      }
    };

    loadCourses();
  }, []);

  // Load classes from API
  useEffect(() => {
    const loadClasses = async () => {
      try {
        setLoadingClasses(true);
        const response = await courseService.getClasses();
        setClasses(response.results || response || []);
      } catch (err) {
        console.error("Error loading classes:", err);
      } finally {
        setLoadingClasses(false);
      }
    };

    loadClasses();
  }, []);

  // Populate form with student data
  useEffect(() => {
    if (student) {
      setFormData({
        ten: student.ten || "",
        ngay_sinh: student.ngay_sinh || "",
        sdt: student.sdt || "",
        email: student.email || "",
        address: student.address || "",
        nhu_cau_hoc: student.nhu_cau_hoc || "",
        khoa_hoc_quan_tam: student.khoa_hoc_quan_tam || "",
        trang_thai_hoc_phi: student.trang_thai_hoc_phi || "chuadong",
        lop_hoc: student.lop_hoc || "",
        ghi_chu: student.ghi_chu || "",
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

    if (!formData.ten.trim()) {
      newErrors.ten = "Tên học viên là bắt buộc";
    }

    if (!formData.ngay_sinh) {
      newErrors.ngay_sinh = "Ngày sinh là bắt buộc";
    }

    if (!formData.sdt.trim()) {
      newErrors.sdt = "Số điện thoại là bắt buộc";
    } else if (!/^[0-9]{10,11}$/.test(formData.sdt.replace(/\s/g, ""))) {
      newErrors.sdt = "Số điện thoại không hợp lệ";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email là bắt buộc";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
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
      // Update student via crmService with auto refresh token
      const studentData = {
        ten: formData.ten,
        ngay_sinh: formData.ngay_sinh,
        sdt: formData.sdt,
        email: formData.email,
        address: formData.address,
        nhu_cau_hoc: formData.nhu_cau_hoc,
        khoa_hoc_quan_tam: formData.khoa_hoc_quan_tam,
        trang_thai_hoc_phi: formData.trang_thai_hoc_phi,
        lop_hoc: formData.lop_hoc,
        ghi_chu: formData.ghi_chu,
      };

      await crmService.updateStudent(student.id, studentData);
      onSuccess();
    } catch (error) {
      console.error("Error updating student:", error);
      setErrors({
        submit: "Có lỗi xảy ra khi cập nhật học viên. Vui lòng thử lại.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 ">
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

        {/* Form - Scrollable area */}
        <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] ">
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
                    name="ten"
                    value={formData.ten}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent ${
                      errors.ten ? "border-red-300" : "border-slate-300"
                    }`}
                    placeholder="Nhập họ và tên"
                  />
                  {errors.ten && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.ten}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Ngày sinh *
                  </label>
                  <input
                    type="date"
                    name="ngay_sinh"
                    value={formData.ngay_sinh}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent ${
                      errors.ngay_sinh ? "border-red-300" : "border-slate-300"
                    }`}
                  />
                  {errors.ngay_sinh && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.ngay_sinh}
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
                    name="sdt"
                    value={formData.sdt}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent ${
                      errors.sdt ? "border-red-300" : "border-slate-300"
                    }`}
                    placeholder="0901234567"
                  />
                  {errors.sdt && (
                    <p className="mt-1 text-sm text-red-600">{errors.sdt}</p>
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
                  name="nhu_cau_hoc"
                  value={formData.nhu_cau_hoc}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
                  placeholder="Ví dụ: Giao tiếp cơ bản, IELTS Academic, Business English"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Khóa học quan tâm
                  </label>
                  <select
                    name="khoa_hoc_quan_tam"
                    value={formData.khoa_hoc_quan_tam}
                    onChange={handleChange}
                    disabled={loadingCourses}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
                  >
                    <option value="">
                      {loadingCourses ? "Đang tải..." : "Chọn khóa học"}
                    </option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.ten}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Trạng thái
                  </label>
                  <select
                    name="trang_thai_hoc_phi"
                    value={formData.trang_thai_hoc_phi}
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
                  name="lop_hoc"
                  value={formData.lop_hoc}
                  onChange={handleChange}
                  disabled={loadingClasses}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
                >
                  <option value="">
                    {loadingClasses ? "Đang tải..." : "Chọn lớp học"}
                  </option>
                  {classes.map((classItem) => (
                    <option key={classItem.id} value={classItem.id}>
                      {classItem.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Ghi chú
                </label>
                <textarea
                  name="ghi_chu"
                  value={formData.ghi_chu}
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
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 focus:ring-2 focus:ring-primary-main focus:border-transparent interactive-button"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-main border border-transparent rounded-lg hover:bg-primary-dark focus:ring-2 focus:ring-primary-main focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed interactive-button"
              >
                <Save className="h-4 w-4" />
                {isSubmitting ? "Đang cập nhật..." : "Cập nhật"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
