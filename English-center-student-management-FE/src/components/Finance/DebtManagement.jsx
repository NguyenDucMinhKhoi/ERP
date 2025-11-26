import React, { useState } from 'react';

const statusLabels = {
  overdue: { name: 'Quá hạn', color: 'red', bgColor: 'bg-red-100', textColor: 'text-red-800', priority: 1 },
  due_soon: { name: 'Sắp đến hạn', color: 'yellow', bgColor: 'bg-yellow-100', textColor: 'text-yellow-800', priority: 2 },
  current: { name: 'Trong hạn', color: 'green', bgColor: 'bg-green-100', textColor: 'text-green-800', priority: 3 },
  paid: { name: 'Đã thanh toán', color: 'blue', bgColor: 'bg-blue-100', textColor: 'text-blue-800', priority: 4 },
};

const DebtManagement = ({ 
  onContactStudent, 
  onCreatePaymentReminder, 
  onViewStudentDetail,
  students = [],
  loading = false,
  error = null,
  stats = {
    totalStudentsWithDebt: 0,
    totalDebtAmount: 0,
    totalOverdueAmount: 0,
    overdueStudents: 0
  }
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('debt_desc');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showBulkActions, setShowBulkActions] = useState(false);
  
  const itemsPerPage = 10;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const getDaysOverdue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = today - due;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Filter and sort students
  const filteredStudents = students
    .filter(student => {
      const matchesSearch = 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.phone.includes(searchTerm);

      const matchesStatus = statusFilter === 'all' || student.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'debt_desc':
          return b.totalDebt - a.totalDebt;
        case 'debt_asc':
          return a.totalDebt - b.totalDebt;
        case 'overdue_desc':
          return b.overdueDebt - a.overdueDebt;
        case 'due_date':
          return new Date(a.nextDueDate) - new Date(b.nextDueDate);
        case 'priority':
          return statusLabels[a.status].priority - statusLabels[b.status].priority;
        default:
          return 0;
      }
    });

  // Pagination
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStudents = filteredStudents.slice(startIndex, startIndex + itemsPerPage);

  // Statistics - use API stats or calculate from students
  const totalDebt = stats.totalDebtAmount || students.reduce((sum, student) => sum + student.totalDebt, 0);
  const totalOverdue = stats.totalOverdueAmount || students.reduce((sum, student) => sum + student.overdueDebt, 0);
  const overdueCount = stats.overdueStudents || students.filter(s => s.status === 'overdue').length;
  const dueSoonCount = students.filter(s => s.status === 'due_soon').length;

  const handleSelectStudent = (studentId, isSelected) => {
    if (isSelected) {
      setSelectedStudents(prev => [...prev, studentId]);
    } else {
      setSelectedStudents(prev => prev.filter(id => id !== studentId));
    }
  };

  const handleSelectAll = (isSelected) => {
    if (isSelected) {
      setSelectedStudents(paginatedStudents.map(s => s.id));
    } else {
      setSelectedStudents([]);
    }
  };

  const handleBulkReminder = () => {
    const selectedStudentData = students.filter(s => selectedStudents.includes(s.id));
    if (onCreatePaymentReminder) {
      onCreatePaymentReminder(selectedStudentData);
    }
    setSelectedStudents([]);
  };

  const handleExportDebtList = () => {
    const csvContent = [
      ['Mã HV', 'Họ tên', 'Email', 'SĐT', 'Tổng nợ', 'Quá hạn', 'Hạn thanh toán', 'Trạng thái', 'Khóa học', 'Lịch sử thanh toán'],
      ...filteredStudents.map(student => [
        student.code,
        student.name,
        student.email,
        student.phone,
        student.totalDebt,
        student.overdueDebt,
        formatDate(student.nextDueDate),
        statusLabels[student.status].name,
        student.coursesOwed.join('; '),
        student.paymentHistory
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `debt_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Quản lý công nợ</h3>
          <p className="text-sm text-gray-500">
            Theo dõi và quản lý công nợ học phí của học viên
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleExportDebtList}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            📊 Xuất báo cáo
          </button>
          {selectedStudents.length > 0 && (
            <button
              onClick={handleBulkReminder}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              📧 Nhắc nhở ({selectedStudents.length})
            </button>
          )}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-sm text-gray-500">Đang tải dữ liệu công nợ...</p>
        </div>
      )}

      {/* Statistics Cards */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-red-500">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-md">
              <span className="text-2xl">🚨</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Tổng công nợ</p>
              <p className="text-2xl font-semibold text-red-600">
                {formatCurrency(totalDebt)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-orange-500">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-md">
              <span className="text-2xl">⚠️</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Quá hạn</p>
              <p className="text-2xl font-semibold text-orange-600">
                {formatCurrency(totalOverdue)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-red-500">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-md">
              <span className="text-2xl">👥</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">HV quá hạn</p>
              <p className="text-2xl font-semibold text-red-600">
                {overdueCount}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-500">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-md">
              <span className="text-2xl">⏰</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Sắp đến hạn</p>
              <p className="text-2xl font-semibold text-yellow-600">
                {dueSoonCount}
              </p>
            </div>
          </div>
        </div>
        </div>
      )}

      {/* Filters and Search */}
      {!loading && !error && (
        <div className="bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tìm kiếm
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tên, mã HV, email, SĐT..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trạng thái
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tất cả</option>
              <option value="overdue">Quá hạn</option>
              <option value="due_soon">Sắp đến hạn</option>
              <option value="current">Trong hạn</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sắp xếp
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="debt_desc">Nợ nhiều nhất</option>
              <option value="debt_asc">Nợ ít nhất</option>
              <option value="overdue_desc">Quá hạn nhiều nhất</option>
              <option value="due_date">Hạn thanh toán</option>
              <option value="priority">Độ ưu tiên</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => setShowBulkActions(!showBulkActions)}
              className={`w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium ${
                showBulkActions
                  ? 'bg-blue-50 text-blue-700 border-blue-300'
                  : 'text-gray-700 bg-white hover:bg-gray-50'
              }`}
            >
              ☑️ Chọn nhiều
            </button>
          </div>
        </div>
        </div>
      )}

      {/* Debt List */}
      {!loading && !error && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto finance-table-scrollbar">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {showBulkActions && (
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedStudents.length === paginatedStudents.length && paginatedStudents.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </th>
                )}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Học viên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Công nợ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hạn thanh toán
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Khóa học
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedStudents.map((student) => {
                const daysOverdue = student.status === 'overdue' ? getDaysOverdue(student.nextDueDate) : 0;
                const daysUntilDue = student.status === 'due_soon' ? getDaysUntilDue(student.nextDueDate) : 0;

                return (
                  <tr key={student.id} className={`hover:bg-gray-50 ${
                    student.status === 'overdue' ? 'bg-red-50' : 
                    student.status === 'due_soon' ? 'bg-yellow-50' : ''
                  }`}>
                    {showBulkActions && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedStudents.includes(student.id)}
                          onChange={(e) => handleSelectStudent(student.id, e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </td>
                    )}
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {student.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {student.code} • {student.email}
                          </div>
                          <div className="text-sm text-gray-500">
                            📞 {student.phone}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-red-600">
                        {formatCurrency(student.totalDebt)}
                      </div>
                      {student.overdueDebt > 0 && (
                        <div className="text-sm text-red-500">
                          Quá hạn: {formatCurrency(student.overdueDebt)}
                        </div>
                      )}
                      <div className="text-sm text-gray-500 mt-1">
                        {student.paymentHistory}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(student.nextDueDate)}
                      </div>
                      {student.status === 'overdue' && (
                        <div className="text-sm text-red-600">
                          Quá {daysOverdue} ngày
                        </div>
                      )}
                      {student.status === 'due_soon' && (
                        <div className="text-sm text-yellow-600">
                          Còn {daysUntilDue} ngày
                        </div>
                      )}
                      <div className="text-sm text-gray-500">
                        Liên hệ: {formatDate(student.lastContact)}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusLabels[student.status].bgColor} ${statusLabels[student.status].textColor}`}>
                        {statusLabels[student.status].name}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {student.coursesOwed.map((course, index) => (
                          <div key={index} className="mb-1">
                            📚 {course}
                          </div>
                        ))}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => onViewStudentDetail && onViewStudentDetail(student)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Xem chi tiết"
                        >
                          👁️
                        </button>
                        <button
                          onClick={() => onContactStudent && onContactStudent(student)}
                          className="text-green-600 hover:text-green-900"
                          title="Liên hệ"
                        >
                          📞
                        </button>
                        <button
                          onClick={() => onCreatePaymentReminder && onCreatePaymentReminder([student])}
                          className="text-yellow-600 hover:text-yellow-900"
                          title="Nhắc nhở thanh toán"
                        >
                          📧
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Trước
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sau
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Hiển thị <span className="font-medium">{startIndex + 1}</span> đến{' '}
                  <span className="font-medium">
                    {Math.min(startIndex + itemsPerPage, filteredStudents.length)}
                  </span>{' '}
                  trong <span className="font-medium">{filteredStudents.length}</span> kết quả
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ‹
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === pageNum
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ›
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
        </div>
      )}
    </div>
  );
};

export default DebtManagement;