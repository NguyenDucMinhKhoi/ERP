import React, { useState } from 'react';

// Dummy data for student tuition
const generateStudentTuitionData = () => {
  const courses = [
    { id: 1, name: 'English for Beginners A1', fee: 2500000, status: 'active' },
    { id: 2, name: 'English Conversation A2', fee: 3000000, status: 'completed' },
    { id: 3, name: 'IELTS Preparation', fee: 5000000, status: 'registered' },
  ];

  const payments = [
    {
      id: 1,
      courseId: 1,
      courseName: 'English for Beginners A1',
      amount: 2500000,
      method: 'cash',
      date: '2024-01-15',
      status: 'completed',
      invoiceNumber: 'INV-001',
      description: 'Thanh toán đầy đủ học phí khóa A1',
    },
    {
      id: 2,
      courseId: 2,
      courseName: 'English Conversation A2',
      amount: 1500000,
      method: 'transfer',
      date: '2024-02-20',
      status: 'completed',
      invoiceNumber: 'INV-002',
      description: 'Thanh toán đợt 1/2',
    },
    {
      id: 3,
      courseId: 2,
      courseName: 'English Conversation A2',
      amount: 1500000,
      method: 'transfer',
      date: '2024-03-20',
      status: 'completed',
      invoiceNumber: 'INV-003',
      description: 'Thanh toán đợt 2/2',
    },
    {
      id: 4,
      courseId: 3,
      courseName: 'IELTS Preparation',
      amount: 2500000,
      method: 'card',
      date: '2024-04-01',
      status: 'completed',
      invoiceNumber: 'INV-004',
      description: 'Thanh toán đợt 1/2',
    },
  ];

  const invoices = [
    {
      id: 1,
      courseId: 3,
      courseName: 'IELTS Preparation',
      amount: 2500000,
      dueDate: '2024-05-01',
      status: 'overdue',
      description: 'Học phí đợt 2/2 - IELTS Preparation',
      createdDate: '2024-03-15',
    },
    {
      id: 2,
      courseId: 1,
      courseName: 'English for Beginners A1',
      amount: 500000,
      dueDate: '2024-06-01',
      status: 'pending',
      description: 'Phí tài liệu bổ sung',
      createdDate: '2024-04-20',
    },
  ];

  return { courses, payments, invoices };
};

const paymentMethodLabels = {
  cash: { name: 'Tiền mặt', icon: '💵' },
  transfer: { name: 'Chuyển khoản', icon: '🏦' },
  card: { name: 'Thẻ tín dụng', icon: '💳' },
  'e-wallet': { name: 'Ví điện tử', icon: '📱' },
};

const statusLabels = {
  completed: { name: 'Đã thanh toán', color: 'green', bgColor: 'bg-green-100', textColor: 'text-green-800' },
  pending: { name: 'Chờ thanh toán', color: 'yellow', bgColor: 'bg-yellow-100', textColor: 'text-yellow-800' },
  overdue: { name: 'Quá hạn', color: 'red', bgColor: 'bg-red-100', textColor: 'text-red-800' },
  cancelled: { name: 'Đã hủy', color: 'gray', bgColor: 'bg-gray-100', textColor: 'text-gray-800' },
};

