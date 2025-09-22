import React, { useState } from "react";
import {
  X,
  User,
  Mail,
  Phone,
  Calendar,
  GraduationCap,
  CheckCircle,
} from "lucide-react";

export default function AddStudentModal({ isOpen, onClose, onAddStudent }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    studentId: "",
    joinDate: new Date().toISOString().split("T")[0],
    selectedClasses: [],
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Dữ liệu giả cho các lớp học có sẵn
  const availableClasses = [
    {
      id: 1,
      name: "IELTS Foundation A1",
      level: "A1",
      schedule: "Thứ 2,4,6 - 18:00-20:00",
      maxStudents: 20,
      currentStudents: 15,
    },
    {
      id: 2,
      name: "TOEIC Intermediate B1",
      level: "B1",
      schedule: "Thứ 3,5,7 - 19:00-21:00",
      maxStudents: 18,
      currentStudents: 18,
    },
    {
      id: 3,
      name: "IELTS Advanced C1",
      level: "C1",
      schedule: "Thứ 2,4,6 - 17:00-19:00",
      maxStudents: 15,
      currentStudents: 12,
    },
    {
      id: 4,
      name: "TOEIC Basic A2",
      level: "A2",
      schedule: "Thứ 3,5 - 18:30-20:30",
      maxStudents: 20,
      currentStudents: 16,
    },
    {
      id: 5,
      name: "IELTS Speaking & Writing",
      level: "B2",
      schedule: "Chủ nhật - 14:00-17:00",
      maxStudents: 12,
      currentStudents: 8,
    },
    {
      id: 6,
      name: "TOEIC Listening & Reading",
      level: "B1",
      schedule: "Thứ 2,4 - 19:30-21:30",
      maxStudents: 18,
      currentStudents: 14,
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClassToggle = (classId) => {
    setFormData((prev) => ({
      ...prev,
      selectedClasses: prev.selectedClasses.includes(classId)
        ? prev.selectedClasses.filter((id) => id !== classId)
        : [...prev.selectedClasses, classId],
    }));
  };

  const generateStudentId = () => {
    const randomNum = Math.floor(Math.random() * 9000) + 1000;
    return `HV${randomNum}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const newStudent = {
      id: Date.now(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      studentId: formData.studentId || generateStudentId(),
      joinDate: formData.joinDate,
      status: "active",
      attendance: 100,
      paymentStatus: "pending",
      lastClass: formData.joinDate,
      selectedClasses: formData.selectedClasses,
      notes: formData.notes,
    };

    // Call parent callback
    onAddStudent(newStudent);

    // Show success message
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      handleClose();
    }, 2000);
  };

  const handleClose = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      studentId: "",
      joinDate: new Date().toISOString().split("T")[0],
      selectedClasses: [],
      notes: "",
    });
    setShowSuccess(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <User className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Thêm Học Viên Mới
              </h2>
              <p className="text-sm text-gray-600">
                Nhập thông tin học viên và chọn lớp học
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 mx-6 mt-4">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
              <p className="text-green-700 font-medium">
                Thêm học viên thành công!
              </p>
            </div>
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Thông tin cá nhân */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Thông tin cá nhân
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Họ và tên *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Nhập họ và tên"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số điện thoại *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="0901234567"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mã học viên
                </label>
                <input
                  type="text"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Để trống để tự động tạo"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Để trống để hệ thống tự động tạo mã học viên
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày nhập học *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="date"
                    name="joinDate"
                    value={formData.joinDate}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Chọn lớp học */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Chọn lớp học
              </h3>

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {availableClasses.map((classItem) => {
                  const isSelected = formData.selectedClasses.includes(
                    classItem.id
                  );
                  const isFull =
                    classItem.currentStudents >= classItem.maxStudents;

                  return (
                    <div
                      key={classItem.id}
                      className={`border rounded-lg p-3 cursor-pointer transition-all ${
                        isSelected
                          ? "border-green-500 bg-green-50"
                          : isFull
                          ? "border-gray-200 bg-gray-50 cursor-not-allowed"
                          : "border-gray-200 hover:border-green-300"
                      }`}
                      onClick={() => !isFull && handleClassToggle(classItem.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-gray-900">
                              {classItem.name}
                            </h4>
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              {classItem.level}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            {classItem.schedule}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>
                              Học viên: {classItem.currentStudents}/
                              {classItem.maxStudents}
                            </span>
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                isFull
                                  ? "bg-red-100 text-red-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {isFull ? "Đã đầy" : "Còn chỗ"}
                            </span>
                          </div>
                        </div>
                        <div className="ml-3">
                          {isSelected && (
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                              <CheckCircle className="h-4 w-4 text-white" />
                            </div>
                          )}
                          {!isSelected && !isFull && (
                            <div className="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {formData.selectedClasses.length === 0 && (
                <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                  Vui lòng chọn ít nhất một lớp học cho học viên
                </p>
              )}

              {/* Ghi chú */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ghi chú
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Ghi chú thêm về học viên..."
                />
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Hủy
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting || formData.selectedClasses.length === 0}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Đang thêm...
              </>
            ) : (
              <>
                <GraduationCap className="h-4 w-4" />
                Thêm học viên
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
