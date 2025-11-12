export const students = [
  { id: 1, name: "Nguyễn Văn An", phone: "0901234567", email: "an@example.com" },
  { id: 2, name: "Trần Thị Bình", phone: "0902345678", email: "binh@example.com" },
  { id: 3, name: "Lê Minh Cường", phone: "0903456789", email: "cuong@example.com" },
];

export const staff = [
  { id: 201, name: "Phạm Quản Trị", phone: "0911111111", email: "admin@center.com", role: "admin", roleLabel: "Quản trị" },
  { id: 202, name: "Ngô Học Vụ", phone: "0912222222", email: "hocvu@center.com", role: "hocvu", roleLabel: "Học vụ" },
  { id: 203, name: "Trần Tài Chính", phone: "0913333333", email: "taichinh@center.com", role: "taichinh", roleLabel: "Tài chính" },
  { id: 204, name: "Lê Chăm Sóc", phone: "0914444444", email: "chamsoc@center.com", role: "chamsoc", roleLabel: "Chăm sóc" },
  { id: 205, name: "Hoàng Giảng Viên", phone: "0915555555", email: "gv@center.com", role: "giangvien", roleLabel: "Giảng viên" },
];

export const courses = [
  {
    id: 11,
    name: "IELTS 6.0-7.0",
    classes: [
      { id: 111, name: "IELTS-B2-01" },
      { id: 112, name: "IELTS-B2-02" },
    ],
  },
  {
    id: 12,
    name: "TOEIC 650-850",
    classes: [
      { id: 121, name: "TOEIC-C1-01" },
      { id: 122, name: "TOEIC-C1-02" },
    ],
  },
  {
    id: 13,
    name: "General English",
    classes: [
      { id: 131, name: "GE-A2-01" },
      { id: 132, name: "GE-B1-01" },
    ],
  },
];

export const threads = [
  { id: 101, studentId: 1, studentName: "Nguyễn Văn An", role: "student", roleLabel: null, lastMessage: "Em muốn hỏi lịch thi", updatedAt: "2024-10-01" },
  { id: 102, studentId: 2, studentName: "Trần Thị Bình", role: "student", roleLabel: null, lastMessage: "Học phí đóng như thế nào?", updatedAt: "2024-10-02" },
  { id: 103, studentId: 201, studentName: "Phạm Quản Trị", role: "admin", roleLabel: "Quản trị", lastMessage: "Cần hỗ trợ chức năng mới", updatedAt: "2024-10-03" },
  { id: 104, studentId: 202, studentName: "Ngô Học Vụ", role: "hocvu", roleLabel: "Học vụ", lastMessage: "Báo cáo học viên tháng này", updatedAt: "2024-10-04" },
];


