import React, { useState, useEffect } from "react";
import { X, Save } from "lucide-react";
import courseService from "../../services/courseService";

export default function CreateCourseForm({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    ten: "",
    mo_ta: "",
    lich_hoc: "",
    hoc_phi: "",
    so_buoi: "",
    giang_vien: "",
    trang_thai: "mo",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Prevent scroll on background
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const courseData = {
        ten: formData.ten,
        mo_ta: formData.mo_ta,
        lich_hoc: formData.lich_hoc,
        hoc_phi: parseFloat(formData.hoc_phi) || 0,
        so_buoi: parseInt(formData.so_buoi) || 1,
        giang_vien: formData.giang_vien,
        trang_thai: formData.trang_thai,
      };

      await courseService.createCourse(courseData);
      onSuccess();
    } catch (err) {
      console.error("Error creating course:", err);
      setError("Có lỗi xảy ra khi tạo khóa học. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Tạo khóa học mới
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Điền thông tin để tạo khóa học mới
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
            
            <div className="grid grid-cols-1 gap-6">
              {/* Tên khóa học */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Tên khóa học
                </label>
                <input
                  type="text"
                  required
                  value={formData.ten}
                  onChange={(e) =>
                    setFormData({ ...formData, ten: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
                  placeholder="VD: IELTS 5.0-6.0"
                />
              </div>

              {/* Mô tả */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Mô tả
                </label>
                <textarea
                  value={formData.mo_ta}
                  onChange={(e) =>
                    setFormData({ ...formData, mo_ta: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
                  placeholder="Mô tả chi tiết về khóa học"
                />
              </div>

              {/* Lịch học và Học phí */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Lịch học
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.lich_hoc}
                    onChange={(e) =>
                      setFormData({ ...formData, lich_hoc: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
                    placeholder="VD: Thứ 2,4,6 - 19:00-21:00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Học phí (VNĐ)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.hoc_phi}
                    onChange={(e) =>
                      setFormData({ ...formData, hoc_phi: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
                    placeholder="VD: 2500000"
                  />
                </div>
              </div>

              {/* Giảng viên và Số buổi */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Giảng viên
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.giang_vien}
                    onChange={(e) =>
                      setFormData({ ...formData, giang_vien: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
                    placeholder="VD: Cô Mai"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Số buổi học
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.so_buoi}
                    onChange={(e) =>
                      setFormData({ ...formData, so_buoi: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
                    placeholder="VD: 48"
                  />
                </div>
              </div>

              {/* Trạng thái */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Trạng thái
                </label>
                <select
                  value={formData.trang_thai}
                  onChange={(e) =>
                    setFormData({ ...formData, trang_thai: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
                >
                  <option value="mo">Đang mở</option>
                  <option value="dong">Đã đóng</option>
                  <option value="hoan_thanh">Hoàn thành</option>
                </select>
             a </div>

            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            Hủy
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-main border border-transparent rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <Save className="h-4 w-4" />
            {isSubmitting ? "Đang tạo..." : "Tạo khóa học"}
          </button>
        </div>
      </div>
    </div>
  );
}