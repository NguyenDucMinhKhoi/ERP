# CRM Module - Hệ Thống Quản Lý Học Viên

## Tổng Quan

Module CRM được thiết kế để quản lý toàn bộ quy trình chăm sóc học viên từ lead đến enrollment và theo dõi churn rate.

## Các Chức Năng Chính

### 1. Danh Sách Học Viên (`StudentList.jsx`)
- **Mục đích**: Quản lý danh sách học viên với các tính năng filter và search
- **Tính năng**:
  - Hiển thị danh sách học viên với thông tin cơ bản
  - Filter theo trạng thái học phí (đã đóng, còn nợ, chưa đóng)
  - Search theo tên, email, số điện thoại
  - Thống kê nhanh (tổng học viên, đã đóng phí, còn nợ, có tài khoản)
  - Actions: xem chi tiết, gọi điện, gửi email

### 2. Hồ Sơ Học Viên (`StudentProfile.jsx`)
- **Mục đích**: Xem chi tiết thông tin học viên và timeline chăm sóc
- **Tính năng**:
  - Thông tin cá nhân đầy đủ
  - Timeline chăm sóc với lịch sử tương tác
  - Tabs: Tổng quan, Chăm sóc, Lịch sử
  - Quick stats và hoạt động gần đây

### 3. Chăm Sóc Học Viên (`CareLogForm.jsx`)
- **Mục đích**: Ghi nhận các lần chăm sóc học viên
- **Tính năng**:
  - Loại chăm sóc: Tư vấn, Theo dõi, Hỏi đáp, Khác
  - Trạng thái: Mới, Đang xử lý, Hoàn thành, Đóng
  - Validation: Không cho phép lưu nội dung trống
  - Business rule: Nhân viên phải ghi chú mỗi lần contact

### 4. Báo Cáo CRM (`CRMReports.jsx`)
- **Mục đích**: Phân tích hiệu suất CRM và chuyển đổi
- **Tính năng**:
  - Conversion Funnel: Lead → Liên hệ → Quan tâm → Đăng ký
  - Churn Rate: Tỷ lệ học viên rời bỏ
  - Lead Sources: Phân tích nguồn lead
  - Monthly Trends: Xu hướng 6 tháng gần đây

### 5. API Tester (`APITester.jsx`)
- **Mục đích**: Test các endpoint CRM API
- **Tính năng**:
  - Test connection
  - Test CRUD operations cho HocVien, ChamSoc, ThongBao
  - Test stats endpoints
  - Hiển thị kết quả và thời gian response

## API Endpoints

### HocVien (Học Viên)
```
GET    /api/hocviens/              - Danh sách học viên
POST   /api/hocviens/              - Tạo học viên mới
GET    /api/hocviens/{id}/         - Chi tiết học viên
PUT    /api/hocviens/{id}/         - Cập nhật học viên
DELETE /api/hocviens/{id}/         - Xóa học viên
GET    /api/hocviens/stats/        - Thống kê học viên
```

### ChamSoc (Chăm Sóc)
```
GET    /api/chamsoc/               - Danh sách chăm sóc
POST   /api/chamsoc/               - Tạo log chăm sóc mới
GET    /api/chamsoc/{id}/          - Chi tiết chăm sóc
PUT    /api/chamsoc/{id}/          - Cập nhật chăm sóc
DELETE /api/chamsoc/{id}/          - Xóa chăm sóc
GET    /api/chamsoc/stats/         - Thống kê chăm sóc
```

### ThongBao (Thông Báo)
```
GET    /api/thongbaos/             - Danh sách thông báo
POST   /api/thongbaos/             - Tạo thông báo mới
GET    /api/thongbaos/{id}/        - Chi tiết thông báo
PUT    /api/thongbaos/{id}/        - Cập nhật thông báo
DELETE /api/thongbaos/{id}/        - Xóa thông báo
```

## Business Rules

### 1. Chăm Sóc Học Viên
- **Bắt buộc**: Mỗi lần contact phải có nội dung ghi chú
- **Validation**: Không cho phép lưu contact log trống
- **Tracking**: Ghi nhận nhân viên thực hiện chăm sóc

### 2. Conversion Workflow
```
Lead → Contact → Interest → Enrollment
```
- Lead nhập vào hệ thống (form website, manual)
- Nhân viên tư vấn và ghi log chăm sóc
- Chuyển đổi Lead → Enrollment khi học viên đăng ký
- Theo dõi churn rate khi học viên rời bỏ

### 3. Permissions
- **Nhân viên tư vấn**: CRUD chăm sóc, xem học viên
- **Quản lý**: Full access, xem reports
- **Học viên**: Chỉ xem thông tin của mình

## Cách Sử Dụng

### 1. Truy Cập CRM
```javascript
// Import CRM component
import CRM from './pages/CRM';

// Sử dụng trong routing
<Route path="/crm" component={CRM} />
```

### 2. Test API
```javascript
// Sử dụng API Tester
import { APITester } from './components/CRM';

// Hoặc test trực tiếp
import crmService from './services/crmService';

// Test connection
const isConnected = await crmService.testConnection();

// Get students
const students = await crmService.getStudents();
```

### 3. Tạo Care Log
```javascript
const careLogData = {
  hocvien_id: 'student-uuid',
  loai_cham_soc: 'tuvan',
  noi_dung: 'Tư vấn về khóa học IELTS',
  trang_thai: 'hoan_thanh',
  ghi_chu: 'Học viên quan tâm, sẽ liên hệ lại'
};

const result = await crmService.createCareLog(careLogData);
```

## Development Notes

### 1. Mock Data
- Hiện tại sử dụng mock data để demo
- Cần thay thế bằng API calls thực tế
- Update `crmService.js` với actual endpoints

### 2. Authentication
- Sử dụng Bearer token từ localStorage
- Cần implement proper auth flow
- Handle 401 errors và redirect to login

### 3. Error Handling
- Implement proper error boundaries
- Show user-friendly error messages
- Log errors for debugging

### 4. Performance
- Implement pagination cho large datasets
- Add loading states
- Optimize re-renders với React.memo

## Next Steps

1. **Integrate với Backend**: Kết nối với Django API thực tế
2. **Add Real-time**: WebSocket cho notifications
3. **Export Features**: Xuất báo cáo PDF/Excel
4. **Advanced Filters**: Filter theo date range, course, etc.
5. **Mobile Responsive**: Optimize cho mobile devices
6. **Testing**: Unit tests và integration tests
