import React, { useState, useEffect } from 'react';
import { CreditCard, Banknote, Receipt, CheckCircle, AlertCircle, X } from 'lucide-react';

export default function PaymentForm({ 
  payment, 
  onPayment, 
  onCancel, 
  loading = false 
}) {
  const [selectedMethod, setSelectedMethod] = useState('bank_transfer');
  const [paymentData, setPaymentData] = useState({
    method: 'bank_transfer',
    transactionId: '',
    notes: ''
  });

  // Ngăn scroll khi component mount
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const paymentMethods = [
    {
      id: 'bank_transfer',
      name: 'Bank Transfer',
      icon: <CreditCard className="h-6 w-6" />,
      description: 'Payment via bank transfer',
      color: 'text-primary-main'
    },
    {
      id: 'momo',
      name: 'MoMo E-Wallet',
      icon: <Banknote className="h-6 w-6" />,
      description: 'Payment via MoMo',
      color: 'text-pink-600'
    },
    {
      id: 'zalopay',
      name: 'ZaloPay E-Wallet',
      icon: <Banknote className="h-6 w-6" />,
      description: 'Payment via ZaloPay',
      color: 'text-blue-500'
    },
    {
      id: 'vnpay',
      name: 'VNPay',
      icon: <CreditCard className="h-6 w-6" />,
      description: 'Payment via VNPay',
      color: 'text-blue-700'
    },
    {
      id: 'cash',
      name: 'Payment at Center',
      icon: <Receipt className="h-6 w-6" />,
      description: 'Cash or card payment',
      color: 'text-green-600'
    }
  ];

  const handleInputChange = (field, value) => {
    setPaymentData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onPayment({
      ...paymentData,
      method: selectedMethod,
      paymentId: payment.id,
      amount: payment.amount
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };


  return (
    <>
      {/* Backdrop với blur effect */}
      <div className="fixed inset-0 bg-30 bg-opacity-80 backdrop-blur-sm z-40"></div>
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col border border-gray-200">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white sticky top-0 z-10">
            <h3 className="text-xl font-semibold text-gray-900">Tuition Payment</h3>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Payment Summary */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">Payment Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Course:</span>
                    <span className="font-medium">{payment.course}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-bold text-lg text-primary-main">{formatCurrency(payment.amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Due Date:</span>
                    <span className="font-medium">{payment.dueDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Description:</span>
                    <span className="font-medium">{payment.description}</span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Payment Method Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          selectedMethod === method.id
                            ? 'border-primary-main bg-primary-50 shadow-sm'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedMethod(method.id)}
                      >
                        <div className="flex items-center">
                          <div className={`${method.color} mr-3`}>
                            {method.icon}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{method.name}</div>
                            <div className="text-sm text-gray-600">{method.description}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Transaction ID (for online payments) */}
                {selectedMethod !== 'cash' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Transaction ID / Reference Number
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      value={paymentData.transactionId}
                      onChange={(e) => handleInputChange('transactionId', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-main focus:border-transparent transition-colors"
                      placeholder="Enter transaction ID from bank/e-wallet"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Please enter transaction ID for payment verification
                    </p>
                  </div>
                )}

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes (optional)
                  </label>
                  <textarea
                    value={paymentData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-main focus:border-transparent transition-colors"
                    placeholder="Add notes for this payment..."
                  />
                </div>

                {/* Payment Instructions */}
                {selectedMethod === 'bank_transfer' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h5 className="font-medium text-blue-900 mb-2 flex items-center">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Bank Transfer Instructions
                    </h5>
                    <div className="text-sm text-blue-800 space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <span className="font-medium">Bank:</span>
                        <span>Vietcombank</span>
                        <span className="font-medium">Account Number:</span>
                        <span>1234567890</span>
                        <span className="font-medium">Account Holder:</span>
                        <span>ENGLISH CENTER</span>
                        <span className="font-medium">Amount:</span>
                        <span className="font-bold">{formatCurrency(payment.amount)}</span>
                      </div>
                      <p className="pt-2 border-t border-blue-200">
                        <strong>Description:</strong> [Student ID] - [Course Name]
                      </p>
                    </div>
                  </div>
                )}

                {selectedMethod === 'momo' && (
                  <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
                    <h5 className="font-medium text-pink-900 mb-2 flex items-center">
                      <Banknote className="h-4 w-4 mr-2" />
                      MoMo Payment Instructions
                    </h5>
                    <div className="text-sm text-pink-800 space-y-2">
                      <p>1. Open MoMo app</p>
                      <p>2. Select "Transfer"</p>
                      <p>3. Scan QR code or enter phone number: <strong>0901234567</strong></p>
                      <p>4. Enter amount: <strong>{formatCurrency(payment.amount)}</strong></p>
                      <p>5. Add description: <strong>[Student ID] - [Course Name]</strong></p>
                    </div>
                  </div>
                )}

                {selectedMethod === 'cash' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h5 className="font-medium text-green-900 mb-2 flex items-center">
                      <Receipt className="h-4 w-4 mr-2" />
                      Payment at Center Instructions
                    </h5>
                    <div className="text-sm text-green-800 space-y-2">
                      <p>• Visit our center during working hours</p>
                      <p>• Bring the exact amount: <strong>{formatCurrency(payment.amount)}</strong></p>
                      <p>• Provide your student ID for verification</p>
                      <p>• Receive payment confirmation receipt</p>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Footer - Fixed */}
          <div className="border-t border-gray-200 bg-white p-6 sticky bottom-0">
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onCancel}
                className="rounded-xl border border-transparent bg-primary-main px-8 py-3 text-xs font-medium text-white hover:opacity-90 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={loading}
                className="rounded-xl border border-transparent bg-primary-main px-8 py-3 text-xs font-medium text-white hover:opacity-90 transition-colors disabled:opacity-50 flex items-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Confirm Payment
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}