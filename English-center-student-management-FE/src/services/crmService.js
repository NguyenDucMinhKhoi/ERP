// CRM API Service
const API_BASE_URL = 'http://localhost:8000/api'; // Thay đổi theo backend URL

class CRMService {
  // HocVien APIs
  async getStudents(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/hocviens/?${queryString}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  async getStudent(id) {
    const response = await fetch(`${API_BASE_URL}/hocviens/${id}/`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  async createStudent(studentData) {
    const response = await fetch(`${API_BASE_URL}/hocviens/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
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
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(studentData),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  async getStudentStats() {
    const response = await fetch(`${API_BASE_URL}/hocviens/stats/`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  // ChamSoc APIs
  async getCareLogs(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/chamsoc/?${queryString}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  async getCareLog(id) {
    const response = await fetch(`${API_BASE_URL}/chamsoc/${id}/`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  async createCareLog(careLogData) {
    const response = await fetch(`${API_BASE_URL}/chamsoc/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(careLogData),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  async updateCareLog(id, careLogData) {
    const response = await fetch(`${API_BASE_URL}/chamsoc/${id}/`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(careLogData),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  async getCareLogStats() {
    const response = await fetch(`${API_BASE_URL}/chamsoc/stats/`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  // ThongBao APIs
  async getNotifications(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/thongbaos/?${queryString}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  async createNotification(notificationData) {
    const response = await fetch(`${API_BASE_URL}/thongbaos/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(notificationData),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  // CRM Reports APIs
  async getConversionFunnel(dateRange = '30days') {
    // Mock API - sẽ implement thực tế
    return {
      leads: 150,
      contacted: 120,
      interested: 85,
      enrolled: 45,
      conversionRate: 30.0
    };
  }

  async getChurnRate(dateRange = '30days') {
    // Mock API - sẽ implement thực tế
    return {
      totalStudents: 1247,
      churnedThisMonth: 23,
      churnRate: 1.8,
      previousMonthChurn: 2.1,
      trend: 'down'
    };
  }

  async getLeadSources(dateRange = '30days') {
    // Mock API - sẽ implement thực tế
    return [
      { source: 'Website', count: 45, percentage: 30.0 },
      { source: 'Facebook', count: 38, percentage: 25.3 },
      { source: 'Google Ads', count: 32, percentage: 21.3 },
      { source: 'Referral', count: 20, percentage: 13.3 },
      { source: 'Other', count: 15, percentage: 10.0 }
    ];
  }

  // Utility methods
  async testConnection() {
    try {
      const response = await fetch(`${API_BASE_URL}/hocviens/stats/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.ok;
    } catch (error) {
      console.error('API connection test failed:', error);
      return false;
    }
  }

  // Error handling
  handleError(error) {
    console.error('CRM Service Error:', error);
    if (error.message.includes('401')) {
      // Handle unauthorized
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    throw error;
  }
}

export default new CRMService();
