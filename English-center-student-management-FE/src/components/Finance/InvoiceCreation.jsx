import React, { useState } from 'react';
import InvoiceModal from './InvoiceModal';

// Dummy data
const courses = [
  { id: 1, name: 'English for Beginners A1', fee: 2500000 },
  { id: 2, name: 'English Conversation A2', fee: 3000000 },
  { id: 3, name: 'English Pre-Intermediate B1', fee: 3500000 },
  { id: 4, name: 'IELTS Preparation', fee: 5000000 },
  { id: 5, name: 'Business English', fee: 4000000 },
];

const invoiceTypes = [
  { id: 'tuition', name: 'Học phí khóa học', icon: '📚' },
  { id: 'material', name: 'Phí tài liệu', icon: '📖' },
  { id: 'exam', name: 'Phí thi', icon: '📝' },
  { id: 'certificate', name: 'Phí chứng chỉ', icon: '🏆' },
  { id: 'other', name: 'Khác', icon: '📄' },
];

const InvoiceCreation = ({ student, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    studentId: student?.id || '',
    courseId: '',
    invoiceType: 'tuition',
    amount: '',
    customAmount: false,
    description: '',
    dueDate: '',
    installments: 1,
    notes: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showInstallments, setShowInstallments] = useState(false);
  const [showInvoicePreview, setShowInvoicePreview] = useState(false);
  const [previewInvoice, setPreviewInvoice] = useState(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successData, setSuccessData] = useState(null);

  const selectedCourse = courses.find(course => course.id === parseInt(formData.courseId));
  const selectedType = invoiceTypes.find(type => type.id === formData.invoiceType);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: fieldValue
    }));
    
    // Auto-fill amount when course is selected and it's tuition
    if (name === 'courseId' && formData.invoiceType === 'tuition' && !formData.customAmount) {
      const course = courses.find(c => c.id === parseInt(value));
      if (course) {
        setFormData(prev => ({
          ...prev,
          amount: course.fee.toString(),
          description: `Học phí khóa học ${course.name}`
        }));
      }
    }

    // Auto-fill description when invoice type changes
    if (name === 'invoiceType') {
      const type = invoiceTypes.find(t => t.id === value);
      let description = '';
      if (value === 'tuition' && selectedCourse) {
        description = `Học phí khóa học ${selectedCourse.name}`;
      } else if (type) {
        description = type.name;
      }
      setFormData(prev => ({
        ...prev,
        description
      }));
    }

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
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const validateForm = () => {
    const newErrors = {};

    // Skip student validation for demo - can add later
    // if (!formData.studentId) {
    //   newErrors.studentId = 'Vui lòng chọn học viên';
    // }

    if (formData.invoiceType === 'tuition' && !formData.courseId) {
      newErrors.courseId = 'Vui lòng chọn khóa học';
    }

    if (!formData.amount) {
      newErrors.amount = 'Vui lòng nhập số tiền';
    } else if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Số tiền phải là số dương';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Vui lòng nhập mô tả';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Vui lòng chọn hạn thanh toán';
    } else {
      const dueDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (dueDate < today) {
        newErrors.dueDate = 'Hạn thanh toán không được nhỏ hơn ngày hiện tại';
      }
    }

    if (showInstallments) {
      if (!formData.installments || formData.installments < 1 || formData.installments > 12) {
        newErrors.installments = 'Số đợt thanh toán phải từ 1 đến 12';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted!', formData);
    
    if (!validateForm()) {
      console.log('Form validation failed');
      return;
    }

    console.log('Starting submission...');
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const invoiceData = {
        ...formData,
        amount: parseFloat(formData.amount),
        studentName: student?.name || 'Nguyễn Văn A',
        studentCode: student?.code || 'HV001',
        courseName: selectedCourse?.name,
        typeName: selectedType?.name,
        createdDate: new Date().toISOString(),
        status: 'pending',
      };

      // Create installments if needed
      if (showInstallments && formData.installments > 1) {
        const installmentAmount = Math.round(invoiceData.amount / formData.installments);
        const installmentInvoices = [];
        
        for (let i = 0; i < formData.installments; i++) {
          const dueDate = new Date(formData.dueDate);
          dueDate.setMonth(dueDate.getMonth() + i);
          
          installmentInvoices.push({
            ...invoiceData,
            amount: i === formData.installments - 1 
              ? invoiceData.amount - (installmentAmount * (formData.installments - 1)) // Last installment gets remainder
              : installmentAmount,
            description: `${formData.description} - Đợt ${i + 1}/${formData.installments}`,
            dueDate: dueDate.toISOString().split('T')[0],
            installmentNumber: i + 1,
            totalInstallments: formData.installments,
          });
        }
        
        if (onSubmit) {
          onSubmit(installmentInvoices);
        }
        
        // Show success dialog for installments
        const firstInvoice = {
          id: Date.now(),
          invoiceNumber: `INV-${Date.now()}-1`,
          studentName: invoiceData.studentName,
          studentCode: invoiceData.studentCode,
          courseName: invoiceData.courseName,
          amount: installmentInvoices[0].amount,
          paymentMethod: 'cash',
          paymentDate: new Date().toISOString().split('T')[0],
          status: 'pending',
          description: installmentInvoices[0].description,
          dueDate: installmentInvoices[0].dueDate
        };

        setSuccessData({
          type: 'installments',
          installments: formData.installments,
          totalAmount: invoiceData.amount,
          installmentAmount: installmentAmount,
          invoice: firstInvoice,
          studentName: invoiceData.studentName,
          courseName: invoiceData.courseName
        });
        setShowSuccessDialog(true);
      } else {
        if (onSubmit) {
          onSubmit([invoiceData]);
        }
        
        // Show success dialog for single invoice
        const invoice = {
          id: Date.now(),
          invoiceNumber: `INV-${Date.now()}`,
          studentName: invoiceData.studentName,
          studentCode: invoiceData.studentCode,
          courseName: invoiceData.courseName,
          amount: invoiceData.amount,
          paymentMethod: 'cash',
          paymentDate: new Date().toISOString().split('T')[0],
          status: 'pending',
          description: formData.description,
          dueDate: formData.dueDate
        };

        setSuccessData({
          type: 'single',
          invoice: invoice,
          studentName: invoiceData.studentName,
          courseName: invoiceData.courseName,
          amount: invoiceData.amount,
          dueDate: formData.dueDate
        });
        setShowSuccessDialog(true);
      }
    } catch (error) {
      console.error('Error creating invoice:', error);
      setErrors({ submit: 'Có lỗi xảy ra khi tạo hóa đơn. Vui lòng thử lại.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateInstallmentPreview = () => {
    if (!formData.amount || !showInstallments || formData.installments <= 1) return [];
    
    const totalAmount = parseFloat(formData.amount);
    const installmentAmount = Math.round(totalAmount / formData.installments);
    const preview = [];
    
    for (let i = 0; i < formData.installments; i++) {
      const dueDate = new Date(formData.dueDate || new Date());
      dueDate.setMonth(dueDate.getMonth() + i);
      
      const amount = i === formData.installments - 1 
        ? totalAmount - (installmentAmount * (formData.installments - 1))
        : installmentAmount;
      
      preview.push({
        installment: i + 1,
        amount,
        dueDate: dueDate.toLocaleDateString('vi-VN'),
      });
    }
    
    return preview;
  };



  // Function to show invoice using InvoiceModal component
  const displayInvoiceModal = (invoice) => {
    setPreviewInvoice(invoice);
    setShowInvoicePreview(true);
  };

  // Handle success dialog actions
  const handleViewInvoice = () => {
    console.log('Invoice data being passed to modal:', successData.invoice);
    setShowSuccessDialog(false);
    displayInvoiceModal(successData.invoice);
  };

  const handleCloseSuccessDialog = () => {
    setShowSuccessDialog(false);
    setSuccessData(null);
    onClose(); // Close the main modal
  };



  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4"
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflowY: 'auto'
      }}
      onScroll={(e) => e.stopPropagation()}
    >
      <div 
        className="relative mx-auto w-full max-w-4xl bg-white rounded-xl shadow-2xl border border-gray-200 max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="overflow-y-auto max-h-[90vh] finance-modal-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-xl">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Tạo hóa đơn mới</h3>
            <p className="text-sm text-gray-500">
              {student?.name ? `${student.name} (${student.code}) - ${student.email}` : 'Tạo hóa đơn cho học viên'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-colors"
          >
            <span className="sr-only">Đóng</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Invoice Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loại hóa đơn *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {invoiceTypes.map((type) => (
                    <label
                      key={type.id}
                      className={`flex items-center p-3 border rounded-lg cursor-pointer ${
                        formData.invoiceType === type.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="invoiceType"
                        value={type.id}
                        checked={formData.invoiceType === type.id}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <span className="text-2xl mr-2">{type.icon}</span>
                      <span className="text-sm font-medium">{type.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Course Selection (only for tuition) */}
              {formData.invoiceType === 'tuition' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Khóa học *
                  </label>
                  <select
                    name="courseId"
                    value={formData.courseId}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.courseId ? 'border-red-500' : ''
                    }`}
                  >
                    <option value="">Chọn khóa học</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.name} - {formatCurrency(course.fee)}
                      </option>
                    ))}
                  </select>
                  {errors.courseId && (
                    <p className="mt-1 text-sm text-red-600">{errors.courseId}</p>
                  )}
                </div>
              )}

              {/* Amount */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Số tiền *
                  </label>
                  {formData.invoiceType === 'tuition' && selectedCourse && (
                    <label className="flex items-center text-sm">
                      <input
                        type="checkbox"
                        name="customAmount"
                        checked={formData.customAmount}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      Nhập số tiền tùy chỉnh
                    </label>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    placeholder="Nhập số tiền"
                    min="0"
                    step="1000"
                    className={`mt-1 block w-full px-3 py-2 pr-12 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      errors.amount ? 'border-red-500' : ''
                    }`}
                    disabled={formData.invoiceType === 'tuition' && selectedCourse && !formData.customAmount}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 text-sm">VNĐ</span>
                  </div>
                </div>
                {formData.amount && (
                  <p className="mt-1 text-sm text-gray-600">
                    {formatCurrency(parseFloat(formData.amount) || 0)}
                  </p>
                )}
                {errors.amount && (
                  <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
                )}
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hạn thanh toán *
                </label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    errors.dueDate ? 'border-red-500' : ''
                  }`}
                />
                {errors.dueDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.dueDate}</p>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Mô tả chi tiết về hóa đơn"
                  className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    errors.description ? 'border-red-500' : ''
                  }`}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
              </div>

              {/* Installments */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Thanh toán theo đợt
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={showInstallments}
                      onChange={(e) => setShowInstallments(e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-600">Chia nhiều đợt</span>
                  </label>
                </div>

                {showInstallments && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số đợt thanh toán
                      </label>
                      <input
                        type="number"
                        name="installments"
                        value={formData.installments}
                        onChange={handleInputChange}
                        min="2"
                        max="12"
                        className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                          errors.installments ? 'border-red-500' : ''
                        }`}
                      />
                      {errors.installments && (
                        <p className="mt-1 text-sm text-red-600">{errors.installments}</p>
                      )}
                    </div>

                    {/* Installment Preview */}
                    {formData.amount && formData.dueDate && formData.installments > 1 && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-900 mb-3">
                          Dự kiến các đợt thanh toán:
                        </h4>
                        <div className="space-y-2">
                          {calculateInstallmentPreview().map((installment, index) => (
                            <div key={index} className="flex justify-between items-center text-sm">
                              <span>Đợt {installment.installment}</span>
                              <span className="font-medium">
                                {formatCurrency(installment.amount)} - {installment.dueDate}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ghi chú
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Ghi chú thêm (không bắt buộc)"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Error Message */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-sm text-red-600">{errors.submit}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
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
              onClick={() => console.log('Button clicked!')}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang tạo...
                </div>
              ) : (
                '📄 Tạo hóa đơn'
              )}
            </button>
          </div>
        </form>
        </div>
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
              🎉 Tạo hóa đơn thành công!
            </h3>

            {/* Content */}
            <div className="text-center text-gray-600 mb-6">
              {successData.type === 'installments' ? (
                <div className="space-y-2">
                  <p className="font-medium">Đã tạo thành công <span className="text-teal-600 font-bold">{successData.installments} hóa đơn</span> theo đợt!</p>
                  <div className="bg-gray-50 rounded-lg p-3 text-sm">
                    <div className="flex justify-between">
                      <span>Tổng số tiền:</span>
                      <span className="font-bold text-teal-600">{formatCurrency(successData.totalAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Số đợt:</span>
                      <span className="font-medium">{successData.installments} đợt</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Mỗi đợt:</span>
                      <span className="font-medium">{formatCurrency(successData.installmentAmount)}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="font-medium">Hóa đơn đã được tạo thành công!</p>
                  <div className="bg-gray-50 rounded-lg p-3 text-sm">
                    <div className="flex justify-between">
                      <span>Học viên:</span>
                      <span className="font-medium">{successData.studentName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Khóa học:</span>
                      <span className="font-medium">{successData.courseName || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Số tiền:</span>
                      <span className="font-bold text-teal-600">{formatCurrency(successData.amount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Hạn thanh toán:</span>
                      <span className="font-medium">{new Date(successData.dueDate).toLocaleDateString('vi-VN')}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex space-x-3">
              <button
                onClick={handleCloseSuccessDialog}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors"
              >
                Đóng
              </button>
              <button
                onClick={handleViewInvoice}
                className="flex-1 px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-200 shadow-sm"
              >
                🧾 Xem biên lai
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Preview Modal */}
      {showInvoicePreview && previewInvoice && (
        <InvoiceModal
          invoice={previewInvoice}
          onClose={() => {
            setShowInvoicePreview(false);
            setPreviewInvoice(null);
          }}
        />
      )}
    </div>
  );
};

export default InvoiceCreation;