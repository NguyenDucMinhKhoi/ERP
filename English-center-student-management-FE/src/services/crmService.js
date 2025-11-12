// CRM API Service
import authService from './authService';

// Sử dụng axios client từ authService để có auto refresh token
const http = authService.client;

class CRMService {
  async getStudents(params = {}) {
    try {
      const { data } = await http.get('/hocviens/', { params });
      return data;
    } catch (error) {
      console.error('Error fetching students:', error);
      throw error;
    }
  }

  async getStudent(id) {
    try {
      const { data } = await http.get(`/hocviens/${id}/`);
      return data;
    } catch (error) {
      console.error('Error fetching student:', error);
      throw error;
    }
  }

  async createStudent(studentData) {
    try {
      const { data } = await http.post('/hocviens/', studentData);
      return data;
    } catch (error) {
      console.error('Error creating student:', error);
      throw error;
    }
  }

  async updateStudent(id, studentData) {
    try {
      const { data } = await http.put(`/hocviens/${id}/`, studentData);
      return data;
    } catch (error) {
      console.error('Error updating student:', error);
      throw error;
    }
  }

  /**
   * Lấy thống kê học viên (total, this month, per-course)
   */
  async getStudentStats(params = {}) {
    try {
      const { data } = await http.get('/hocviens/stats/', { params });
      return data;
    } catch (error) {
      console.error('Error fetching student stats:', error);
      throw error;
    }
  }

  /**
   * Tạo lead mới (không phải student)
   * @param {Object} leadData - { ten, email, sdt, ngay_sinh, address, nhu_cau_hoc, khoa_hoc_quan_tam, sourced, concern_level, ... }
   */
  async createLead(leadData) {
    try {
      const { data } = await http.post('/hocviens/leads/', leadData);
      return data;
    } catch (error) {
      console.error('Error creating lead:', error);
      throw error;
    }
  }
}

const crmService = new CRMService();
export default crmService;