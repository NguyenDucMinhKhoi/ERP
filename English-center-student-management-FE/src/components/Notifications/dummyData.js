export const students = [
  { id: 1, name: "Nguyễn Văn An", phone: "0901234567", email: "an@example.com" },
  { id: 2, name: "Trần Thị Bình", phone: "0902345678", email: "binh@example.com" },
  { id: 3, name: "Lê Minh Cường", phone: "0903456789", email: "cuong@example.com" },
];

export const staff = [
  { id: 201, name: "Phạm Quản Trị", phone: "0911111111", email: "admin@center.com" },
  { id: 202, name: "Ngô Nhân Viên", phone: "0912222222", email: "nhanvien@center.com" },
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
  { id: 101, studentId: 1, studentName: "Nguyễn Văn An", lastMessage: "Em muốn hỏi lịch thi", updatedAt: "2024-10-01" },
  { id: 102, studentId: 2, studentName: "Trần Thị Bình", lastMessage: "Học phí đóng như thế nào?", updatedAt: "2024-10-02" },
];


