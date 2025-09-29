import React, { useState } from 'react';
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
      icon: '📊',
    },
    {
      id: 'payments',
      name: 'Giao dịch',
      icon: '💳',
    },
    {
      id: 'debt',
      name: 'Quản lý nợ',
      icon: '⚠️',
    },
    {
      id: 'reports',
      name: 'Báo cáo',
      icon: '📈',
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
          <div className="flex justify-between items-center">
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
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <span className="mr-2">📄</span>
                Tạo hóa đơn
              </button>
              <button
                onClick={() => setShowPaymentForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <span className="mr-2">💰</span>
                Ghi nhận thanh toán
              </button>
            </div>
          </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Ghi nhận thanh toán mới
              </h3>
              <button
                onClick={() => setShowPaymentForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="sr-only">Đóng</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <PaymentForm onClose={() => setShowPaymentForm(false)} />
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