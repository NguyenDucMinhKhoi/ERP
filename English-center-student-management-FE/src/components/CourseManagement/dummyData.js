// Dummy data for course and class management
export const dummyCourses = [
  {
    id: 1,
    name: "TOEIC 450-650",
    description: "Khóa học TOEIC từ 450 đến 650 điểm",
    duration: "3 tháng",
    price: "2,500,000 VNĐ",
    level: "Trung cấp",
    maxStudents: 20,
    status: "Đang mở",
    requirements: "Trình độ tiếng Anh cơ bản"
  },
  {
    id: 2,
    name: "IELTS 6.0-7.0",
    description: "Khóa học IELTS từ 6.0 đến 7.0 điểm",
    duration: "4 tháng",
    price: "3,500,000 VNĐ",
    level: "Cao cấp",
    maxStudents: 15,
    status: "Đang mở",
    requirements: "Trình độ IELTS 5.0 trở lên"
  },
  {
    id: 3,
    name: "TOEFL 80-100",
    description: "Khóa học TOEFL từ 80 đến 100 điểm",
    duration: "3.5 tháng",
    price: "3,000,000 VNĐ",
    level: "Cao cấp",
    maxStudents: 12,
    status: "Đang mở",
    requirements: "Trình độ TOEFL 60 trở lên"
  },
  {
    id: 4,
    name: "General English",
    description: "Khóa học tiếng Anh tổng quát",
    duration: "2 tháng",
    price: "1,800,000 VNĐ",
    level: "Cơ bản",
    maxStudents: 25,
    status: "Đang mở",
    requirements: "Không yêu cầu"
  },
  {
    id: 5,
    name: "Business English",
    description: "Khóa học tiếng Anh thương mại",
    duration: "2.5 tháng",
    price: "2,200,000 VNĐ",
    level: "Trung cấp",
    maxStudents: 18,
    status: "Đang mở",
    requirements: "Trình độ tiếng Anh trung cấp"
  }
];

export const dummyTeachers = [
  {
    id: 1,
    name: "Nguyễn Thị Lan Anh",
    email: "lananh@englishcenter.com",
    phone: "0901234567",
    specialization: "IELTS, TOEFL",
    experience: "5 năm",
    status: "Hoạt động"
  },
  {
    id: 2,
    name: "Trần Minh Tuấn",
    email: "minhtuan@englishcenter.com",
    phone: "0912345678",
    specialization: "TOEIC, Business English",
    experience: "7 năm",
    status: "Hoạt động"
  },
  {
    id: 3,
    name: "Lê Thị Hương",
    email: "thihuong@englishcenter.com",
    phone: "0923456789",
    specialization: "General English, IELTS",
    experience: "4 năm",
    status: "Hoạt động"
  },
  {
    id: 4,
    name: "Phạm Văn Đức",
    email: "vanduc@englishcenter.com",
    phone: "0934567890",
    specialization: "TOEFL, Business English",
    experience: "6 năm",
    status: "Hoạt động"
  }
];

