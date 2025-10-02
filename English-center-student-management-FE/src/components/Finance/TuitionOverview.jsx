import React, { useState } from 'react';

// Dummy data for tuition overview
const generateTuitionOverviewData = () => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  // Monthly revenue data for the last 6 months
  const monthlyRevenue = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date(currentYear, currentMonth - i, 1);
    const month = date.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' });
    const revenue = (Math.random() * 200000000) + 150000000; // 150M - 350M
    const students = Math.floor(Math.random() * 50) + 80; // 80-130 students
    
    monthlyRevenue.push({
      month,
      revenue,
      students,
      avgRevenuePerStudent: Math.round(revenue / students),
    });
  }

  // Due dates data
  const upcomingDueDates = [
    { date: '2024-05-01', count: 15, amount: 45000000 },
    { date: '2024-05-05', count: 8, amount: 24000000 },
    { date: '2024-05-10', count: 12, amount: 36000000 },
    { date: '2024-05-15', count: 6, amount: 18000000 },
    { date: '2024-05-20', count: 10, amount: 30000000 },
  ];

  // Course revenue breakdown
  const courseRevenue = [
    { course: 'IELTS Preparation', revenue: 85000000, students: 17, avgFee: 5000000 },
    { course: 'Business English', revenue: 68000000, students: 17, avgFee: 4000000 },
    { course: 'English Pre-Intermediate B1', revenue: 59500000, students: 17, avgFee: 3500000 },
    { course: 'English Conversation A2', revenue: 51000000, students: 17, avgFee: 3000000 },
    { course: 'English for Beginners A1', revenue: 42500000, students: 17, avgFee: 2500000 },
  ];

  // Payment method breakdown
  const paymentMethods = [
    { method: 'transfer', name: 'Chuyển khoản', amount: 180000000, percentage: 45 },
    { method: 'cash', name: 'Tiền mặt', amount: 120000000, percentage: 30 },
    { method: 'card', name: 'Thẻ tín dụng', amount: 80000000, percentage: 20 },
    { method: 'e-wallet', name: 'Ví điện tử', amount: 20000000, percentage: 5 },
  ];

  return {
    monthlyRevenue,
    upcomingDueDates,
    courseRevenue,
    paymentMethods,
  };
};

