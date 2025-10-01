import React, { useState } from 'react';
import { 
  DollarSign, 
  CreditCard, 
  AlertTriangle, 
  TrendingUp,
  FileText,
  Users,
  Calendar,
  CheckCircle
} from 'lucide-react';
import { KPICard, MetricCard } from '../shared';
import PaymentForm from './PaymentForm';
import PaymentHistory from './PaymentHistory';
import FinanceReports from './FinanceReports';
import InvoiceModal from './InvoiceModal';
import TuitionOverview from './TuitionOverview';
import DebtManagement from './DebtManagement';
import InvoiceCreation from './InvoiceCreation';

const PaymentManagement = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showInvoiceCreation, setShowInvoiceCreation] = useState(false);

  const tabs = [
    {
      id: 'overview',
      name: 'Tổng quan',
      icon: <TrendingUp className="h-4 w-4" />,
    },
    {
      id: 'payments',
      name: 'Giao dịch',
      icon: <CreditCard className="h-4 w-4" />,
    },
    {
      id: 'debt',
      name: 'Quản lý nợ',
      icon: <AlertTriangle className="h-4 w-4" />,
    },
    {
      id: 'reports',
      name: 'Báo cáo',
      icon: <FileText className="h-4 w-4" />,
    },
  ];

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setShowInvoiceModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Quản lý Tài chính
            </h1>
            <p className="text-slate-600 mt-1">
              Quản lý học phí, thanh toán và báo cáo doanh thu
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowInvoiceCreation(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-200 cursor-pointer"
            >
              <FileText className="h-4 w-4 mr-2" />
              Tạo hóa đơn
            </button>
            <button
              onClick={() => setShowPaymentForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-200 cursor-pointer "
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Ghi nhận thanh toán
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4 mb-6">
          <KPICard
            title="Tổng Doanh Thu"
            value="₫4.2B"
            delta="+12%"
            tone="success"
            icon={<DollarSign className="h-5 w-5" />}
            description="So với tháng trước"
          />
          <KPICard
            title="Thanh Toán Chờ Xử Lý"
            value="₫125M"
            delta="+5%"
            tone="info"
            icon={<CreditCard className="h-5 w-5" />}
            description="Cần xác nhận"
          />
          <KPICard
            title="Số Tiền Nợ"
            value="₫89M"
            delta="-8%"
            tone="warning"
            icon={<AlertTriangle className="h-5 w-5" />}
            description="Quá hạn thanh toán"
          />
          <KPICard
            title="Tỷ Lệ Thu Hồi"
            value="92%"
            delta="+3%"
            tone="success"
            icon={<TrendingUp className="h-5 w-5" />}
            description="Tháng hiện tại"
          />
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title="Hóa Đơn Hôm Nay"
            value="24"
            icon={<FileText className="h-4 w-4" />}
            color="text-teal-600"
          />
          <MetricCard
            title="Học Viên Đã Thanh Toán"
            value="156"
            icon={<CheckCircle className="h-4 w-4" />}
            color="text-green-600"
          />
          <MetricCard
            title="Học Viên Nợ Phí"
            value="23"
            icon={<Users className="h-4 w-4" />}
            color="text-red-600"
          />
          <MetricCard
            title="Hóa Đơn Đến Hạn"
            value="8"
            icon={<Calendar className="h-4 w-4" />}
            color="text-orange-600"
          />
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1 mb-6">
        <nav className="flex space-x-1" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-teal-50 text-teal-700 shadow-sm border border-teal-200'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className={activeTab === tab.id ? 'text-teal-600' : 'text-gray-400'}>
                {tab.icon}
              </span>
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <TuitionOverview 
              onCreateInvoice={() => setShowInvoiceCreation(true)}
            />
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="space-y-6">
            <PaymentHistory onViewInvoice={handleViewInvoice} />
          </div>
        )}

        {activeTab === 'debt' && (
          <div className="space-y-6">
            <DebtManagement />
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="space-y-6">
            <FinanceReports detailed={true} />
          </div>
        )}
      </div>

      {/* Payment Form Modal */}
      {showPaymentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative mx-auto w-full max-w-2xl bg-white rounded-xl shadow-xl">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Ghi nhận thanh toán mới
                  </h3>
                  <p className="text-sm text-gray-500">
                    Nhập thông tin thanh toán học phí
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPaymentForm(false)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-colors"
              >
                <span className="sr-only">Đóng</span>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <PaymentForm onClose={() => setShowPaymentForm(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {showInvoiceModal && selectedInvoice && (
        <InvoiceModal
          invoice={selectedInvoice}
          onClose={() => {
            setShowInvoiceModal(false);
            setSelectedInvoice(null);
          }}
        />
      )}

      {/* Invoice Creation Modal */}
      {showInvoiceCreation && (
        <InvoiceCreation 
          onClose={() => setShowInvoiceCreation(false)}
        />
      )}
    </div>
  );
};

export default PaymentManagement;