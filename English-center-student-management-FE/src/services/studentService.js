// Student-specific services
import authService from './authService';

const http = authService.client;

// Course Service
export const courseService = {
  // Lấy danh sách khóa học của học viên
  async getMyCourses() {
    try {
      const { data } = await http.get('/dangky/me/');
      return data;
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  },

  // Lấy chi tiết khóa học
  async getCourseDetails(courseId) {
    try {
      const token = authService.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/student/courses/${courseId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch course details');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching course details:', error);
      throw error;
    }
  },

  // Đăng ký khóa học mới
  async enrollCourse(courseId) {
    try {
      const token = authService.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/student/courses/${courseId}/enroll`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to enroll in course');
      }

      return await response.json();
    } catch (error) {
      console.error('Error enrolling in course:', error);
      throw error;
    }
  },

  // Cập nhật tiến độ học
  async updateProgress(courseId, lessonId, progress) {
    try {
      const token = authService.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/student/courses/${courseId}/lessons/${lessonId}/progress`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ progress }),
      });

      if (!response.ok) {
        throw new Error('Failed to update progress');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating progress:', error);
      throw error;
    }
  }
};

// Schedule Service
export const scheduleService = {
  // Lấy lịch học của học viên
  async getMySchedule(startDate, endDate) {
    try {
      // Get enrollments first to get lop_hoc IDs
      const enrollments = await http.get('/dangky/me/');
      
      // Get all schedules for enrolled classes
      const schedules = [];
      for (const enroll of enrollments.data) {
        if (enroll.lop_hoc) {
          const { data } = await http.get(`/lichhocs/?lop_hoc=${enroll.lop_hoc.id}`);
          schedules.push(...data);
        }
      }
      
      // Filter by date range if provided
      let filtered = schedules;
      if (startDate || endDate) {
        filtered = schedules.filter(item => {
          const scheduleDate = new Date(item.ngay_hoc);
          if (startDate && scheduleDate < startDate) return false;
          if (endDate && scheduleDate > endDate) return false;
          return true;
        });
      }
      
      return filtered;
    } catch (error) {
      console.error('Error fetching schedule:', error);
      throw error;
    }
  },

  // Lấy lịch học theo tuần
  async getWeeklySchedule(weekStart) {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    return this.getMySchedule(weekStart, weekEnd);
  },

  // Lấy lịch học theo tháng
  async getMonthlySchedule(year, month) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    return this.getMySchedule(startDate, endDate);
  },

  // Điểm danh
  async checkAttendance(classId, status) {
    try {
      const token = authService.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/student/schedule/${classId}/attendance`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to check attendance');
      }

      return await response.json();
    } catch (error) {
      console.error('Error checking attendance:', error);
      throw error;
    }
  }
};

// Payment Service
export const paymentService = {
  // Lấy thông tin thanh toán của học viên
  async getMyPayments() {
    try {
      const { data } = await http.get('/thanhtoans/me/');
      return data;
    } catch (error) {
      console.error('Error fetching payments:', error);
      throw error;
    }
  },

  // Lấy học phí sắp tới
  async getUpcomingPayments() {
    try {
      const token = authService.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/student/payments/upcoming`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch upcoming payments');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching upcoming payments:', error);
      throw error;
    }
  },

  // Tạo yêu cầu thanh toán
  async createPaymentRequest(paymentData) {
    try {
      const token = authService.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/student/payments/request`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment request');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating payment request:', error);
      throw error;
    }
  },

  // Xác nhận thanh toán
  async confirmPayment(paymentId, paymentMethod, transactionId) {
    try {
      const token = authService.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/student/payments/${paymentId}/confirm`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentMethod, transactionId }),
      });

      if (!response.ok) {
        throw new Error('Failed to confirm payment');
      }

      return await response.json();
    } catch (error) {
      console.error('Error confirming payment:', error);
      throw error;
    }
  },

  // Tải hóa đơn
  async downloadInvoice(paymentId) {
    try {
      const token = authService.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/student/payments/${paymentId}/invoice`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to download invoice');
      }

      return response.blob();
    } catch (error) {
      console.error('Error downloading invoice:', error);
      throw error;
    }
  }
};

// Support Service
export const supportService = {
  // Lấy thông báo
  async getNotifications() {
    try {
      const token = authService.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/student/notifications`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },

  // Đánh dấu thông báo đã đọc
  async markNotificationAsRead(notificationId) {
    try {
      const token = authService.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/student/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to mark notification as read');
      }

      return await response.json();
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  // Lấy danh sách yêu cầu hỗ trợ
  async getSupportTickets() {
    try {
      const token = authService.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/student/support/tickets`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch support tickets');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching support tickets:', error);
      throw error;
    }
  },

  // Tạo yêu cầu hỗ trợ mới
  async createSupportTicket(ticketData) {
    try {
      const token = authService.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/student/support/tickets`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ticketData),
      });

      if (!response.ok) {
        throw new Error('Failed to create support ticket');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating support ticket:', error);
      throw error;
    }
  },

  // Gửi góp ý
  async submitFeedback(feedbackData) {
    try {
      const token = authService.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/student/feedback`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }

      return await response.json();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      throw error;
    }
  }
};

// Profile Service
export const profileService = {
  // Lấy thông tin profile
  async getProfile() {
    try {
      const token = authService.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/student/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  },

  // Cập nhật thông tin profile
  async updateProfile(profileData) {
    try {
      const token = authService.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/student/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  // Đổi mật khẩu
  async changePassword(passwordData) {
    try {
      const token = authService.getAccessToken();
      const response = await fetch(`${API_BASE_URL}/student/profile/password`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(passwordData),
      });

      if (!response.ok) {
        throw new Error('Failed to change password');
      }

      return await response.json();
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  },

  // Upload avatar
  async uploadAvatar(file) {
    try {
      const token = authService.getAccessToken();
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch(`${API_BASE_URL}/student/profile/avatar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload avatar');
      }

      return await response.json();
    } catch (error) {
      console.error('Error uploading avatar:', error);
      throw error;
    }
  }
};

export default {
  courseService,
  scheduleService,
  paymentService,
  supportService,
  profileService
};
