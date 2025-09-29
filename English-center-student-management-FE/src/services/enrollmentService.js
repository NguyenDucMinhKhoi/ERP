import authService from './authService';

const http = authService.client;

async function listCourses(params = {}) {
  const { data } = await http.get('/khoahocs/', { params });
  return data;
}

async function convertLead(payload) {
  const { data } = await http.post('/dangky/convert-lead/', payload);
  return data;
}

async function listPendingEnrollments(params = {}) {
  const { data } = await http.get('/dangky/', { params: { trang_thai: 'dang_ky', ...params } });
  return data;
}

async function confirmEnrollment(id) {
  const { data } = await http.post(`/dangky/${id}/confirm/`);
  return data;
}

export const enrollmentService = {
  listCourses,
  convertLead,
  listPendingEnrollments,
  confirmEnrollment,
};

export default enrollmentService;


