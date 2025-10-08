// Course Management API Service
import authService from "./authService";

const API_BASE_URL = import.meta.env.VITE_API_URL;

class CourseService {
  // Helper method để lấy headers với authentication
  getHeaders() {
    const token = authService.getAccessToken();
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  // ===== KHÓA HỌC (KhoaHoc) APIs =====

  /**
   * Lấy danh sách khóa học với filter và search
   * @param {Object} params - Query parameters { search, trang_thai, giang_vien, ordering }
   */
  async getCourses(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`${API_BASE_URL}/khoahocs/?${queryString}`, {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching courses:", error);
      throw error;
    }
  }

  /**
   * Lấy chi tiết khóa học
   * @param {string} courseId - ID của khóa học
   */
  async getCourse(courseId) {
    try {
      const response = await fetch(`${API_BASE_URL}/khoahocs/${courseId}/`, {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching course:", error);
      throw error;
    }
  }

  /**
   * Tạo khóa học mới
   * @param {Object} courseData - Dữ liệu khóa học
   */
  async createCourse(courseData) {
    try {
      const response = await fetch(`${API_BASE_URL}/khoahocs/`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(courseData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating course:", error);
      throw error;
    }
  }

  /**
   * Cập nhật khóa học
   * @param {string} courseId - ID của khóa học
   * @param {Object} courseData - Dữ liệu cập nhật
   */
  async updateCourse(courseId, courseData) {
    try {
      const response = await fetch(`${API_BASE_URL}/khoahocs/${courseId}/`, {
        method: "PUT",
        headers: this.getHeaders(),
        body: JSON.stringify(courseData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating course:", error);
      throw error;
    }
  }

  /**
   * Xóa khóa học
   * @param {string} courseId - ID của khóa học
   */
  async deleteCourse(courseId) {
    try {
      const response = await fetch(`${API_BASE_URL}/khoahocs/${courseId}/`, {
        method: "DELETE",
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // DELETE thường trả về 204 No Content
      return response.status === 204 ? true : await response.json();
    } catch (error) {
      console.error("Error deleting course:", error);
      throw error;
    }
  }

  /**
   * Lấy thống kê khóa học
   */
  async getCourseStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/khoahocs/stats/`, {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching course stats:", error);
      throw error;
    }
  }

  /**
   * Lấy danh sách khóa học công khai (không cần auth)
   */
  async getPublicCourses() {
    try {
      const response = await fetch(`${API_BASE_URL}/khoahocs/public/`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching public courses:", error);
      throw error;
    }
  }

  // ===== LỚP HỌC (Class) APIs =====
  // Sử dụng data từ đăng ký khóa học để mô phỏng lớp học

  /**
   * Lấy danh sách "lớp học" (theo khóa học và trạng thái đăng ký)
   */
  async getClasses(params = {}) {
    try {
      // Lấy danh sách khóa học và students đăng ký
      const courses = await this.fetchClass(params);

      const classes = courses.results?.map(course => ({
        id: `class_${course.id}`,
        courseId: course.id,
        courseName: course.ten,
        name: `Lớp ${course.ten}`,
        teacherName: course.giang_vien,
        room: `P${Math.floor(Math.random() * 20) + 1}`,
        schedule: course.schedule,
        maxStudents: 20,
        currentStudents: course.so_hoc_vien || 0,
        status: course.trang_thai === 'mo' ? 'Đang học' : 'Đã kết thúc',
        startDate: course.created_at,
        students: course.students,
        price: course.hoc_phi,
        description: course.mo_ta
      })) || [];

      return { results: classes };
    } catch (error) {
      console.error("Error fetching classes:", error);
      // Fallback to mock data if needed
      return { results: [] };
    }
  }

  /**
   * Tạo lớp học mới (thực chất là tạo khóa học)
   */
  async createClass(classData) {
    try {
      // Convert class data to course data format
      const courseData = {
        ten: classData.courseName || classData.name,
        lich_hoc: classData.schedule,
        giang_vien: classData.teacherName,
        so_buoi: classData.sessions || 20,
        hoc_phi: classData.price || 2000000,
        mo_ta: classData.description,
        trang_thai: 'mo'
      };

      return await this.createCourse(courseData);
    } catch (error) {
      console.error("Error creating class:", error);
      throw error;
    }
  }

  /**
   * Fetch classes (LopHoc) from backend.
   * This returns the raw LopHoc list (used by getClasses).
   */
  async fetchClass(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`${API_BASE_URL}/lophocs/?${queryString}`, {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching classes (lophocs):", error);
      throw error;
    }
  }

  // ===== ĐĂNG KÝ KHÓA HỌC APIs =====

  /**
   * Lấy danh sách đăng ký khóa học
   */
  async getEnrollments(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`${API_BASE_URL}/dangky/?${queryString}`, {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching enrollments:", error);
      return { results: [] };
    }
  }

  /**
   * Đăng ký học viên vào khóa học
   */
  async enrollStudent(enrollmentData) {
    try {
      const response = await fetch(`${API_BASE_URL}/dangky/`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(enrollmentData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating enrollment:", error);
      throw error;
    }
  }

  // ===== ATTENDANCE MANAGEMENT =====

  /**
   * Lấy lịch học của lớp (mock data)
   */
  async getClassSchedules(classId) {
    try {
      // Mock schedules based on course data
      const schedules = [];
      const startDate = new Date();

      for (let i = 0; i < 10; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + (i * 3)); // Mỗi 3 ngày 1 buổi

        schedules.push({
          id: `schedule_${classId}_${i}`,
          classId: classId,
          date: date.toISOString(),
          time: "19:00-21:00",
          topic: `Bài ${i + 1}: Chủ đề học tập`,
          status: i < 3 ? 'completed' : 'scheduled'
        });
      }

      return schedules;
    } catch (error) {
      console.error("Error fetching schedules:", error);
      return [];
    }
  }

  /**
   * Lưu điểm danh
   */
  async saveAttendance(attendanceData) {
    try {
      // Mock save attendance - in real app this would be a separate API
      console.log("Saving attendance:", attendanceData);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      return {
        success: true,
        message: "Điểm danh đã được lưu thành công"
      };
    } catch (error) {
      console.error("Error saving attendance:", error);
      throw error;
    }
  }

  // ===== STUDENTS FOR COURSE MANAGEMENT =====

  /**
   * Lấy danh sách học viên (từ hocviens API)
   */
  async getStudents(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`${API_BASE_URL}/hocviens/?${queryString}`, {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching students:", error);
      return { results: [] };
    }
  }

  // Helper method để format lỗi từ API response
  formatError(error, response) {
    if (response && response.data) {
      const data = response.data;
      return data.detail || data.error || data.message || "Unknown API error";
    }
    return error.message || "Network error";
  }
}

// Export singleton instance
const courseService = new CourseService();
export default courseService;
