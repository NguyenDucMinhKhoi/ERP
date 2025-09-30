import React, { useState } from 'react';

// Dummy data
const students = [
  { id: 1, name: 'Nguyễn Văn An', code: 'HV001' },
  { id: 2, name: 'Trần Thị Bình', code: 'HV002' },
  { id: 3, name: 'Lê Minh Cường', code: 'HV003' },
  { id: 4, name: 'Phạm Thị Dung', code: 'HV004' },
];

const courses = [
  { id: 1, name: 'Tiếng Anh Cơ bản A1', fee: 2500000 },
  { id: 2, name: 'Tiếng Anh Giao tiếp A2', fee: 3000000 },
  { id: 3, name: 'Tiếng Anh Trung cấp B1', fee: 3500000 },
  { id: 4, name: 'IELTS Preparation', fee: 5000000 },
];

const paymentMethods = [
  { id: 'cash', name: 'Tiền mặt', icon: '💵' },
  { id: 'transfer', name: 'Chuyển khoản', icon: '🏦' },
  { id: 'card', name: 'Thẻ tín dụng', icon: '💳' },
  { id: 'e-wallet', name: 'Ví điện tử', icon: '📱' },
];

const PaymentForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    studentId: '',
    courseId: '',
    amount: '',
    paymentMethod: '',
    description: '',
    paymentDate: new Date().toISOString().split('T')[0],
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedCourse = courses.find(course => course.id === parseInt(formData.courseId));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.studentId) {
      newErrors.studentId = 'Vui lòng chọn học viên';
    }

    if (!formData.courseId) {
      newErrors.courseId = 'Vui lòng chọn khóa học';
    }

    if (!formData.amount) {
      newErrors.amount = 'Vui lòng nhập số tiền';
    } else if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Số tiền phải là số dương';
    }

    if (!formData.paymentMethod) {
      newErrors.paymentMethod = 'Vui lòng chọn phương thức thanh toán';
    }

    if (!formData.paymentDate) {
      newErrors.paymentDate = 'Vui lòng chọn ngày thanh toán';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Payment data:', formData);
      alert('Ghi nhận thanh toán thành công!');
      onClose();
    } catch (error) {
      console.error('Error submitting payment:', error);
      alert('Có lỗi xảy ra khi ghi nhận thanh toán');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Student Selection */}
      <div>
        <label htmlFor="studentId" className="block text-sm font-medium text-gray-700">
          Học viên <span className="text-red-500">*</span>
        </label>
        <select
          id="studentId"
          name="studentId"
          value={formData.studentId}
          onChange={handleInputChange}
          className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
            errors.studentId ? 'border-red-300' : 'border-gray-300'
          }`}
        >
          <option value="">Chọn học viên</option>
          {students.map(student => (
            <option key={student.id} value={student.id}>
              {student.code} - {student.name}
            </option>
          ))}
        </select>
        {errors.studentId && (
          <p className="mt-1 text-sm text-red-600">{errors.studentId}</p>
        )}
      </div>

      {/* Course Selection */}
      <div>
        <label htmlFor="courseId" className="block text-sm font-medium text-gray-700">
          Khóa học <span className="text-red-500">*</span>
        </label>
        <select
          id="courseId"
          name="courseId"
          value={formData.courseId}
          onChange={handleInputChange}
          className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
            errors.courseId ? 'border-red-300' : 'border-gray-300'
          }`}
        >
          <option value="">Chọn khóa học</option>
          {courses.map(course => (
            <option key={course.id} value={course.id}>
              {course.name} - {formatCurrency(course.fee)}
            </option>
          ))}
        </select>
        {errors.courseId && (
          <p className="mt-1 text-sm text-red-600">{errors.courseId}</p>
        )}
        {selectedCourse && (
          <p className="mt-1 text-sm text-blue-600">
            Học phí khóa học: {formatCurrency(selectedCourse.fee)}
          </p>
        )}
      </div>

      {/* Payment Amount */}
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
          Số tiền thanh toán (VNĐ) <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          id="amount"
          name="amount"
          value={formData.amount}
          onChange={handleInputChange}
          placeholder="0"
          className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
            errors.amount ? 'border-red-300' : 'border-gray-300'
          }`}
        />
        {errors.amount && (
          <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
        )}
        {formData.amount && !isNaN(formData.amount) && (
          <p className="mt-1 text-sm text-green-600">
            {formatCurrency(parseFloat(formData.amount))}
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
                formData.paymentMethod === method.id
                  ? 'border-blue-600 ring-2 ring-blue-600'
                  : 'border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={method.id}
                checked={formData.paymentMethod === method.id}
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
        {errors.paymentMethod && (
          <p className="mt-1 text-sm text-red-600">{errors.paymentMethod}</p>
        )}
      </div>

      {/* Payment Date */}
      <div>
        <label htmlFor="paymentDate" className="block text-sm font-medium text-gray-700">
          Ngày thanh toán <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          id="paymentDate"
          name="paymentDate"
          value={formData.paymentDate}
          onChange={handleInputChange}
          className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
            errors.paymentDate ? 'border-red-300' : 'border-gray-300'
          }`}
        />
        {errors.paymentDate && (
          <p className="mt-1 text-sm text-red-600">{errors.paymentDate}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Ghi chú
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          value={formData.description}
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
    </form>
  );
};

export default PaymentForm;