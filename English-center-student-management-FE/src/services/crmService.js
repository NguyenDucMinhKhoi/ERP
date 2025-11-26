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

  /**
   * Lấy danh sách leads (created_as_lead = true)
   */
  async getLeads(params = {}) {
    try {
      const { data } = await http.get('/hocviens/leads/', { params });
      return data;
    } catch (error) {
      console.error('Error fetching leads:', error);
      throw error;
    }
  }

  /**
   * Convert a lead to student (backend sets is_converted = true)
   * @param {string} leadId - UUID of the HocVien record
   */
  async convertLead(leadId) {
    try {
      const { data } = await http.post(`/hocviens/leads/${leadId}/convert/`);
      return data;
    } catch (error) {
      console.error('Error converting lead:', error);
      throw error;
    }
  }

  /**
   * Get contact note for a lead (hoc_vien)
   * @param {string} leadId
   */
  async getLeadContactNote(leadId) {
    try {
      const { data } = await http.get(`/hocviens/${leadId}/contact-note/`);
      return data;
    } catch (error) {
      console.error('Error fetching lead contact note:', error);
      throw error;
    }
  }

  /**
   * Create or update contact note for a lead
   * @param {string} leadId
   * @param {Object} payload - { content: "..." }
   */
  async saveLeadContactNote(leadId, payload) {
    try {
      const { data } = await http.post(`/hocviens/${leadId}/contact-note/`, payload);
      return data;
    } catch (error) {
      console.error('Error saving lead contact note:', error);
      throw error;
    }
  }

  /**
   * Get registration trend aggregated by day.
   * params: { from: 'YYYY-MM-DD', to: 'YYYY-MM-DD' }
   */
  async getRegistrationTrend(params = {}) {
    try {
      const { data } = await http.get('/hocviens/registrations/', { params });
      return data;
    } catch (error) {
      console.error('Error fetching registration trend:', error);
      throw error;
    }
  }

  /**
   * Get student count grouped by course (khoahoc).
   */
  async getStudentCountByCourse(params = {}) {
    try {
      const { data } = await http.get('/hocviens/by-course/', { params });
      return data;
    } catch (error) {
      console.error('Error fetching student count by course:', error);
      throw error;
    }
  }
}

const crmService = new CRMService();
export default crmService;