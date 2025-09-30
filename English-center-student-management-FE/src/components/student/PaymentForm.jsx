import React, { useState } from 'react';
import { CreditCard, Banknote, Receipt, CheckCircle, AlertCircle } from 'lucide-react';

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

  const paymentMethods = [
    {
      id: 'bank_transfer',
      name: 'Bank Transfer',
      icon: <CreditCard className="h-6 w-6" />,
      description: 'Payment via bank transfer',
      color: 'text-blue-600'
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
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Tuition Payment</h3>
          
          {/* Payment Summary */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-gray-900 mb-2">Payment Information</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Course:</span>
                <span className="font-medium">{payment.course}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-bold text-lg text-blue-600">{formatCurrency(payment.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Due Date:</span>
                <span className="font-medium">{payment.dueDate}</span>
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
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedMethod === method.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
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
                </label>
                <input
                  type="text"
                  value={paymentData.transactionId}
                  onChange={(e) => handleInputChange('transactionId', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add notes for this payment..."
              />
            </div>

            {/* Payment Instructions */}
            {selectedMethod === 'bank_transfer' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h5 className="font-medium text-blue-900 mb-2">Bank Transfer Instructions:</h5>
                <div className="text-sm text-blue-800 space-y-1">
                  <p>• Bank: Vietcombank</p>
                  <p>• Account Number: 1234567890</p>
                  <p>• Account Holder: ENGLISH CENTER</p>
                  <p>• Description: [Student ID] - [Course Name]</p>
                </div>
              </div>
            )}

            {selectedMethod === 'momo' && (
              <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
                <h5 className="font-medium text-pink-900 mb-2">MoMo Payment Instructions:</h5>
                <div className="text-sm text-pink-800 space-y-1">
                  <p>• Open MoMo app</p>
                  <p>• Select "Transfer"</p>
                  <p>• Scan QR code or enter phone number: 0901234567</p>
                  <p>• Enter amount: {formatCurrency(payment.amount)}</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
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
          </form>
        </div>
      </div>
    </div>
  );
}