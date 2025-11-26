import React, { useState } from 'react';

const FinanceReports = ({ 
  detailed = false, 
  reportData = {
    monthlyRevenue: [],
    overdueCustomers: [],
    arAging: [],
    topCourses: [],
    stats: {
      totalRevenue: 0,
      totalPayments: 0,
      averageMonthlyRevenue: 0,
      totalDebt: 0
    }
  },
  loading = false,
  error = null,
  onRefresh = () => {}
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [reportType, setReportType] = useState('revenue');

  const formatCurrency = (amount) => {
    if (!amount) return '-';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa thanh toán';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const { monthlyRevenue, overdueCustomers, arAging, topCourses, stats } = reportData;
  const { totalRevenue, totalPayments, averageMonthlyRevenue } = stats;

  // Loading state
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-sm text-gray-500">Đang tải báo cáo...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <span className="text-red-400">⚠️</span>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Lỗi tải báo cáo
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
            <div className="mt-4">
              <button
                onClick={onRefresh}
                className="bg-red-100 px-3 py-1 rounded-md text-sm text-red-800 hover:bg-red-200"
              >
                Thử lại
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!detailed) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Stats */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            📊 Thống kê nhanh
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Doanh thu 6 tháng</span>
              <span className="text-lg font-semibold text-green-600">
                {formatCurrency(totalRevenue)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Số giao dịch</span>
              <span className="text-lg font-semibold">{totalPayments}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">TB hàng tháng</span>
              <span className="text-lg font-semibold text-blue-600">
                {formatCurrency(averageMonthlyRevenue)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Công nợ</span>
              <span className="text-lg font-semibold text-red-600">
                {formatCurrency(stats.totalDebt)}
              </span>
            </div>
          </div>
        </div>

        {/* Top Courses */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            🏆 Khóa học hàng đầu
          </h3>
          <div className="space-y-3">
            {topCourses.slice(0, 4).map((course, index) => (
              <div key={index} className="flex justify-between items-center">
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {course.courseName}
                  </div>
                  <div className="text-xs text-gray-500">
                    {course.students} học viên
                  </div>
                </div>
                <div className="text-sm font-semibold text-green-600">
                  {formatCurrency(course.revenue)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Report Controls */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label htmlFor="period" className="block text-sm font-medium text-gray-700">
              Kỳ báo cáo
            </label>
            <select
              id="period"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="3months">3 tháng gần nhất</option>
              <option value="6months">6 tháng gần nhất</option>
              <option value="12months">12 tháng gần nhất</option>
              <option value="custom">Tùy chọn</option>
            </select>
          </div>

          <div>
            <label htmlFor="reportType" className="block text-sm font-medium text-gray-700">
              Loại báo cáo
            </label>
            <select
              id="reportType"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="revenue">Doanh thu</option>
              <option value="overdue">Công nợ</option>
              <option value="aging">AR Aging</option>
              <option value="courses">Theo khóa học</option>
            </select>
          </div>

          <div className="ml-auto">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <span className="mr-2">📊</span>
              Xuất báo cáo
            </button>
          </div>
        </div>
      </div>

      {reportType === 'revenue' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Revenue Chart */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              📈 Doanh thu theo tháng
            </h3>
            <div className="space-y-3">
              {monthlyRevenue.map((month, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-16 text-sm text-gray-600">{month.month}</div>
                  <div className="flex-1 mx-4">
                    <div className="bg-gray-200 rounded-full h-4 relative">
                      <div
                        className="bg-blue-600 h-4 rounded-full"
                        style={{
                          width: `${(month.revenue / Math.max(...monthlyRevenue.map(m => m.revenue))) * 100}%`
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-32 text-sm font-medium text-right">
                    {formatCurrency(month.revenue)}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tổng doanh thu:</span>
                <span className="font-semibold text-green-600">
                  {formatCurrency(totalRevenue)}
                </span>
              </div>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              📊 Tổng quan doanh thu
            </h3>
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(totalRevenue)}
                </div>
                <div className="text-sm text-green-700">Tổng doanh thu 6 tháng</div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {formatCurrency(averageMonthlyRevenue)}
                </div>
                <div className="text-sm text-blue-700">Trung bình hàng tháng</div>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {totalPayments}
                </div>
                <div className="text-sm text-purple-700">Tổng số giao dịch</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {reportType === 'overdue' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              ⚠️ Danh sách công nợ quá hạn
            </h3>
          </div>
          <div className="overflow-x-auto finance-table-scrollbar">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Học viên
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Khóa học
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Học phí
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Đã thanh toán
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Còn nợ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quá hạn
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thanh toán cuối
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {overdueCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {customer.studentName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {customer.studentCode}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {customer.courseName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(customer.totalFee)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                      {formatCurrency(customer.paidAmount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                      {formatCurrency(customer.overdueAmount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        customer.daysPastDue <= 30
                          ? 'bg-yellow-100 text-yellow-800'
                          : customer.daysPastDue <= 60
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {customer.daysPastDue} ngày
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(customer.lastPaymentDate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {reportType === 'aging' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* AR Aging Chart */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              📅 Phân tích tuổi nợ (AR Aging)
            </h3>
            <div className="space-y-4">
              {arAging.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-20 text-sm text-gray-600">{item.range}</div>
                  <div className="flex-1 mx-4">
                    <div className="bg-gray-200 rounded-full h-6 relative">
                      <div
                        className={`h-6 rounded-full ${
                          index === 0 ? 'bg-green-500' :
                          index === 1 ? 'bg-yellow-500' :
                          index === 2 ? 'bg-orange-500' : 'bg-red-500'
                        }`}
                        style={{
                          width: `${(item.amount / Math.max(...arAging.map(a => a.amount))) * 100}%`
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-32 text-sm font-medium text-right">
                    {formatCurrency(item.amount)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AR Summary */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              📊 Tóm tắt công nợ
            </h3>
            <div className="space-y-4">
              {arAging.map((item, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-900">
                      {item.range}
                    </span>
                    <span className="text-sm text-gray-500">
                      {item.count} khách hàng
                    </span>
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    {formatCurrency(item.amount)}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tổng công nợ:</span>
                <span className="font-semibold text-red-600">
                  {formatCurrency(arAging.reduce((sum, item) => sum + item.amount, 0))}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {reportType === 'courses' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              📚 Báo cáo theo khóa học
            </h3>
          </div>
          <div className="overflow-x-auto finance-table-scrollbar">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Khóa học
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số học viên
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Doanh thu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    TB/học viên
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    % Tổng doanh thu
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topCourses.map((course, index) => {
                  const totalCourseRevenue = topCourses.reduce((sum, c) => sum + c.revenue, 0);
                  const percentage = ((course.revenue / totalCourseRevenue) * 100).toFixed(1);
                  const avgPerStudent = course.revenue / course.students;
                  
                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {course.courseName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {course.students}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                        {formatCurrency(course.revenue)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(avgPerStudent)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {percentage}%
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

export default FinanceReports;