export const dummyClasses = [
  {
    id: 1,
    name: "TOEIC-A1",
    courseId: 1,
    courseName: "TOEIC 450-650",
    teacherId: 2,
    teacherName: "Trần Minh Tuấn",
    startDate: "2024-10-01",
    endDate: "2024-12-31",
    schedule: [
      { day: "Thứ 2", time: "18:00-20:00" },
      { day: "Thứ 4", time: "18:00-20:00" },
      { day: "Thứ 6", time: "18:00-20:00" }
    ],
    room: "Phòng A101",
    maxStudents: 20,
    currentStudents: 15,
    status: "Đang học",
    students: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
  },
  {
    id: 2,
    name: "IELTS-B2",
    courseId: 2,
    courseName: "IELTS 6.0-7.0",
    teacherId: 1,
    teacherName: "Nguyễn Thị Lan Anh",
    startDate: "2024-09-15",
    endDate: "2025-01-15",
    schedule: [
      { day: "Thứ 3", time: "19:00-21:00" },
      { day: "Thứ 5", time: "19:00-21:00" },
      { day: "Thứ 7", time: "14:00-16:00" }
    ],
    room: "Phòng B201",
    maxStudents: 15,
    currentStudents: 12,
    status: "Đang học",
    students: [2, 3, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15]
  },
  {
    id: 3,
    name: "TOEFL-C1",
    courseId: 3,
    courseName: "TOEFL 80-100",
    teacherId: 4,
    teacherName: "Phạm Văn Đức",
    startDate: "2024-11-01",
    endDate: "2025-02-15",
    schedule: [
      { day: "Thứ 2", time: "19:00-21:00" },
      { day: "Thứ 4", time: "19:00-21:00" }
    ],
    room: "Phòng C301",
    maxStudents: 12,
    currentStudents: 8,
    status: "Đang học",
    students: [1, 3, 5, 6, 7, 9, 11, 13]
  },
  {
    id: 4,
    name: "GE-A2",
    courseId: 4,
    courseName: "General English",
    teacherId: 3,
    teacherName: "Lê Thị Hương",
    startDate: "2024-10-15",
    endDate: "2024-12-15",
    schedule: [
      { day: "Thứ 3", time: "18:00-20:00" },
      { day: "Thứ 5", time: "18:00-20:00" }
    ],
    room: "Phòng A102",
    maxStudents: 25,
    currentStudents: 20,
    status: "Đang học",
    students: [4, 6, 8, 10, 12, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28]
  }
];

export const dummySchedules = [
  {
    id: 1,
    classId: 1,
    date: "2024-10-07",
    time: "18:00-20:00",
    topic: "Listening Part 1-2",
    status: "Đã hoàn thành",
    attendance: {
      present: 14,
      absent: 1,
      late: 0
    }
  },
  {
    id: 2,
    classId: 1,
    date: "2024-10-09",
    time: "18:00-20:00",
    topic: "Reading Part 5-6",
    status: "Đã hoàn thành",
    attendance: {
      present: 15,
      absent: 0,
      late: 0
    }
  },
  {
    id: 3,
    classId: 1,
    date: "2024-10-11",
    time: "18:00-20:00",
    topic: "Speaking Practice",
    status: "Sắp diễn ra",
    attendance: null
  },
  {
    id: 4,
    classId: 2,
    date: "2024-10-08",
    time: "19:00-21:00",
    topic: "Writing Task 1",
    status: "Đã hoàn thành",
    attendance: {
      present: 11,
      absent: 1,
      late: 0
    }
  }
];

export const dummyAttendance = [
  {
    id: 1,
    classId: 1,
    scheduleId: 1,
    studentId: 1,
    studentName: "Nguyễn Văn An",
    status: "Có mặt",
    checkInTime: "17:55", 
    notes: ""
  },
  {
    id: 2,
    classId: 1,
    scheduleId: 1,
    studentId: 2,
    studentName: "Trần Thị Bình",
    status: "Có mặt",
    checkInTime: "17:50",
    notes: ""
  },
  {
    id: 3,
    classId: 1,
    scheduleId: 1,
    studentId: 3,
    studentName: "Lê Minh Cường",
    status: "Vắng mặt",
    checkInTime: null,
    notes: "Báo ốm"
  }
];

export const timeSlots = [
  "08:00-10:00",
  "10:00-12:00",
  "14:00-16:00",
  "16:00-18:00",
  "18:00-20:00",
  "19:00-21:00"
];

export const daysOfWeek = [
  "Thứ 2",
  "Thứ 3",
  "Thứ 4",
  "Thứ 5",
  "Thứ 6",
  "Thứ 7",
  "Chủ nhật"
];

export const classStatusOptions = [
  { value: "Chờ mở lớp", label: "Chờ mở lớp" },
  { value: "Đang học", label: "Đang học" },
  { value: "Tạm dừng", label: "Tạm dừng" },
  { value: "Đã kết thúc", label: "Đã kết thúc" },
  { value: "Đã hủy", label: "Đã hủy" }
];

export const attendanceStatusOptions = [
  { value: "Có mặt", label: "Có mặt" },
  { value: "Vắng mặt", label: "Vắng mặt" },
  { value: "Đi muộn", label: "Đi muộn" },
  { value: "Về sớm", label: "Về sớm" }
];
