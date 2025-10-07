// CRM API Service
import authService from './authService';

const API_BASE_URL = import.meta.env.VITE_API_URL;

class CRMService {
  getHeaders() {
    const token = authService.getAccessToken();
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  async getStudents(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/hocviens/?${queryString}`, {
      headers: this.getHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  async getStudent(id) {
    const response = await fetch(`${API_BASE_URL}/hocviens/${id}/`, {
      headers: this.getHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  async createStudent(studentData) {
    const response = await fetch(`${API_BASE_URL}/hocviens/`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(studentData),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  async updateStudent(id, studentData) {
    const response = await fetch(`${API_BASE_URL}/hocviens/${id}/`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(studentData),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }
}

const crmService = new CRMService();
export default crmService;