const TuitionOverview = ({ onViewDebtManagement, onCreateInvoice, onViewReports }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [viewType, setViewType] = useState('overview');
  
  const {
    monthlyRevenue,
    upcomingDueDates,
    courseRevenue,
    paymentMethods,
  } = generateTuitionOverviewData();

  // Calculate summary statistics
  const totalRevenue = monthlyRevenue.reduce((sum, item) => sum + item.revenue, 0);
  const totalDebt = 125000000; // Mock total debt
  const overdueDebt = 45000000; // Mock overdue debt
  const avgMonthlyRevenue = totalRevenue / monthlyRevenue.length;
  const totalUpcomingDebt = upcomingDueDates.reduce((sum, item) => sum + item.amount, 0);
  const overdueCount = 18; // Mock overdue student count
  const totalStudentsWithDebt = 51; // Mock total students with debt

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
    });
  };

  const tabs = [
    { id: 'overview', name: 'Tổng quan', icon: '📊' },
    { id: 'revenue', name: 'Doanh thu', icon: '💰' },
    { id: 'debt', name: 'Công nợ', icon: '⚠️' },
    { id: 'courses', name: 'Theo khóa học', icon: '📚' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Tổng quan học phí</h3>
          <p className="text-sm text-gray-500">
            Dashboard quản lý tài chính và công nợ học phí
          </p>
        </div>
        <div className="flex space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="week">Tuần này</option>
            <option value="month">Tháng này</option>
            <option value="quarter">Quý này</option>
            <option value="year">Năm này</option>
          </select>
          <button
            onClick={onViewReports}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            📈 Báo cáo chi tiết
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-md">
              <span className="text-2xl">💰</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Doanh thu TB/tháng</p>
              <p className="text-2xl font-semibold text-blue-600">
                {formatCurrency(avgMonthlyRevenue)}
              </p>
              <p className="text-sm text-green-600">+12.5% so với kỳ trước</p>
            </div>
          </div>
        </div>

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
              <p className="text-sm text-red-600">{totalStudentsWithDebt} học viên</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-orange-500">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-md">
              <span className="text-2xl">⏰</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Quá hạn</p>
              <p className="text-2xl font-semibold text-orange-600">
                {formatCurrency(overdueDebt)}
              </p>
              <p className="text-sm text-orange-600">{overdueCount} học viên</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-500">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-md">
              <span className="text-2xl">📅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Sắp đến hạn</p>
              <p className="text-2xl font-semibold text-yellow-600">
                {formatCurrency(totalUpcomingDebt)}
              </p>
              <p className="text-sm text-yellow-600">
                {upcomingDueDates.reduce((sum, item) => sum + item.count, 0)} học viên
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setViewType(tab.id)}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                viewType === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {viewType === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Revenue Chart */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h4 className="text-lg font-medium text-gray-900">Doanh thu 6 tháng gần đây</h4>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {monthlyRevenue.map((item, index) => {
                  const maxRevenue = Math.max(...monthlyRevenue.map(i => i.revenue));
                  const barWidth = (item.revenue / maxRevenue) * 100;
                  
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">{item.month}</span>
                        <span className="text-sm font-semibold text-gray-900">
                          {formatCurrency(item.revenue)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                          style={{ width: `${barWidth}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {item.students} học viên • TB: {formatCurrency(item.avgRevenuePerStudent)}/HV
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Upcoming Due Dates */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-medium text-gray-900">Lịch đến hạn</h4>
                <button
                  onClick={onViewDebtManagement}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Xem tất cả →
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {upcomingDueDates.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-yellow-100 rounded-md">
                        <span className="text-lg">📅</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{formatDate(item.date)}</p>
                        <p className="text-sm text-gray-500">{item.count} học viên</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{formatCurrency(item.amount)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {viewType === 'revenue' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Payment Methods */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h4 className="text-lg font-medium text-gray-900">Phương thức thanh toán</h4>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {paymentMethods.map((method, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">{method.name}</span>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">
                          {formatCurrency(method.amount)}
                        </p>
                        <p className="text-xs text-gray-500">{method.percentage}%</p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          method.method === 'cash' ? 'bg-green-500' :
                          method.method === 'transfer' ? 'bg-blue-500' :
                          method.method === 'card' ? 'bg-purple-500' : 'bg-orange-500'
                        }`}
                        style={{ width: `${method.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Revenue Trend */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h4 className="text-lg font-medium text-gray-900">Xu hướng doanh thu</h4>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(totalRevenue)}
                    </p>
                    <p className="text-sm text-green-600">Tổng 6 tháng</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">
                      {formatCurrency(avgMonthlyRevenue)}
                    </p>
                    <p className="text-sm text-blue-600">Trung bình/tháng</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Tăng trưởng so với kỳ trước</span>
                    <span className="text-sm font-semibold text-green-600">+12.5%</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-600">Dự kiến tháng tới</span>
                    <span className="text-sm font-semibold text-blue-600">
                      {formatCurrency(avgMonthlyRevenue * 1.125)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {viewType === 'debt' && (
        <div className="space-y-6">
          {/* Debt Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <div className="text-3xl mb-2">🔴</div>
              <p className="text-2xl font-bold text-red-600">{overdueCount}</p>
              <p className="text-sm text-gray-600">Học viên quá hạn</p>
              <p className="text-lg font-semibold text-red-600 mt-2">
                {formatCurrency(overdueDebt)}
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <div className="text-3xl mb-2">🟡</div>
              <p className="text-2xl font-bold text-yellow-600">
                {upcomingDueDates.reduce((sum, item) => sum + item.count, 0)}
              </p>
              <p className="text-sm text-gray-600">Sắp đến hạn</p>
              <p className="text-lg font-semibold text-yellow-600 mt-2">
                {formatCurrency(totalUpcomingDebt)}
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <div className="text-3xl mb-2">📊</div>
              <p className="text-2xl font-bold text-gray-900">{totalStudentsWithDebt}</p>
              <p className="text-sm text-gray-600">Tổng HV có nợ</p>
              <p className="text-lg font-semibold text-gray-900 mt-2">
                {formatCurrency(totalDebt)}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={onViewDebtManagement}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
            >
              🚨 Quản lý công nợ
            </button>
            <button
              onClick={onCreateInvoice}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              📄 Tạo hóa đơn mới
            </button>
          </div>
        </div>
      )}

      {viewType === 'courses' && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h4 className="text-lg font-medium text-gray-900">Doanh thu theo khóa học</h4>
          </div>
          <div className="overflow-x-auto finance-table-scrollbar">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Khóa học
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Doanh thu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Học viên
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Học phí TB
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tỷ lệ
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {courseRevenue.map((course, index) => {
                  const totalCourseRevenue = courseRevenue.reduce((sum, c) => sum + c.revenue, 0);
                  const percentage = (course.revenue / totalCourseRevenue * 100).toFixed(1);
                  
                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{course.course}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-green-600">
                          {formatCurrency(course.revenue)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{course.students}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatCurrency(course.avgFee)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-900">{percentage}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default TuitionOverview;