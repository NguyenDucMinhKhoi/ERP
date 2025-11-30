import React, { useState, useEffect } from 'react';
import financeService from '../../services/financeService';
import crmService from '../../services/crmService';

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
  validatePaymentData,
}) => {
  const [formData, setFormData] = useState({
    hocvien: '',
    studentSearchTerm: '',
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

  // Student search states (server-side, debounced)
  const [searchResults, setSearchResults] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [loadingInvoiceData, setLoadingInvoiceData] = useState(false);
  const [studentsLoadedCount, setStudentsLoadedCount] = useState(0);
  const [studentsLoaded, setStudentsLoaded] = useState(true); // server search available immediately

  // Server-side debounced search for students using crmService.getStudents
  useEffect(() => {
    let mounted = true;
    let timer = null;
    const term = formData.studentSearchTerm?.trim();

    // Do not perform search when a student is already selected
    if (selectedStudent) {
      // ensure dropdown closed if a student is selected
      setShowSearchDropdown(false);
      setIsSearching(false);
      return;
    }

    if (!term || term.length < 2) {
      setSearchResults([]);
      setStudentsLoadedCount(0);
      setShowSearchDropdown(false);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    setShowSearchDropdown(true);

    timer = setTimeout(async () => {
      try {
        const params = { search: term, page_size: 50 };
        const resp = await crmService.getStudents(params);
        const items = Array.isArray(resp) ? resp : resp.results || resp;
        const total =
          resp.count ||
          (Array.isArray(resp)
            ? resp.length
            : resp.results
            ? resp.count
            : items.length);
        if (!mounted) return;
        setSearchResults(items || []);
        setStudentsLoadedCount(total || (items ? items.length : 0));
        setStudentsLoaded(true);
      } catch (err) {
        console.error('Error searching students (PaymentForm):', err);
        if (mounted) {
          setSearchResults([]);
          setStudentsLoadedCount(0);
          setStudentsLoaded(true);
        }
      } finally {
        if (mounted) setIsSearching(false);
      }
    }, 300);

    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [formData.studentSearchTerm, selectedStudent]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showSearchDropdown &&
        !event.target.closest('.student-search-container')
      ) {
        setShowSearchDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSearchDropdown]);

  // Generate receipt number on component mount
  useEffect(() => {
    if (generateReceiptNumber) {
      setFormData((prev) => ({
        ...prev,
        so_bien_lai: generateReceiptNumber(),
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

    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }));

    // Clear selected student when search term changes
    if (name === 'studentSearchTerm' && selectedStudent) {
      setSelectedStudent(null);
      setFormData((prev) => ({
        ...prev,
        hocvien: '',
        so_bien_lai: generateReceiptNumber?.() || '',
        so_tien: '',
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // Handle student selection from dropdown
  const handleStudentSelect = async (student) => {
    console.log('👤 Student selected in PaymentForm:', student);
    setSelectedStudent(student);
    // Clear the visible input term (we display selected student separately)
    setFormData((prev) => ({
      ...prev,
      hocvien: student.id,
      studentSearchTerm: '',
    }));
    setShowSearchDropdown(false);
    setErrors((prev) => ({ ...prev, hocvien: '', studentSearchTerm: '' }));

    // Auto-generate new receipt number for this student
    await loadStudentReceiptNumber(student.id);
  };

  // Clear student selection
  const clearStudentSelection = () => {
    setSelectedStudent(null);
    setFormData((prev) => ({
      ...prev,
      hocvien: '',
      studentSearchTerm: '',
      so_bien_lai: generateReceiptNumber?.() || '',
      so_tien: '',
    }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  // Format number with dots for display (e.g., 2500000 -> 2.500.000)
  const formatNumberWithDots = (num) => {
    if (!num) return '';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  // Load student's receipt number - generate new unique receipt for each payment
  const loadStudentReceiptNumber = async (studentId) => {
    setLoadingInvoiceData(true);
    try {
      console.log('📝 Loading receipt number for student:', studentId);

      // Always generate a new receipt number for new payment
      const newReceiptNumber =
        generateReceiptNumber?.() || financeService.generateReceiptNumber();

      console.log('🎫 Generated new receipt number:', newReceiptNumber);

      setFormData((prev) => ({
        ...prev,
        so_bien_lai: newReceiptNumber,
      }));
    } catch (error) {
      console.error('❌ Error generating receipt number:', error);
      // Fallback receipt number
      const fallbackReceipt = `BL${Date.now()}`;
      setFormData((prev) => ({
        ...prev,
        so_bien_lai: fallbackReceipt,
      }));
    } finally {
      setLoadingInvoiceData(false);
    }
  };

  // Load student's existing invoice data (receipt number and amount) - keeping for backward compatibility
  const loadStudentInvoiceData = async (studentId) => {
    setLoadingInvoiceData(true);
    try {
      // Get student's payment history to find existing invoices
      const paymentHistory = await financeService.getStudentPaymentHistory(
        studentId
      );

      if (paymentHistory.results && paymentHistory.results.length > 0) {
        // Get the most recent payment/invoice
        const latestPayment = paymentHistory.results[0];

        // Update form with existing invoice data
        setFormData((prev) => ({
          ...prev,
          so_bien_lai:
            latestPayment.so_bien_lai || generateReceiptNumber?.() || '',
          so_tien: latestPayment.so_tien?.toString() || '',
        }));
      } else {
        // No existing invoices, generate new receipt number
        setFormData((prev) => ({
          ...prev,
          so_bien_lai: generateReceiptNumber?.() || '',
          so_tien: '',
        }));
      }
    } catch (error) {
      console.error('Error loading student invoice data:', error);
      // Fallback to generating new receipt number
      setFormData((prev) => ({
        ...prev,
        so_bien_lai: generateReceiptNumber?.() || '',
      }));
    } finally {
      setLoadingInvoiceData(false);
    }
  };

  const validateForm = () => {
    if (validatePaymentData) {
      const validation = validatePaymentData(formData);
      setErrors(validation.errors);
      return validation.isValid;
    }
    // Simple validation fallback
    const errors = {};
    if (!selectedStudent) errors.hocvien = 'Vui lòng chọn học viên';
    if (!formData.so_tien) errors.so_tien = 'Vui lòng nhập số tiền';
    if (!formData.hinh_thuc)
      errors.hinh_thuc = 'Vui lòng chọn hình thức thanh toán';

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
      // Build payload and explicitly mark as paid so backend will set ngay_dong and update HocVien
      const paymentData = {
        ...formData,
        so_tien: parseFloat(formData.so_tien),
        // ensure backend marks this record as paid
        trang_thai: 'paid',
      };

      // Create payment (use parent callback if provided, else call service directly)
      const savedPayment = onCreatePayment
        ? await onCreatePayment(paymentData)
        : await financeService.createPayment(paymentData);

      // savedPayment may be the created object (or undefined depending on parent); attempt to read fields safely
      const paymentDate =
        (savedPayment && (savedPayment.ngay_dong || savedPayment.created_at)) ||
        new Date().toISOString();

      // Prepare success data using savedPayment when available
      const selectedStudentObj =
        selectedStudent ||
        students.find((s) => s.id === formData.hocvien) ||
        {};
      const selectedPaymentMethod = paymentMethods.find(
        (m) => m.id === formData.hinh_thuc
      );

      setSuccessData({
        studentName: selectedStudentObj.ten || 'N/A',
        amount: parseFloat(formData.so_tien),
        paymentMethod: selectedPaymentMethod?.name,
        receiptNumber: formData.so_bien_lai,
        description: formData.ghi_chu,
        paymentDate,
        raw: savedPayment || null,
      });

      setShowSuccessDialog(true);

      // Call success callback if provided
      if (onSuccess) onSuccess();
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
      {/* Student Search */}
      <div className="student-search-container relative">
        <label
          htmlFor="studentSearchTerm"
          className="block text-sm font-medium text-gray-700"
        >
          Học viên <span className="text-red-500">*</span>{' '}
          {!studentsLoaded && '(Đang tải danh sách học viên có hóa đơn...)'}
        </label>

        {!selectedStudent ? (
          <>
            <input
              type="text"
              id="studentSearchTerm"
              name="studentSearchTerm"
              value={formData.studentSearchTerm}
              onChange={handleInputChange}
              placeholder={
                studentsLoaded
                  ? 'Nhập tên học viên có hóa đơn...'
                  : 'Đang tải danh sách học viên...'
              }
              disabled={!studentsLoaded}
              className={`mt-1 block w-full px-3 py-2 pr-10 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                errors.hocvien || errors.studentSearchTerm
                  ? 'border-red-300'
                  : 'border-gray-300'
              } ${!studentsLoaded ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              autoComplete="off"
            />
            {isSearching && (
              <div className="absolute inset-y-0 right-0 top-6 flex items-center pr-3">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
              </div>
            )}
          </>
        ) : (
          <div className="mt-1 flex items-center space-x-2">
            <div className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm">
              <span className="font-medium">{selectedStudent.ten}</span>
            </div>
            <button
              type="button"
              onClick={clearStudentSelection}
              className="px-3 py-2 text-sm text-gray-500 hover:text-red-500 border border-gray-300 rounded-md hover:border-red-300 transition-colors"
              title="Xóa lựa chọn"
            >
              ✕
            </button>
          </div>
        )}

        {/* Loading indicator for receipt generation */}
        {loadingInvoiceData && (
          <div className="mt-2 flex items-center space-x-2 text-sm text-gray-600">
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-500"></div>
            <span>Đang tạo mã biên lai...</span>
          </div>
        )}

        {/* Search Results Dropdown */}
        {showSearchDropdown && searchResults.length > 0 && !selectedStudent && (
          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
            {searchResults.map((student) => (
              <div
                key={student.id}
                onClick={() => handleStudentSelect(student)}
                className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {student.ten}
                    </p>
                    <p className="text-xs text-gray-500">
                      Mã: {student.ma_hoc_vien}
                    </p>
                    {student.khoahoc?.ten_khoa_hoc && (
                      <p className="text-xs text-gray-500">
                        Khóa: {student.khoahoc.ten_khoa_hoc}
                      </p>
                    )}
                  </div>
                  <div>
                    {student.trang_thai_hoc_phi === 'dadong' && (
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
                        Đã đóng
                      </span>
                    )}
                    {student.trang_thai_hoc_phi === 'chuadong' && (
                      <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">
                        Chưa đóng
                      </span>
                    )}
                    {student.trang_thai_hoc_phi === 'conno' && (
                      <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700">
                        Còn nợ
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No results message */}
        {showSearchDropdown &&
          searchResults.length === 0 &&
          !isSearching &&
          (() => {
            const trimmedTerm = (formData.studentSearchTerm || '').trim();
            return trimmedTerm.length >= 2 && studentsLoaded ? (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                <div className="px-4 py-3 text-sm text-gray-500 text-center">
                  Không tìm thấy học viên có hóa đơn với từ khóa "{trimmedTerm}"
                  <br />
                  <small>
                    Tổng số học viên có hóa đơn: {studentsLoadedCount}
                  </small>
                </div>
              </div>
            ) : null;
          })()}

        {(errors.hocvien || errors.studentSearchTerm) && (
          <p className="mt-1 text-sm text-red-600">
            {errors.hocvien || errors.studentSearchTerm}
          </p>
        )}
      </div>

      {/* Payment Amount */}
      <div>
        <label
          htmlFor="so_tien"
          className="block text-sm font-medium text-gray-700"
        >
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
          {paymentMethods.map((method) => (
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
        <label
          htmlFor="so_bien_lai"
          className="block text-sm font-medium text-gray-700"
        >
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
        <label
          htmlFor="ghi_chu"
          className="block text-sm font-medium text-gray-700"
        >
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
                <svg
                  className="w-8 h-8 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-center text-gray-900 mb-2">
              🎉 Ghi nhận thanh toán thành công!
            </h3>

            {/* Content */}
            <div className="text-center text-gray-600 mb-6">
              <p className="font-medium mb-3">
                Thanh toán đã được ghi nhận vào hệ thống
              </p>
              <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-2">
                <div className="flex justify-between">
                  <span>Học viên:</span>
                  <span className="font-medium">{successData.studentName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Số biên lai:</span>
                  <span className="font-medium">
                    {successData.receiptNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Số tiền:</span>
                  <span className="font-bold text-teal-600">
                    {formatCurrency(successData.amount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Phương thức:</span>
                  <span className="font-medium">
                    {successData.paymentMethod}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Ngày thanh toán:</span>
                  <span className="font-medium">
                    {new Date(successData.paymentDate).toLocaleDateString(
                      'vi-VN'
                    )}
                  </span>
                </div>
                {successData.description && (
                  <div className="flex justify-between">
                    <span>Ghi chú:</span>
                    <span className="font-medium">
                      {successData.description}
                    </span>
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
                <svg
                  className="w-8 h-8 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-center text-gray-900 mb-2">
              ❌ Có lỗi xảy ra
            </h3>

            {/* Content */}
            <div className="text-center text-gray-600 mb-6">
              <p className="font-medium">
                Không thể ghi nhận thanh toán. Vui lòng thử lại sau.
              </p>
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
