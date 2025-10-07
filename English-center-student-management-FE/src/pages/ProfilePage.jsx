import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Calendar, Shield } from 'lucide-react';
import authService from '../services/authService';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const userData = await authService.getMe();
      setUser(userData);
    } catch (err) {
      setError('Không thể tải thông tin người dùng');
      console.error('Load profile error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getRoleDisplayName = (role) => {
    const roleNames = {
      'admin': 'Quản trị viên',
      'giangvien': 'Giảng viên',
      'academic_staff': 'Nhân viên Học vụ',
      'sales_staff': 'Nhân viên Tư vấn',
      'finance_staff': 'Nhân viên Tài chính'
    };
    return roleNames[role] || role;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 bg-blue-500 rounded-full flex items-center justify-center">
              <User size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {user?.first_name} {user?.last_name}
              </h1>
              <p className="text-gray-600">@{user?.username}</p>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Thông tin cá nhân
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User size={20} className="text-gray-400" />
                <div>
                  <label className="text-sm font-medium text-gray-700">Tên đăng nhập</label>
                  <p className="text-gray-900">{user?.username}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail size={20} className="text-gray-400" />
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <p className="text-gray-900">{user?.email || 'Chưa cập nhật'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Shield size={20} className="text-gray-400" />
                <div>
                  <label className="text-sm font-medium text-gray-700">Vai trò</label>
                  <p className="text-gray-900">{getRoleDisplayName(user?.role)}</p>
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar size={20} className="text-gray-400" />
                <div>
                  <label className="text-sm font-medium text-gray-700">Ngày tham gia</label>
                  <p className="text-gray-900">
                    {user?.date_joined ? new Date(user.date_joined).toLocaleDateString('vi-VN') : 'N/A'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar size={20} className="text-gray-400" />
                <div>
                  <label className="text-sm font-medium text-gray-700">Lần đăng nhập cuối</label>
                  <p className="text-gray-900">
                    {user?.last_login ? new Date(user.last_login).toLocaleDateString('vi-VN') : 'Chưa có'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${user?.is_active ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Trạng thái</label>
                  <p className="text-gray-900">{user?.is_active ? 'Hoạt động' : 'Tạm khóa'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                Chỉnh sửa thông tin
              </button>
              <button className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors">
                Đổi mật khẩu
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}