const StudentTuitionTab = ({ student, onCreateInvoice, onRecordPayment }) => {
  const [activeSubTab, setActiveSubTab] = useState('overview');
  const { courses, payments, invoices } = generateStudentTuitionData();

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

  // const formatDateTime = (dateString) => {
  //   return new Date(dateString).toLocaleDateString('vi-VN', {
  //     year: 'numeric',
  //     month: '2-digit',
  //     day: '2-digit',
  //     hour: '2-digit',
  //     minute: '2-digit',
  //   });
  // };

  // Calculate financial summary
  const totalCourseFee = courses.reduce((sum, course) => sum + course.fee, 0);
  const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const totalDebt = invoices
    .filter(inv => inv.status !== 'completed')
    .reduce((sum, inv) => sum + inv.amount, 0);
  const overdueDebt = invoices
    .filter(inv => inv.status === 'overdue')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const subTabs = [
    { id: 'overview', name: 'Tổng quan', icon: '📊' },
    { id: 'invoices', name: 'Hóa đơn', icon: '📄' },
    { id: 'payments', name: 'Lịch sử thanh toán', icon: '💳' },
    { id: 'courses', name: 'Khóa học', icon: '📚' },
  ];

  const handleCreateInvoice = () => {
    if (onCreateInvoice) {
      onCreateInvoice(student);
    }
  };

  const handleRecordPayment = (invoice = null) => {
    if (onRecordPayment) {
      onRecordPayment(student, invoice);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            Thông tin học phí - {student?.name}
          </h3>
          <p className="text-sm text-gray-500">
            Mã học viên: {student?.code} | Email: {student?.email}
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleCreateInvoice}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            📄 Tạo hóa đơn
          </button>
          <button
            onClick={() => handleRecordPayment()}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
          >
            💳 Ghi nhận thanh toán
          </button>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-md">
              <span className="text-2xl">📚</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Tổng học phí</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(totalCourseFee)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-md">
              <span className="text-2xl">✅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Đã thanh toán</p>
              <p className="text-2xl font-semibold text-green-600">
                {formatCurrency(totalPaid)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-500">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-md">
              <span className="text-2xl">⏳</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Còn nợ</p>
              <p className="text-2xl font-semibold text-yellow-600">
                {formatCurrency(totalDebt)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-red-500">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-md">
              <span className="text-2xl">🚨</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Quá hạn</p>
              <p className="text-2xl font-semibold text-red-600">
                {formatCurrency(overdueDebt)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {subTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                activeSubTab === tab.id
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
      {activeSubTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Invoices */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h4 className="text-lg font-medium text-gray-900">Hóa đơn gần đây</h4>
            </div>
            <div className="p-6">
              {invoices.length > 0 ? (
                <div className="space-y-4">
                  {invoices.slice(0, 3).map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{invoice.courseName}</p>
                        <p className="text-sm text-gray-500">{invoice.description}</p>
                        <p className="text-sm text-gray-500">Hạn: {formatDate(invoice.dueDate)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{formatCurrency(invoice.amount)}</p>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusLabels[invoice.status].bgColor} ${statusLabels[invoice.status].textColor}`}>
                          {statusLabels[invoice.status].name}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">Không có hóa đơn nào</p>
              )}
            </div>
          </div>

          {/* Recent Payments */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h4 className="text-lg font-medium text-gray-900">Thanh toán gần đây</h4>
            </div>
            <div className="p-6">
              {payments.length > 0 ? (
                <div className="space-y-4">
                  {payments.slice(-3).reverse().map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">
                          {paymentMethodLabels[payment.method]?.icon || '💳'}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{payment.courseName}</p>
                          <p className="text-sm text-gray-500">{payment.description}</p>
                          <p className="text-sm text-gray-500">{formatDate(payment.date)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">{formatCurrency(payment.amount)}</p>
                        <p className="text-sm text-gray-500">{payment.invoiceNumber}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">Chưa có thanh toán nào</p>
              )}
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'invoices' && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h4 className="text-lg font-medium text-gray-900">Danh sách hóa đơn</h4>
              <button
                onClick={handleCreateInvoice}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                📄 Tạo hóa đơn mới
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hóa đơn
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số tiền
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hạn thanh toán
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
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {invoice.courseName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {invoice.description}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(invoice.amount)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(invoice.dueDate)}
                      </div>
                      <div className="text-sm text-gray-500">
                        Tạo: {formatDate(invoice.createdDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusLabels[invoice.status].bgColor} ${statusLabels[invoice.status].textColor}`}>
                        {statusLabels[invoice.status].name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleRecordPayment(invoice)}
                          className="text-green-600 hover:text-green-900"
                          disabled={invoice.status === 'completed'}
                        >
                          💳 Thanh toán
                        </button>
                        <button className="text-blue-600 hover:text-blue-900">
                          👁️ Xem
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSubTab === 'payments' && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h4 className="text-lg font-medium text-gray-900">Lịch sử thanh toán</h4>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hóa đơn
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số tiền
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phương thức
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày thanh toán
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {payment.invoiceNumber}
                        </div>
                        <div className="text-sm text-gray-500">
                          {payment.courseName}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-green-600">
                        {formatCurrency(payment.amount)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="mr-2">
                          {paymentMethodLabels[payment.method]?.icon || '💳'}
                        </span>
                        <span className="text-sm text-gray-900">
                          {paymentMethodLabels[payment.method]?.name || payment.method}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(payment.date)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusLabels[payment.status].bgColor} ${statusLabels[payment.status].textColor}`}>
                        {statusLabels[payment.status].name}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSubTab === 'courses' && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h4 className="text-lg font-medium text-gray-900">Khóa học đã đăng ký</h4>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {courses.map((course) => {
                const coursePaid = payments
                  .filter(p => p.courseId === course.id)
                  .reduce((sum, p) => sum + p.amount, 0);
                const remaining = course.fee - coursePaid;
                const paymentProgress = (coursePaid / course.fee) * 100;

                return (
                  <div key={course.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h5 className="font-medium text-gray-900">{course.name}</h5>
                        <p className="text-sm text-gray-500">
                          Trạng thái: {course.status === 'active' ? 'Đang học' : 
                                     course.status === 'completed' ? 'Hoàn thành' : 'Đã đăng ký'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {formatCurrency(course.fee)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Đã thanh toán: {formatCurrency(coursePaid)}</span>
                        <span className={remaining > 0 ? 'text-red-600' : 'text-green-600'}>
                          {remaining > 0 ? `Còn lại: ${formatCurrency(remaining)}` : 'Đã thanh toán đủ'}
                        </span>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            paymentProgress >= 100 ? 'bg-green-600' : 
                            paymentProgress >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(paymentProgress, 100)}%` }}
                        ></div>
                      </div>
                      
                      <div className="text-right text-xs text-gray-500">
                        {paymentProgress.toFixed(1)}% đã thanh toán
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentTuitionTab;