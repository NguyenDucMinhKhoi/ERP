// Course Management API Service
import authService from "./authService";

// Sử dụng axios client từ authService để có auto refresh token
const http = authService.client;

class CourseService {
  // Không cần getHeaders() nữa vì axios interceptor tự động thêm token

  // ===== KHÓA HỌC (KhoaHoc) APIs =====

  /**
   * Lấy danh sách khóa học với filter và search
   * @param {Object} params - Query parameters { search, trang_thai, giang_vien, ordering }
   */
  async getCourses(params = {}) {
    try {
      const { data } = await http.get('/khoahocs/', { params });
      return data;
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
      const { data } = await http.get(`/khoahocs/${courseId}/`);
      return data;
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
      const { data } = await http.post('/khoahocs/', courseData);
      return data;
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
      const { data } = await http.put(`/khoahocs/${courseId}/`, courseData);
      return data;
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
      const { data } = await http.delete(`/khoahocs/${courseId}/`);
      return data;
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
      const { data } = await http.get('/khoahocs/stats/');
      return data;
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
      const { data } = await http.get('/khoahocs/public/');
      return data;
    } catch (error) {
      console.error("Error fetching public courses:", error);
      throw error;
    }
  }

  // ===== LỚP HỌC (Class) APIs - Updated =====

  /**
   * Lấy danh sách lớp học từ API
   * @param {Object} params - Query parameters
   */
  async getClasses(params = {}) {
    try {
      const lophocsResponse = await this.fetchClass(params);

      const classes = lophocsResponse.results?.map(lophoc => ({
        id: `class_${lophoc.id}`,
        courseId: lophoc.khoa_hoc, // ID của khóa học (foreign key)
        courseName: lophoc.ten,
        name: lophoc.ten,
        giang_vien: lophoc.giang_vien,
        teacherName: lophoc.giang_vien?.name || lophoc.giang_vien?.username || 'Chưa có giáo viên',
        room: lophoc.phong_hoc || `P${Math.floor(Math.random() * 20) + 1}`,
        schedule: lophoc.schedule || [],
        maxStudents: lophoc.si_so_toi_da || 20,
        currentStudents: lophoc.students?.length || 0,
        status: lophoc.trang_thai === 'dang_hoc' ? 'Đang học' : 'Đã kết thúc',
        startDate: lophoc.ngay_bat_dau || lophoc.created_at,
        students: lophoc.students || [],
        price: lophoc.hoc_phi,
        description: lophoc.mo_ta
      })) || [];

      return { results: classes };
    } catch (fallbackError) {
      console.error("Error in fallback:", fallbackError);
      return { results: [] };
    }
  }


  /**
     * Fetch classes (LopHoc) from backend.
     * This returns the raw LopHoc list (used by getClasses).
     */
  async fetchClass(params = {}) {
    try {
      const { data } = await http.get('/lophocs/', { params });
      return data;
    } catch (error) {
      console.error("Error fetching classes (lophocs):", error);
      throw error;
    }
  }

  /**
   * Tạo lớp học mới
   * @param {Object} classData - Dữ liệu lớp học
   */
  async createClass(classData) {
    try {
      const { data } = await http.post('/lophocs/', classData);
      return data;
    } catch (error) {
      console.error("Error creating class:", error);
      throw error;
    }
  }

  /**
   * Cập nhật lớp học
   * @param {string} classId - ID của lớp học
   * @param {Object} classData - Dữ liệu cập nhật
   */
  async updateClass(classId, classData) {
    try {
      const { data } = await http.patch(`/lophocs/${classId}/`, classData);
      return data;
    } catch (error) {
      console.error("Error updating class:", error);
      throw error;
    }
  }

  /**
   * Xóa lớp học
   * @param {string} classId - ID của lớp học
   */
  async deleteClass(classId) {
    try {
      const { data } = await http.delete(`/lophocs/${classId}/`);
      return data;
    } catch (error) {
      console.error("Error deleting class:", error);
      throw error;
    }
  }

  /**
   * Lấy danh sách học viên trong lớp
   * @param {string} classId - ID của lớp học
   */
  async getClassStudents(classId) {
    try {
      const { data } = await http.get(`/lophocs/${classId}/students/`);
      return data;
    } catch (error) {
      console.error("Error fetching class students:", error);
      throw error;
    }
  }

  /**
   * Thêm học viên vào lớp
   * @param {string} classId - ID của lớp học (may be prefixed with "class_")
   * @param {string} studentId - ID của học viên
   */
  async addStudentToClass(classId, studentId) {
    // Remove "class_" prefix if present
    const realClassId = typeof classId === "string" && classId.startsWith("class_")
      ? classId.replace("class_", "")
      : classId;

    const { data } = await http.post(`/lophocs/${realClassId}/add-student/`, {
      student_id: studentId
    });
    return data;
  }

