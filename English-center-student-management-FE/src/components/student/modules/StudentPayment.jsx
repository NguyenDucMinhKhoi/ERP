import React, { useState, useEffect } from 'react';
import { CreditCard, Calendar, Receipt, CheckCircle, AlertCircle, Clock, Banknote } from 'lucide-react';
import { PaymentForm, SummaryStat, SectionCard } from '../index';

export default function StudentPayment() {
  const [payments, setPayments] = useState([]);
  const [upcomingPayments, setUpcomingPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/thanhtoans/me/`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('ecsm_access_token')}`,
          },
        });
        const data = await response.json();
        
        const today = new Date();
        
        const formattedPayments = data.map(payment => ({
          id: payment.id,
          course: payment.dangky?.khoahoc?.ten || 'Unknown Course',
          amount: payment.so_tien_thanh_toan || 0,
          dueDate: payment.ngay_dong || payment.created_at,
          status: payment.hinh_thuc === 'full' ? 'paid' : 
                  new Date(payment.ngay_dong) < today ? 'overdue' : 'pending',
          paymentDate: payment.ngay_thanh_toan || payment.ngay_dong,
          paymentMethod: payment.hinh_thuc || 'N/A',
          transactionId: payment.so_bien_lai || 'N/A',
          description: `Học phí ${new Date(payment.created_at).toLocaleDateString('vi-VN')}`
        }));
        
        setPayments(formattedPayments);
        setUpcomingPayments([]); // BE doesn't have upcoming payments endpoint
      } catch (error) {
        console.error('Error fetching payments:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPayments();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'paid': return 'Paid';
      case 'pending': return 'Pending';
      case 'overdue': return 'Overdue';
      default: return 'Unknown';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'overdue': return <AlertCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  const handlePayment = (payment) => {
    setSelectedPayment(payment);
    setShowPaymentModal(true);
    // Ngăn scroll khi modal mở
    document.body.style.overflow = 'hidden';
  };

  const handlePaymentSubmit = (paymentData) => {
    console.log('Payment submitted:', paymentData);
    setShowPaymentModal(false);
    setSelectedPayment(null);
    // Khôi phục scroll khi modal đóng
    document.body.style.overflow = 'auto';
  };

  const handlePaymentCancel = () => {
    setShowPaymentModal(false);
    setSelectedPayment(null);
    // Khôi phục scroll khi modal đóng
    document.body.style.overflow = 'auto';
  };

  const totalPaid = payments
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPending = payments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalOverdue = payments
    .filter(p => p.status === 'overdue')
    .reduce((sum, p) => sum + p.amount, 0);

  function SummaryCards() {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryStat
          icon={<CheckCircle className="h-6 w-6 text-green-600" />}
          label="Paid"
          value={formatCurrency(totalPaid)}
          color={{ bg: 'bg-green-100' }}
        />
        <SummaryStat
          icon={<Clock className="h-6 w-6 text-yellow-600" />}
          label="Pending"
          value={formatCurrency(totalPending)}
          color={{ bg: 'bg-yellow-100' }}
        />
        <SummaryStat
          icon={<AlertCircle className="h-6 w-6 text-red-600" />}
          label="Overdue"
          value={formatCurrency(totalOverdue)}
          color={{ bg: 'bg-red-100' }}
        />
</div>

    );
  }

  function UpcomingPaymentsList() {
    return (
      <SectionCard title="Upcoming tuition">
        <div className="space-y-4">
          {upcomingPayments.map((payment) => (
            <div key={payment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{payment.course}</h3>
                <p className="text-sm text-gray-600">{payment.description}</p>
                <p className="text-sm text-gray-500">Due date: {formatDate(payment.dueDate)}</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">{formatCurrency(payment.amount)}</p>
                </div>
                <button className="rounded-xl border border-transparent bg-primary-main px-8 py-3 text-xs font-medium text-white hover:opacity-90 transition-colors">
                  Pay now
                </button>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    );
  }

  function PaymentHistoryTable() {
    return (
      <SectionCard title="Payment history">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{payment.course}</div>
                      <div className="text-sm text-gray-500">{payment.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{formatCurrency(payment.amount)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatDate(payment.dueDate)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                      {getStatusIcon(payment.status)}
                      <span className="ml-1">{getStatusText(payment.status)}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {payment.status === 'paid' ? (
                      <div className="space-y-1">
                        <div className="text-xs text-gray-500">
                          {payment.paymentDate && `Paid: ${formatDate(payment.paymentDate)}`}
                        </div>
                        <div className="text-xs text-gray-500">{payment.paymentMethod}</div>
                        <div className="text-xs text-gray-500">{payment.transactionId}</div>
                      </div>
                    ) : (
                      <button onClick={() => handlePayment(payment)} className="rounded-xl border border-transparent bg-primary-main px-8 py-3 text-xs font-medium text-white hover:opacity-90 transition-colors">
                        Pay now
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    );
  }

  function PaymentMethodsGrid() {
    return (
      <SectionCard title="Payment methods">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer">
              <div className="flex items-center">
                <CreditCard className="h-8 w-8 text-primary-main" />
                <div className="ml-3">
                  <h3 className="font-medium text-gray-900">Bank transfer</h3>
                  <p className="text-sm text-gray-600">Pay via bank transfer</p>
                </div>
              </div>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer">
              <div className="flex items-center">
                <Banknote className="h-8 w-8 text-green-600" />
                <div className="ml-3">
                  <h3 className="font-medium text-gray-900">E-wallet</h3>
                  <p className="text-sm text-gray-600">MoMo, ZaloPay, VNPay</p>
                </div>
              </div>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer">
              <div className="flex items-center">
                <Receipt className="h-8 w-8 text-purple-600" />
                <div className="ml-3">
                  <h3 className="font-medium text-gray-900">Pay at center</h3>
                  <p className="text-sm text-gray-600">Cash or card</p>
                </div>
              </div>
            </div>
        </div>
      </SectionCard>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-main"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Billing & Invoices</h1>
          <p className="text-gray-600">Manage tuition and payments</p>
        </div>
        <button className="rounded-xl border border-transparent bg-primary-main px-8 py-3 text-xs font-medium text-white hover:opacity-90 transition-colors">
          Download invoice
        </button>
      </div>

      {/* Summary Cards */}
      <SummaryCards />

      {/* Upcoming Payments */}
      <UpcomingPaymentsList />

      {/* Payment History */}
      <PaymentHistoryTable />

      {/* Payment Methods */}
      <PaymentMethodsGrid />

      {/* Payment Modal */}
      {showPaymentModal && selectedPayment && (
        <PaymentForm
          payment={selectedPayment}
          onPayment={handlePaymentSubmit}
          onCancel={handlePaymentCancel}
          loading={false}
        />
      )}
    </div>
  );
}
