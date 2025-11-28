import React, { useState, useEffect } from 'react';
import financeService from '../../services/financeService';

const paymentMethodLabels = {
  tienmat: { name: 'Tiền mặt', icon: '💵' },
  chuyenkhoan: { name: 'Chuyển khoản', icon: '🏦' },
  the: { name: 'Thẻ tín dụng', icon: '💳' },
  cash: { name: 'Tiền mặt', icon: '💵' }, // fallback
  transfer: { name: 'Chuyển khoản', icon: '🏦' }, // fallback
  card: { name: 'Thẻ tín dụng', icon: '💳' }, // fallback
  'e-wallet': { name: 'Ví điện tử', icon: '📱' },
};

const statusLabels = {
  completed: { name: 'Đã thanh toán', color: 'green' },
  pending: { name: 'Đang xử lý', color: 'yellow' },
  failed: { name: 'Thất bại', color: 'red' },
};

const PaymentHistory = ({ 
  onViewInvoice,
  payments = null, // if parent passes payments array use it, otherwise component will fetch
  loading = null,
  error = null,
  stats = null,
  refreshTrigger = 0, // when this increments, reload payments
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Internal state when parent doesn't provide data
  const [localPayments, setLocalPayments] = useState([]);
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [localStats, setLocalStats] = useState({
    totalAmount: 0,
    totalPayments: 0,
    completedPayments: 0,
    pendingPayments: 0
  });

  const usePayments = Array.isArray(payments) ? payments : localPayments;
  const useLoading = loading !== null ? loading : localLoading;
  const useError = error !== null ? error : localError;
  const useStats = stats !== null ? stats : localStats;

  // Load payments when component mounts or when refreshTrigger changes (if parent didn't supply)
  useEffect(() => {
    if (Array.isArray(payments)) return; // parent controls data

    const load = async () => {
      try {
        setLocalLoading(true);
        setLocalError(null);
        const response = await financeService.getPayments({ page_size: 100 });
        const paymentsData = Array.isArray(response) ? response : (response.results || response.data || []);
        setLocalPayments(paymentsData);

        const totalAmount = paymentsData.reduce((sum, p) => sum + (parseFloat(p.so_tien) || 0), 0);
        setLocalStats({
          totalAmount,
          totalPayments: paymentsData.length,
          completedPayments: paymentsData.length,
          pendingPayments: 0
        });
      } catch (err) {
        console.error('❌ Error loading payments in PaymentHistory:', err);
        setLocalError('Không thể tải dữ liệu thanh toán');
      } finally {
        setLocalLoading(false);
      }
    };

    load();
  }, [payments, refreshTrigger]);



  const formatCurrency = (amount) => {
    if (!amount) return '-';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  // Transform API data to match frontend format
  const transformedPayments = (usePayments || []).map(payment => {
    console.log('🔄 Transforming payment:', payment);
    // Handle both old and new API structure
    const studentInfo = payment.hocvien_info || payment.hocvien;
    console.log('👤 Student info:', studentInfo);
    
    return {
      id: payment.id,
      studentName: studentInfo?.ten || studentInfo?.ho_ten || payment.hocvien_display_name || 'N/A',
      studentCode: studentInfo?.ma_hocvien || `HV${String(studentInfo?.id || payment.id).slice(-6)}`,
      courseName: studentInfo?.khoahoc?.ten_khoahoc || payment.khoahoc?.ten_khoahoc || 'Chưa có thông tin khóa học',
      amount: parseFloat(payment.so_tien) || 0,
      paymentMethod: payment.hinh_thuc || 'tienmat',
      paymentDate: payment.ngay_dong || payment.ngay_thanhtoan || payment.created_at,
      status: 'completed', // Default status since API doesn't provide this
      description: payment.ghi_chu || '',
      invoiceNumber: payment.so_bien_lai || `HĐ-${String(payment.id).slice(-6)}`,
    };
  });

  console.log('✅ Transformed payments:', transformedPayments);

  // Filter payments
  const filteredPayments = transformedPayments.filter(payment => {
    const matchesSearch = 
      payment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.studentCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    const matchesMethod = methodFilter === 'all' || payment.paymentMethod === methodFilter;
    
    const matchesDateRange = (!dateRange.from || payment.paymentDate >= dateRange.from) &&
                           (!dateRange.to || payment.paymentDate <= dateRange.to);

    return matchesSearch && matchesStatus && matchesMethod && matchesDateRange;
  });

  // Pagination
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPayments = filteredPayments.slice(startIndex, startIndex + itemsPerPage);

  const handleExportCSV = () => {
    const csvContent = [
      ['Mã HĐ', 'Học viên', 'Khóa học', 'Số tiền', 'Phương thức', 'Ngày', 'Trạng thái', 'Ghi chú'],
      ...filteredPayments.map(payment => [
        payment.invoiceNumber,
        `${payment.studentCode} - ${payment.studentName}`,
        payment.courseName,
        payment.amount,
        paymentMethodLabels[payment.paymentMethod].name,
        formatDate(payment.paymentDate),
        statusLabels[payment.status].name,
        payment.description
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `payments_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">💰</span>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Tổng thu
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {formatCurrency(useStats.totalAmount)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">📊</span>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Số giao dịch
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {useStats.totalPayments}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Đã thanh toán
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {useStats.completedPayments}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">⏳</span>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Đang xử lý
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {useStats.pendingPayments}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {useLoading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-sm text-gray-500">Đang tải dữ liệu...</p>
        </div>
      )}

      {/* Filters */}
      {!useLoading && (
        <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Search */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700">
              Tìm kiếm
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo tên, mã HV, khóa học..."
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          {/* Status Filter */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Trạng thái
            </label>
            <select
              id="status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="all">Tất cả</option>
              <option value="completed">Đã thanh toán</option>
              <option value="pending">Đang xử lý</option>
              <option value="failed">Thất bại</option>
            </select>
          </div>

          {/* Method Filter */}
          <div>
            <label htmlFor="method" className="block text-sm font-medium text-gray-700">
              Phương thức
            </label>
            <select
              id="method"
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="all">Tất cả</option>
              <option value="cash">Tiền mặt</option>
              <option value="transfer">Chuyển khoản</option>
              <option value="card">Thẻ tín dụng</option>
              <option value="e-wallet">Ví điện tử</option>
            </select>
          </div>

          {/* Date From */}
          <div>
            <label htmlFor="dateFrom" className="block text-sm font-medium text-gray-700">
              Từ ngày
            </label>
            <input
              type="date"
              id="dateFrom"
              value={dateRange.from}
              onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          {/* Date To */}
          <div>
            <label htmlFor="dateTo" className="block text-sm font-medium text-gray-700">
              Đến ngày
            </label>
            <input
              type="date"
              id="dateTo"
              value={dateRange.to}
              onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <p className="text-sm text-gray-500">
            Hiển thị {paginatedPayments.length} trong tổng số {filteredPayments.length} giao dịch
          </p>
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <span className="mr-2">📊</span>
            Xuất CSV
          </button>
        </div>
        </div>
      )}

      {/* Payment Table */}
      {!useLoading && !useError && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hóa đơn
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Học viên
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Khóa học
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Số tiền
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phương thức
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedPayments.map((payment) => (
              <tr key={payment.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                  {payment.invoiceNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {payment.studentName}
                  </div>
                  <div className="text-sm text-gray-500">
                    {payment.studentCode}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {payment.courseName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {formatCurrency(payment.amount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-900">
                    <span className="mr-2">
                      {paymentMethodLabels[payment.paymentMethod].icon}
                    </span>
                    {paymentMethodLabels[payment.paymentMethod].name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(payment.paymentDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    statusLabels[payment.status].color === 'green'
                      ? 'bg-green-100 text-green-800'
                      : statusLabels[payment.status].color === 'yellow'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {statusLabels[payment.status].name}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => onViewInvoice(payment)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    Xem biên lai
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Trước
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Sau
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Hiển thị{' '}
                  <span className="font-medium">{startIndex + 1}</span>
                  {' '}đến{' '}
                  <span className="font-medium">
                    {Math.min(startIndex + itemsPerPage, filteredPayments.length)}
                  </span>
                  {' '}trong{' '}
                  <span className="font-medium">{filteredPayments.length}</span>
                  {' '}kết quả
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Trước
                  </button>
                  {[...Array(totalPages)].map((_, index) => {
                    const page = index + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === page
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Sau
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

export default PaymentHistory;