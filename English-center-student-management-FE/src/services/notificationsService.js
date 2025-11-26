import authService from "./authService";

const http = authService.client;

const notificationsService = {
  // Gửi thông báo mới
  async sendNotification(notificationData) {
    const response = await http.post('/thongbaos/', {
      tieu_de: notificationData.title,
      noi_dung: notificationData.content,
      kenh: notificationData.channel,
      nguoi_nhan: notificationData.recipients,
    });
    return response.data;
  },

  // Lấy danh sách thông báo đã gửi
  async getNotifications(params = {}) {
    const response = await http.get('/thongbaos/', { params });
    return response.data;
  },

  // Lấy thông báo theo người nhận
  async getNotificationsByRecipients(recipientIds) {
    const response = await http.get('/thongbaos/', {
      params: {
        nguoi_nhan: recipientIds.join(','),
      },
    });
    return response.data;
  },

  // Lấy chi tiết một thông báo
  async getNotification(id) {
    const response = await http.get(`/thongbaos/${id}/`);
    return response.data;
  },

  // Gửi phản hồi cho thông báo
  async sendReply(replyData) {
    const response = await http.post('/thongbaos/reply/', {
      thong_bao_goc: replyData.originalNotificationId,
      noi_dung: replyData.replyMessage,
      nguoi_nhan: replyData.recipientIds,
    });
    return response.data;
  },

  // Lấy danh sách phản hồi của một thông báo
  async getReplies(notificationId) {
    const response = await http.get(`/thongbaos/${notificationId}/replies/`);
    return response.data;
  },

  // Đánh dấu thông báo đã đọc
  async markAsRead(notificationId) {
    const response = await http.patch(`/thongbaos/${notificationId}/mark_read/`);
    return response.data;
  },

  // Lấy thông báo chưa đọc
  async getUnreadNotifications() {
    const response = await http.get('/thongbaos/unread/');
    return response.data;
  },

  // Xóa thông báo
  async deleteNotification(id) {
    const response = await http.delete(`/thongbaos/${id}/`);
    return response.data;
  },

  // Lấy thống kê thông báo
  async getNotificationStats(params = {}) {
    const response = await http.get('/thongbaos/stats/', { params });
    return response.data;
  },

  // Gửi thông báo hàng loạt
  async sendBulkNotification(notificationData) {
    const response = await http.post('/thongbaos/bulk/', {
      tieu_de: notificationData.title,
      noi_dung: notificationData.content,
      kenh: notificationData.channel,
      che_do: notificationData.mode, // 'single', 'course', 'class', 'center'
      nguoi_nhan: notificationData.recipients,
      khoa_hoc: notificationData.courseId,
      lop_hoc: notificationData.classId,
    });
    return response.data;
  },
};

export default notificationsService;
