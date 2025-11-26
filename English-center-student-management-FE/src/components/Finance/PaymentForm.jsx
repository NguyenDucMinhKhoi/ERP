import React, { useState, useEffect } from 'react';

// Payment methods constants
const paymentMethods = [
  { id: 'tienmat', name: 'Tiền mặt', icon: '💵' },
  { id: 'chuyenkhoan', name: 'Chuyển khoản', icon: '🏦' },
  { id: 'the', name: 'Thẻ', icon: '💳' },
];

const PaymentForm = ({ 
  onClose, 
  onSuccess, 
  students = [], 
  onCreatePayment,
  generateReceiptNumber,
  validatePaymentData
}) => {
  const [formData, setFormData] = useState({
    hocvien: '',
    so_tien: '',
    hinh_thuc: '',
    so_bien_lai: '',
    ghi_chu: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [successData, setSuccessData] = useState(null);

  // Generate receipt number on component mount
  useEffect(() => {
    if (generateReceiptNumber) {
      setFormData(prev => ({
        ...prev,
        so_bien_lai: generateReceiptNumber()
      }));
    }
  }, [generateReceiptNumber]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for amount field - remove dots for number formatting
    let processedValue = value;
    if (name === 'so_tien') {
      // Remove all dots from the input value
      processedValue = value.replace(/\./g, '');
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Format number with dots for display (e.g., 2500000 -> 2.500.000)
  const formatNumberWithDots = (num) => {
    if (!num) return '';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const validateForm = () => {
    if (validatePaymentData) {
      const validation = validatePaymentData(formData);
      setErrors(validation.errors);
      return validation.isValid;
    }
    // Simple validation fallback
    const errors = {};
    if (!formData.hocvien) errors.hocvien = 'Vui lòng chọn học viên';
    if (!formData.so_tien) errors.so_tien = 'Vui lòng nhập số tiền';
    if (!formData.hinh_thuc) errors.hinh_thuc = 'Vui lòng chọn hình thức thanh toán';
    
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Call API to create payment
      const paymentData = {
        ...formData,
        so_tien: parseFloat(formData.so_tien)
      };
      
      if (onCreatePayment) {
        await onCreatePayment(paymentData);
      }
      
      // Prepare success data
      const selectedStudent = students.find(s => s.id === formData.hocvien);
      const selectedPaymentMethod = paymentMethods.find(m => m.id === formData.hinh_thuc);
      
      setSuccessData({
        studentName: selectedStudent?.ten || 'N/A',
        amount: parseFloat(formData.so_tien),
        paymentMethod: selectedPaymentMethod?.name,
        receiptNumber: formData.so_bien_lai,
        description: formData.ghi_chu
      });
      
      setShowSuccessDialog(true);
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error submitting payment:', error);
      setShowErrorDialog(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Dialog handlers
  const handleCloseSuccessDialog = () => {
    setShowSuccessDialog(false);
    setSuccessData(null);
    onClose(); // Close the main modal
  };

  const handleCloseErrorDialog = () => {
    setShowErrorDialog(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Student Selection */}
      <div>
        <label htmlFor="hocvien" className="block text-sm font-medium text-gray-700">
          Học viên <span className="text-red-500">*</span>
        </label>
        <select
          id="hocvien"
          name="hocvien"
          value={formData.hocvien}
          onChange={handleInputChange}
          className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
            errors.hocvien ? 'border-red-300' : 'border-gray-300'
          }`}
        >
          <option value="">Chọn học viên</option>
          {students.map(student => (
            <option key={student.id} value={student.id}>
              {student.ten}
            </option>
          ))}
        </select>
        {errors.hocvien && (
          <p className="mt-1 text-sm text-red-600">{errors.hocvien}</p>
        )}
      </div>

      {/* Payment Amount */}
      <div>
        <label htmlFor="so_tien" className="block text-sm font-medium text-gray-700">
          Số tiền thanh toán (VNĐ) <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="so_tien"
          name="so_tien"
          value={formData.so_tien ? formatNumberWithDots(formData.so_tien) : ''}
          onChange={handleInputChange}
          placeholder="0"
          className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
            errors.so_tien ? 'border-red-300' : 'border-gray-300'
          }`}
        />
        {errors.so_tien && (
          <p className="mt-1 text-sm text-red-600">{errors.so_tien}</p>
        )}
        {formData.so_tien && !isNaN(formData.so_tien) && (
          <p className="mt-1 text-sm text-green-600">
            {formatCurrency(parseFloat(formData.so_tien))}
          </p>
        )}
      </div>

      {/* Payment Method */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Phương thức thanh toán <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          {paymentMethods.map(method => (
            <label
              key={method.id}
              className={`relative flex cursor-pointer rounded-lg border p-4 focus:outline-none ${
                formData.hinh_thuc === method.id
                  ? 'border-blue-600 ring-2 ring-blue-600'
                  : 'border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="hinh_thuc"
                value={method.id}
                checked={formData.hinh_thuc === method.id}
                onChange={handleInputChange}
                className="sr-only"
              />
              <span className="flex flex-1">
                <span className="flex flex-col">
                  <span className="block text-lg mb-1">{method.icon}</span>
                  <span className="block text-sm font-medium text-gray-900">
                    {method.name}
                  </span>
                </span>
              </span>
            </label>
          ))}
        </div>
        {errors.hinh_thuc && (
          <p className="mt-1 text-sm text-red-600">{errors.hinh_thuc}</p>
        )}
      </div>

      {/* Receipt Number */}
      <div>
        <label htmlFor="so_bien_lai" className="block text-sm font-medium text-gray-700">
          Số biên lai <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="so_bien_lai"
          name="so_bien_lai"
          value={formData.so_bien_lai}
          onChange={handleInputChange}
          placeholder="Tự động tạo"
          className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
            errors.so_bien_lai ? 'border-red-300' : 'border-gray-300'
          }`}
        />
        {errors.so_bien_lai && (
          <p className="mt-1 text-sm text-red-600">{errors.so_bien_lai}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="ghi_chu" className="block text-sm font-medium text-gray-700">
          Ghi chú
        </label>
        <textarea
          id="ghi_chu"
          name="ghi_chu"
          rows={3}
          value={formData.ghi_chu}
          onChange={handleInputChange}
          placeholder="Ghi chú thêm về khoản thanh toán này..."
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-6 border-t">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Hủy
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isSubmitting ? 'Đang xử lý...' : 'Ghi nhận thanh toán'}
        </button>
      </div>

      {/* Success Dialog */}
      {showSuccessDialog && successData && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
            {/* Success Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-center text-gray-900 mb-2">
              🎉 Ghi nhận thanh toán thành công!
            </h3>

            {/* Content */}
            <div className="text-center text-gray-600 mb-6">
              <p className="font-medium mb-3">Thanh toán đã được ghi nhận vào hệ thống</p>
              <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-2">
                <div className="flex justify-between">
                  <span>Học viên:</span>
                  <span className="font-medium">{successData.studentName} ({successData.studentCode})</span>
                </div>
                <div className="flex justify-between">
                  <span>Khóa học:</span>
                  <span className="font-medium">{successData.courseName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Số tiền:</span>
                  <span className="font-bold text-teal-600">{formatCurrency(successData.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Phương thức:</span>
                  <span className="font-medium">{successData.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span>Ngày thanh toán:</span>
                  <span className="font-medium">{new Date(successData.paymentDate).toLocaleDateString('vi-VN')}</span>
                </div>
                {successData.description && (
                  <div className="flex justify-between">
                    <span>Ghi chú:</span>
                    <span className="font-medium">{successData.description}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-center">
              <button
                onClick={handleCloseSuccessDialog}
                className="px-6 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-200 shadow-sm"
              >
                ✅ Hoàn tất
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Dialog */}
      {showErrorDialog && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
            {/* Error Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-center text-gray-900 mb-2">
              ❌ Có lỗi xảy ra
            </h3>

            {/* Content */}
            <div className="text-center text-gray-600 mb-6">
              <p className="font-medium">Không thể ghi nhận thanh toán. Vui lòng thử lại sau.</p>
            </div>

            {/* Actions */}
            <div className="flex justify-center">
              <button
                onClick={handleCloseErrorDialog}
                className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
};

export default PaymentForm;