  /**
   * Xóa học viên khỏi lớp
   * @param {string} classId - ID của lớp học
   * @param {string} studentId - ID của học viên
   */
  async removeStudentFromClass(classId, studentId) {
    try {
      const { data } = await http.delete(`/lophocs/${classId}/remove-student/${studentId}/`);
      return data;
    } catch (error) {
      console.error("Error removing student from class:", error);
      throw error;
    }
  }

  // /**
  //  * Lấy chi tiết lớp học
  //  * @param {string} classId - ID của lớp học
  //  */
  // async getClassDetail(classId) {
  //   try {
  //     const response = await fetch(`${API_BASE_URL}/lophocs/${classId}/`, {
  //       headers: this.getHeaders(),
  //     });

  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }

  //     return await response.json();
  //   } catch (error) {
  //     console.error("Error fetching class detail:", error);
  //     throw error;
  //   }
  // }

  // ===== ĐĂNG KÝ KHÓA HỌC APIs =====

  /**
   * Lấy danh sách đăng ký khóa học
   */
  async getEnrollments(params = {}) {
    try {
      const { data } = await http.get('/dangky/', { params });
      return data;
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
      const { data } = await http.post('/dangky/', enrollmentData);
      return data;
    } catch (error) {
      console.error("Error creating enrollment:", error);
      throw error;
    }
  }

  // ===== LỊCH HỌC (Schedule) APIs =====

  /**
   * Lấy danh sách tất cả lịch học
   * @param {Object} params - Query parameters
   */
  async getSchedules(params = {}) {
    try {
      const { data } = await http.get('/lichhocs/', { params });
      return data;
    } catch (error) {
      console.error("Error fetching schedules:", error);
      throw error;
    }
  }

  /**
   * Tạo lịch học mới
   * @param {Array} scheduleData - Mảng dữ liệu lịch học
   * @example
   * [
   *   {
   *     id: 1, // lớp học id
   *     date: "2024-10-20",
   *     time: "19:00",
   *     topic: "Chủ đề bài học",
   *     note: "Ghi chú"
   *   }
   * ]
   */
  async createSchedule(scheduleData) {
    try {
      const dataToSend = scheduleData;
      console.log('dataToSend ', dataToSend);

      const { data } = await http.post('/lichhocs/', dataToSend);
      return data;
    } catch (error) {
      console.error("Error creating schedule:", error);
      throw error;
    }
  }

  /**
   * Cập nhật lịch học
   * @param {string} scheduleId - ID của lịch học
   * @param {Object} scheduleData - Dữ liệu cập nhật
   */
  async updateSchedule(scheduleId, scheduleData) {
    try {
      const { data } = await http.patch(`/lichhocs/${scheduleId}/`, scheduleData);
      return data;
    } catch (error) {
      console.error("Error updating schedule:", error);
      throw error;
    }
  }

  /**
   * Xóa lịch học
   * @param {string} scheduleId - ID của lịch học
   */
  async deleteSchedule(scheduleId) {
    try {
      const { data } = await http.delete(`/lichhocs/${scheduleId}/`);
      return data;
    } catch (error) {
      console.error("Error deleting schedule:", error);
      throw error;
    }
  }

  /**
   * Lấy lịch học của lớp
   * @param {string} classId - ID của lớp học
   */
  async getClassSchedules(classId) {
    try {
      const { data } = await http.get(`/lichhocs/class/${classId}/`);
      return data;
    } catch (error) {
      console.error("Error fetching class schedules:", error);
      return [];
    }
  }

  // ===== ATTENDANCE MANAGEMENT =====

  /**
   * Lưu điểm danh
   */
  async saveAttendance({ attendance, scheduleId }) {
    try {
      // Mock save attendance - in real app this would be a separate API
      console.log("Saving attendance:", attendance);

      // Simulate API delay
      await http.post(`/diemdanhs/`, {
        hoc_vien: attendance,
        lich_hoc: scheduleId
      });
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
      const { data } = await http.get('/hocviens/', { params });
      return data;
    } catch (error) {
      console.error("Error fetching students:", error);
      return { results: [] };
    }
  }

  /**
   * Lấy danh sách giáo viên
   */
  async getTeachers(params = {}) {
    try {
      const { data } = await http.get('/teachers/', { params });
      return data;
    } catch (error) {
      console.error("Error fetching teachers:", error);
      return [];
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