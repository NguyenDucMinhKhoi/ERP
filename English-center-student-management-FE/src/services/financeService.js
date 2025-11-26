/**
 * Finance Service - API layer for financial operations
 * Handles payments, debt management, and financial reporting
 */

const API_BASE_URL = import.meta.env.VITE_API_URL;

class FinanceService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method to get auth headers
  getAuthHeaders() {
    // Use the same token keys as authService
    const token = localStorage.getItem('ecsm_access_token') || 
                 sessionStorage.getItem('ecsm_access_token') ||
                 localStorage.getItem('access_token'); // fallback
    
    if (!token) {
      console.warn('No access token found in storage');
    }
    
    return {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    };
  }

  // Helper method to handle API responses
  async handleResponse(response) {
    if (!response.ok) {
      if (response.status === 401) {
        // Handle unauthorized - might need to redirect to login
        console.error('Unauthorized access - token may be invalid or expired');
        // Clear potentially invalid token
        localStorage.removeItem('ecsm_access_token');
        localStorage.removeItem('ecsm_refresh_token');
        sessionStorage.removeItem('ecsm_access_token');
        sessionStorage.removeItem('ecsm_refresh_token');
        
        throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      }
      
      const error = await response.json().catch(() => ({ 
        message: `HTTP error! status: ${response.status}` 
      }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  // Helper method to check if user is authenticated
  isAuthenticated() {
    const token = localStorage.getItem('ecsm_access_token') || 
                 sessionStorage.getItem('ecsm_access_token') ||
                 localStorage.getItem('access_token'); // fallback
    return !!token;
  }

  // === PAYMENT MANAGEMENT ===

  /**
   * Get all payments with filtering and pagination
   * @param {Object} params - Query parameters
   */
  async getPayments(params = {}) {
    const searchParams = new URLSearchParams();
    
    if (params.search) searchParams.append('search', params.search);
    if (params.hinh_thuc) searchParams.append('hinh_thuc', params.hinh_thuc);
    if (params.hocvien) searchParams.append('hocvien', params.hocvien);
    if (params.ordering) searchParams.append('ordering', params.ordering);
    if (params.page) searchParams.append('page', params.page);
    if (params.page_size) searchParams.append('page_size', params.page_size);

    const url = `${this.baseURL}/thanhtoans/?${searchParams}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse(response);
  }

  /**
   * Get payment by ID
   * @param {string} paymentId - Payment ID
   */
  async getPayment(paymentId) {
    const response = await fetch(`${this.baseURL}/thanhtoans/${paymentId}/`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse(response);
  }

  /**
   * Create new payment
   * @param {Object} paymentData - Payment data
   */
  async createPayment(paymentData) {
    const response = await fetch(`${this.baseURL}/thanhtoans/`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(paymentData),
    });

    return this.handleResponse(response);
  }

  /**
   * Update payment
   * @param {string} paymentId - Payment ID
   * @param {Object} paymentData - Updated payment data
   */
  async updatePayment(paymentId, paymentData) {
    const response = await fetch(`${this.baseURL}/thanhtoans/${paymentId}/`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(paymentData),
    });

    return this.handleResponse(response);
  }

  /**
   * Delete payment
   * @param {string} paymentId - Payment ID
   */
  async deletePayment(paymentId) {
    const response = await fetch(`${this.baseURL}/thanhtoans/${paymentId}/`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.status === 204;
  }

  /**
   * Get my payments (for students)
   */
  async getMyPayments() {
    const response = await fetch(`${this.baseURL}/thanhtoans/me/`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse(response);
  }

  // === FINANCIAL STATISTICS ===

  /**
   * Get financial statistics and overview
   */
  async getPaymentStats() {
    const response = await fetch(`${this.baseURL}/thanhtoans/stats/`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse(response);
  }

  /**
   * Get monthly revenue data for charts
   * @param {number} months - Number of months to retrieve
   */
  async getMonthlyRevenue(months = 12) {
    try {
      const payments = await this.getPayments({ 
        page_size: 1000,
        ordering: '-ngay_dong'
      });

      // Process payments into monthly data
      const monthlyData = {};
      const now = new Date();
      
      // Initialize last N months
      for (let i = 0; i < months; i++) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        monthlyData[key] = {
          month: date.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' }),
          total: 0,
          count: 0
        };
      }

      // Aggregate payment data
      payments.results?.forEach(payment => {
        const paymentDate = new Date(payment.ngay_dong);
        const key = `${paymentDate.getFullYear()}-${String(paymentDate.getMonth() + 1).padStart(2, '0')}`;
        
        if (monthlyData[key]) {
          monthlyData[key].total += parseFloat(payment.so_tien);
          monthlyData[key].count += 1;
        }
      });

      return Object.values(monthlyData).reverse();
    } catch (error) {
      console.error('Error fetching monthly revenue:', error);
      throw error;
    }
  }

  /**
   * Get payment method statistics
   */
  async getPaymentMethodStats() {
    try {
      const stats = await this.getPaymentStats();
      
      return [
        { name: 'Tiền mặt', value: stats.tien_mat || 0, color: '#8884d8' },
        { name: 'Chuyển khoản', value: stats.chuyen_khoan || 0, color: '#82ca9d' },
        { name: 'Thẻ', value: stats.the || 0, color: '#ffc658' },
      ];
    } catch (error) {
      console.error('Error fetching payment method stats:', error);
      throw error;
    }
  }

  // === DEBT MANAGEMENT ===

  /**
   * Get students with outstanding debt
   */
  async getStudentsWithDebt() {
    try {
      // This might need a custom endpoint in the future
      // For now, we'll simulate it by getting students and checking payment status
      const response = await fetch(`${this.baseURL}/hocviens/?trang_thai_hoc_phi=conno,chuadong`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      return this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching students with debt:', error);
      throw error;
    }
  }

  /**
   * Get payment history for a specific student
   * @param {string} studentId - Student ID
   */
  async getStudentPaymentHistory(studentId) {
    const response = await fetch(`${this.baseURL}/thanhtoans/?hocvien=${studentId}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse(response);
  }

  // === INVOICE MANAGEMENT ===

  /**
   * Generate invoice for payment
   * @param {string} paymentId - Payment ID
   */
  async generateInvoice(paymentId) {
    // This would need to be implemented in the backend
    const payment = await this.getPayment(paymentId);
    
    // For now, return formatted data for invoice generation
    return {
      invoice_number: payment.so_bien_lai,
      payment_data: payment,
      generated_at: new Date().toISOString(),
    };
  }

  // === UTILITY METHODS ===

  /**
   * Format currency for display
   * @param {number} amount - Amount to format
   */
  formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(amount);
  }

  /**
   * Generate unique receipt number
   */
  generateReceiptNumber() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const timestamp = Date.now().toString().slice(-4);
    
    return `BL${year}${month}${day}${timestamp}`;
  }

  /**
   * Validate payment data before submission
   * @param {Object} paymentData - Payment data to validate
   */
  validatePaymentData(paymentData) {
    const errors = {};

    if (!paymentData.hocvien) {
      errors.hocvien = 'Vui lòng chọn học viên';
    }

    if (!paymentData.so_tien || paymentData.so_tien <= 0) {
      errors.so_tien = 'Số tiền phải lớn hơn 0';
    }

    if (!paymentData.hinh_thuc) {
      errors.hinh_thuc = 'Vui lòng chọn hình thức thanh toán';
    }

    if (!paymentData.so_bien_lai) {
      errors.so_bien_lai = 'Vui lòng nhập số biên lai';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  // === DEBT MANAGEMENT ===

  /**
   * Get students with debt information
   * @param {Object} params - Query parameters
   */
  async getStudentDebtInfo(params = {}) {
    try {
      const searchParams = new URLSearchParams();
      
      if (params.search) searchParams.append('search', params.search);
      if (params.trang_thai_hoc_phi) searchParams.append('trang_thai_hoc_phi', params.trang_thai_hoc_phi);
      if (params.ordering) searchParams.append('ordering', params.ordering);
      if (params.page) searchParams.append('page', params.page);
      if (params.page_size) searchParams.append('page_size', params.page_size);

      const url = `${this.baseURL}/hocviens/?${searchParams}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const data = await this.handleResponse(response);
      
      // Transform data to include debt calculations
      if (data.results) {
        const studentsWithDebt = await Promise.all(
          data.results.map(async (student) => {
            // Get payment history for this student
            const paymentHistory = await this.getPayments({ 
              hocvien: student.id,
              page_size: 100 
            });
            
            const payments = paymentHistory.data?.results || [];
            const totalPaid = payments.reduce((sum, payment) => sum + Number(payment.so_tien || 0), 0);
            
            // Calculate debt based on course fee and payments
            const courseFee = student.khoahoc?.hoc_phi || 0;
            const totalDebt = Math.max(0, courseFee - totalPaid);
            const overdueDebt = student.trang_thai_hoc_phi === 'conno' ? totalDebt : 0;
            
            return {
              ...student,
              totalDebt,
              overdueDebt,
              totalPaid,
              paymentHistory: payments,
              status: this.getDebtStatus(student, totalDebt)
            };
          })
        );
        
        return {
          ...data,
          results: studentsWithDebt
        };
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching student debt info:', error);
      throw error;
    }
  }

  /**
   * Get debt statistics
   */
  async getDebtStats() {
    try {
      const studentsResponse = await this.getStudentDebtInfo({ page_size: 1000 });
      const students = studentsResponse.results || [];
      
      const totalStudentsWithDebt = students.filter(s => s.totalDebt > 0).length;
      const totalDebtAmount = students.reduce((sum, s) => sum + s.totalDebt, 0);
      const totalOverdueAmount = students.reduce((sum, s) => sum + s.overdueDebt, 0);
      const overdueStudents = students.filter(s => s.overdueDebt > 0).length;
      
      return {
        totalStudentsWithDebt,
        totalDebtAmount,
        totalOverdueAmount,
        overdueStudents,
        averageDebtPerStudent: totalStudentsWithDebt > 0 ? totalDebtAmount / totalStudentsWithDebt : 0
      };
    } catch (error) {
      console.error('Error fetching debt stats:', error);
      throw error;
    }
  }

  /**
   * Send payment reminder to student
   * @param {number} studentId - Student ID
   * @param {string} message - Reminder message
   */
  async sendPaymentReminder(studentId, message) {
    try {
      const url = `${this.baseURL}/hocviens/${studentId}/send-reminder/`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ message }),
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error sending payment reminder:', error);
      throw error;
    }
  }

  /**
   * Get debt status based on student info and debt amount
   * @param {Object} student - Student object
   * @param {number} totalDebt - Total debt amount
   */
  getDebtStatus(student, totalDebt) {
    if (totalDebt === 0) return 'paid';
    if (student.trang_thai_hoc_phi === 'conno') return 'overdue';
    if (student.trang_thai_hoc_phi === 'chuadong') return 'due_soon';
    return 'current';
  }

  /**
   * Calculate days overdue based on course start date
   * @param {Object} student - Student with course info
   */
  calculateDaysOverdue(student) {
    if (!student.khoahoc?.ngay_bat_dau) return 0;
    
    const today = new Date();
    const courseStart = new Date(student.khoahoc.ngay_bat_dau);
    const diffTime = today - courseStart;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diffDays - 30); // Assume 30 days grace period
  }
}

// Export singleton instance
const financeService = new FinanceService();
export default financeService;
