import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft,
  User,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Edit,
  History
} from 'lucide-react';

export default function StudentProfile() {
  const [student, setStudent] = useState(null);
  const [careLogs, setCareLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [, setShowAddCareLog] = useState(false);

  // Mock data - sẽ thay thế bằng API call
  useEffect(() => {
    const mockStudent = {
      id: '1',
      ten: 'Nguyễn Văn An',
      email: 'an.nguyen@email.com',
      sdt: '0901234567',
      ngay_sinh: '1995-03-15',
      trang_thai_hoc_phi: 'dadong',
      co_tai_khoan: true,
      ghi_chu: 'Học viên tích cực, tham gia đầy đủ các buổi học',
      created_at: '2024-01-15T10:30:00Z'
    };

    const mockCareLogs = [
      {
        id: '1',
        loai_cham_soc: 'tuvan',
        noi_dung: 'Tư vấn về khóa học IELTS Advanced, học viên quan tâm đến lịch học buổi tối',
        ngay: '2024-01-20T14:30:00Z',
        trang_thai: 'hoan_thanh',
        nhanvien_ten: 'Nguyễn Thị Lan'
      },
      {
        id: '2',
        loai_cham_soc: 'theodoi',
        noi_dung: 'Theo dõi tiến độ học tập, học viên đạt điểm số tốt trong bài kiểm tra',
        ngay: '2024-01-18T10:15:00Z',
        trang_thai: 'hoan_thanh',
        nhanvien_ten: 'Trần Văn Minh'
      },
      {
        id: '3',
        loai_cham_soc: 'hoidap',
        noi_dung: 'Học viên hỏi về lịch thi IELTS, cần thông tin về địa điểm thi',
        ngay: '2024-01-16T16:45:00Z',
        trang_thai: 'dang_xu_ly',
        nhanvien_ten: 'Lê Thị Hoa'
      }
    ];

    setTimeout(() => {
      setStudent(mockStudent);
      setCareLogs(mockCareLogs);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusBadge = (status) => {
    const statusConfig = {
      'dadong': { label: 'Đã đóng', color: 'bg-success text-white' },
      'conno': { label: 'Còn nợ', color: 'bg-warning text-white' },
      'chuadong': { label: 'Chưa đóng', color: 'bg-error text-white' }
    };
    
    const config = statusConfig[status] || statusConfig['chuadong'];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getCareTypeLabel = (type) => {
    const typeConfig = {
      'tuvan': 'Tư vấn',
      'theodoi': 'Theo dõi',
      'hoidap': 'Hỏi đáp',
      'khac': 'Khác'
    };
    return typeConfig[type] || 'Khác';
  };

  const getCareStatusBadge = (status) => {
    const statusConfig = {
      'moi': { label: 'Mới', color: 'bg-info text-white' },
      'dang_xu_ly': { label: 'Đang xử lý', color: 'bg-warning text-white' },
      'hoan_thanh': { label: 'Hoàn thành', color: 'bg-success text-white' },
      'dong': { label: 'Đóng', color: 'bg-slate-500 text-white' }
    };
    
    const config = statusConfig[status] || statusConfig['moi'];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-main"></div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
        <p className="text-slate-500">Không tìm thấy thông tin học viên</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button className="btn btn-outline">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Hồ Sơ Học Viên</h1>
          <p className="text-slate-600 mt-1">Thông tin chi tiết và lịch sử chăm sóc</p>
        </div>
      </div>

      {/* Student Info Card */}
      <div className="card p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar and Basic Info */}
          <div className="flex flex-col items-center md:items-start">
            <div className="h-24 w-24 rounded-full bg-primary-main flex items-center justify-center text-white text-2xl font-bold mb-4">
              {student.ten.split(' ').pop().charAt(0)}
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">{student.ten}</h2>
            <div className="flex items-center gap-2 mb-2">
              {getStatusBadge(student.trang_thai_hoc_phi)}
              {student.co_tai_khoan && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success text-white">
                  Có tài khoản
                </span>
              )}
            </div>
          </div>

          {/* Contact Info */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-slate-400" />
                <div>
                  <p className="text-sm text-slate-600">Email</p>
                  <p className="font-medium">{student.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-slate-400" />
                <div>
                  <p className="text-sm text-slate-600">Số điện thoại</p>
                  <p className="font-medium">{student.sdt}</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-slate-400" />
                <div>
                  <p className="text-sm text-slate-600">Ngày sinh</p>
                  <p className="font-medium">
                    {new Date(student.ngay_sinh).toLocaleDateString('vi-VN')} ({calculateAge(student.ngay_sinh)} tuổi)
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-slate-400" />
                <div>
                  <p className="text-sm text-slate-600">Ngày tạo</p>
                  <p className="font-medium">{formatDateTime(student.created_at)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2">
            <button className="btn btn-primary">
              <Edit className="h-4 w-4" />
              Chỉnh Sửa
            </button>
            <button className="btn btn-outline">
              <MessageSquare className="h-4 w-4" />
              Gửi Tin Nhắn
            </button>
          </div>
        </div>

        {/* Notes */}
        {student.ghi_chu && (
          <div className="mt-6 pt-6 border-t border-slate-200">
            <h3 className="text-sm font-medium text-slate-700 mb-2">Ghi chú</h3>
            <p className="text-slate-600">{student.ghi_chu}</p>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Tổng Quan', icon: User },
            { id: 'care', label: 'Chăm Sóc', icon: MessageSquare },
            { id: 'history', label: 'Lịch Sử', icon: History }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary-main text-primary-main'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Quick Stats */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4">Thống Kê Nhanh</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Số lần chăm sóc</span>
                <span className="font-semibold">{careLogs.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Lần cuối chăm sóc</span>
                <span className="font-semibold">
                  {careLogs.length > 0 ? formatDateTime(careLogs[0].ngay) : 'Chưa có'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Trạng thái học phí</span>
                {getStatusBadge(student.trang_thai_hoc_phi)}
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-4">Hoạt Động Gần Đây</h3>
            <div className="space-y-3">
              {careLogs.slice(0, 3).map((log) => (
                <div key={log.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                  <div className="h-2 w-2 rounded-full bg-primary-main mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{getCareTypeLabel(log.loai_cham_soc)}</p>
                    <p className="text-xs text-slate-600">{formatDateTime(log.ngay)}</p>
                  </div>
                  {getCareStatusBadge(log.trang_thai)}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'care' && (
        <div className="space-y-6">
          {/* Add Care Log Button */}
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Lịch Sử Chăm Sóc</h3>
            <button 
              onClick={() => setShowAddCareLog(true)}
              className="btn btn-primary"
            >
              <Plus className="h-4 w-4" />
              Thêm Chăm Sóc
            </button>
          </div>

          {/* Care Logs Timeline */}
          <div className="card p-6">
            <div className="space-y-6">
              {careLogs.map((log, index) => (
                <div key={log.id} className="relative">
                  {index !== careLogs.length - 1 && (
                    <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-slate-200"></div>
                  )}
                  <div className="flex items-start gap-4">
                    <div className="h-8 w-8 rounded-full bg-primary-main flex items-center justify-center text-white text-sm font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-slate-800">
                          {getCareTypeLabel(log.loai_cham_soc)}
                        </h4>
                        <div className="flex items-center gap-2">
                          {getCareStatusBadge(log.trang_thai)}
                          <span className="text-sm text-slate-500">
                            {formatDateTime(log.ngay)}
                          </span>
                        </div>
                      </div>
                      <p className="text-slate-600 mb-2">{log.noi_dung}</p>
                      <p className="text-sm text-slate-500">
                        Nhân viên: {log.nhanvien_ten}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-4">Lịch Sử Hoạt Động</h3>
          <div className="text-center py-8">
            <History className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-500">Chức năng đang được phát triển</p>
          </div>
        </div>
      )}
    </div>
  );
}
