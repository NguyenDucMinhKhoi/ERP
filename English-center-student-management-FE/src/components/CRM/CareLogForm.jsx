import React, { useState } from 'react';
import { 
  X, 
  Save, 
  Phone, 
  Mail, 
  MessageSquare, 
  FileText,
  Calendar,
  User
} from 'lucide-react';

export default function CareLogForm({ 
  isOpen, 
  onClose, 
  studentId, 
  studentName,
  onSave 
}) {
  const [formData, setFormData] = useState({
    loai_cham_soc: 'tuvan',
    noi_dung: '',
    trang_thai: 'moi',
    ghi_chu: ''
  });
  const [loading, setLoading] = useState(false);

  const careTypes = [
    { value: 'tuvan', label: 'Tư vấn', icon: MessageSquare, color: 'text-info' },
    { value: 'theodoi', label: 'Theo dõi', icon: Phone, color: 'text-primary' },
    { value: 'hoidap', label: 'Hỏi đáp', icon: Mail, color: 'text-success' },
    { value: 'khac', label: 'Khác', icon: FileText, color: 'text-slate-500' }
  ];

  const statusOptions = [
    { value: 'moi', label: 'Mới', color: 'bg-info' },
    { value: 'dang_xu_ly', label: 'Đang xử lý', color: 'bg-warning' },
    { value: 'hoan_thanh', label: 'Hoàn thành', color: 'bg-success' },
    { value: 'dong', label: 'Đóng', color: 'bg-slate-500' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.noi_dung.trim()) {
      alert('Vui lòng nhập nội dung chăm sóc');
      return;
    }

    setLoading(true);
    
    try {
      // Mock API call - sẽ thay thế bằng API thực
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const careLogData = {
        ...formData,
        hocvien_id: studentId,
        ngay: new Date().toISOString()
      };
      
      onSave(careLogData);
      handleClose();
    } catch (error) {
      console.error('Error saving care log:', error);
      alert('Có lỗi xảy ra khi lưu thông tin chăm sóc');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      loai_cham_soc: 'tuvan',
      noi_dung: '',
      trang_thai: 'moi',
      ghi_chu: ''
    });
    onClose();
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-semibold text-slate-800">Thêm Chăm Sóc Học Viên</h2>
            <p className="text-slate-600 mt-1">Học viên: {studentName}</p>
          </div>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Care Type */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Loại Chăm Sóc *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {careTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => handleInputChange('loai_cham_soc', type.value)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      formData.loai_cham_soc === type.value
                        ? 'border-primary-main bg-primary-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <Icon className={`h-5 w-5 mx-auto mb-2 ${type.color}`} />
                    <span className="text-sm font-medium">{type.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Nội Dung Chăm Sóc *
            </label>
            <textarea
              rows={4}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
              placeholder="Mô tả chi tiết về cuộc gọi, email hoặc tương tác với học viên..."
              value={formData.noi_dung}
              onChange={(e) => handleInputChange('noi_dung', e.target.value)}
              required
            />
            <p className="text-xs text-slate-500 mt-1">
              Ghi chú: Không được để trống nội dung chăm sóc
            </p>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Trạng Thái
            </label>
            <select
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
              value={formData.trang_thai}
              onChange={(e) => handleInputChange('trang_thai', e.target.value)}
            >
              {statusOptions.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Ghi Chú Thêm
            </label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
              placeholder="Ghi chú bổ sung (không bắt buộc)..."
              value={formData.ghi_chu}
              onChange={(e) => handleInputChange('ghi_chu', e.target.value)}
            />
          </div>

          {/* Business Rule Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="h-5 w-5 text-blue-500 mt-0.5">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-medium text-blue-800">Quy Tắc Kinh Doanh</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Nhân viên phải ghi chú mỗi lần liên hệ với học viên. 
                  Nội dung chăm sóc không được để trống để đảm bảo chất lượng dịch vụ.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={handleClose}
              className="btn btn-outline"
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="btn btn-primary flex items-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Save className="h-4 w-4" />
              )}
              {loading ? 'Đang lưu...' : 'Lưu Chăm Sóc'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
