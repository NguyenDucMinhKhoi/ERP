import React, { useState, useEffect } from "react";
import { X, Save } from "lucide-react";

export default function CreateCourseForm({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    duration: "",
    price: "",
    level: "Cơ bản",
    maxStudents: "",
    requirements: "",
    curriculum: "",
  });

  // Prevent scroll on background
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Handle form submission
    console.log("Form submitted:", formData);
    onSuccess();
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
            <div className="grid grid-cols-1 gap-6">
              {/* Tên khóa học */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Tên khóa học
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
                  placeholder="VD: TOEIC 450-650"
                />
              </div>

              {/* Mô tả */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Mô tả
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
                  placeholder="Mô tả chi tiết về khóa học"
                />
              </div>

              {/* Thời lượng và Học phí */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Thời lượng
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
                    placeholder="VD: 3 tháng"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Học phí
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
                    placeholder="VD: 2,500,000 VNĐ"
                  />
                </div>
              </div>

              {/* Trình độ và Số lượng tối đa */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Trình độ
                  </label>
                  <select
                    value={formData.level}
                    onChange={(e) =>
                      setFormData({ ...formData, level: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
                  >
                    <option value="Cơ bản">Cơ bản</option>
                    <option value="Trung cấp">Trung cấp</option>
                    <option value="Cao cấp">Cao cấp</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Số học viên tối đa
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.maxStudents}
                    onChange={(e) =>
                      setFormData({ ...formData, maxStudents: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
                    placeholder="VD: 20"
                  />
                </div>
              </div>

              {/* Yêu cầu đầu vào */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Yêu cầu đầu vào
                </label>
                <textarea
                  value={formData.requirements}
                  onChange={(e) =>
                    setFormData({ ...formData, requirements: e.target.value })
                  }
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
                  placeholder="VD: Trình độ tiếng Anh cơ bản"
                />
              </div>

              {/* Giáo trình */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Giáo trình
                </label>
                <input
                  type="text"
                  value={formData.curriculum}
                  onChange={(e) =>
                    setFormData({ ...formData, curriculum: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
                  placeholder="VD: Oxford English File Intermediate"
                />
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer"
          >
            Hủy
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-main border border-transparent rounded-lg hover:bg-primary-dark cursor-pointer"
          >
            <Save className="h-4 w-4" />
            Tạo khóa học
          </button>
        </div>
      </div>
    </div>
  );
}