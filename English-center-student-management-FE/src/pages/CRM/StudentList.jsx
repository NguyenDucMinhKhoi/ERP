import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Phone, 
  Mail,
  Calendar,
  DollarSign,
  UserCheck,
  AlertCircle
} from 'lucide-react';

export default function StudentList() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Mock data - sẽ thay thế bằng API call
  useEffect(() => {
    const mockStudents = [
      {
        id: '1',
        ten: 'Nguyễn Văn An',
        email: 'an.nguyen@email.com',
        sdt: '0901234567',
        ngay_sinh: '1995-03-15',
        trang_thai_hoc_phi: 'dadong',
        co_tai_khoan: true,
        created_at: '2024-01-15T10:30:00Z'
      },
      {
        id: '2',
        ten: 'Trần Thị Bình',
        email: 'binh.tran@email.com',
        sdt: '0901234568',
        ngay_sinh: '1998-07-22',
        trang_thai_hoc_phi: 'conno',
        co_tai_khoan: false,
        created_at: '2024-01-20T14:15:00Z'
      },
      {
        id: '3',
        ten: 'Lê Văn Cường',
        email: 'cuong.le@email.com',
        sdt: '0901234569',
        ngay_sinh: '1992-11-08',
        trang_thai_hoc_phi: 'chuadong',
        co_tai_khoan: true,
        created_at: '2024-01-25T09:45:00Z'
      }
    ];
    
    setTimeout(() => {
      setStudents(mockStudents);
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
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

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.ten.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.sdt.includes(searchTerm);
    const matchesStatus = !statusFilter || student.trang_thai_hoc_phi === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-main"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Danh Sách Học Viên</h1>
          <p className="text-slate-600 mt-1">Quản lý thông tin học viên và chăm sóc khách hàng</p>
        </div>
        <button className="btn btn-primary flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Thêm Học Viên
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Tổng Học Viên</p>
              <p className="text-2xl font-bold text-slate-800">{students.length}</p>
            </div>
            <Users className="h-8 w-8 text-primary-main" />
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Đã Đóng Phí</p>
              <p className="text-2xl font-bold text-success">
                {students.filter(s => s.trang_thai_hoc_phi === 'dadong').length}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-success" />
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Còn Nợ</p>
              <p className="text-2xl font-bold text-warning">
                {students.filter(s => s.trang_thai_hoc_phi === 'conno').length}
              </p>
            </div>
            <AlertCircle className="h-8 w-8 text-warning" />
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Có Tài Khoản</p>
              <p className="text-2xl font-bold text-info">
                {students.filter(s => s.co_tai_khoan).length}
              </p>
            </div>
            <UserCheck className="h-8 w-8 text-info" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, email, số điện thoại..."
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Filter Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn btn-outline flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Bộ Lọc
          </button>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Trạng Thái Học Phí
                </label>
                <select
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-main focus:border-transparent"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">Tất cả</option>
                  <option value="dadong">Đã đóng</option>
                  <option value="conno">Còn nợ</option>
                  <option value="chuadong">Chưa đóng</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Students Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Học Viên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Liên Hệ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Tuổi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Trạng Thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Tài Khoản
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Ngày Tạo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Thao Tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-primary-main flex items-center justify-center text-white font-medium">
                        {student.ten.split(' ').pop().charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-slate-900">{student.ten}</div>
                        <div className="text-sm text-slate-500">ID: {student.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-900">{student.email}</div>
                    <div className="text-sm text-slate-500 flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {student.sdt}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {calculateAge(student.ngay_sinh)} tuổi
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(student.trang_thai_hoc_phi)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {student.co_tai_khoan ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success text-white">
                        Có
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                        Chưa có
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {formatDate(student.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button className="text-primary-main hover:text-primary-dark">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-info hover:text-info-dark">
                        <Phone className="h-4 w-4" />
                      </button>
                      <button className="text-success hover:text-success-dark">
                        <Mail className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredStudents.length === 0 && (
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-500">Không tìm thấy học viên nào</p>
          </div>
        )}
      </div>
    </div>
  );
}
