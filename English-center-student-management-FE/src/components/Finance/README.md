# 💰 Finance Module - Quản lý Tài chính

## Tổng quan
Module Finance cung cấp các chức năng toàn diện để quản lý tài chính của trung tâm Anh ngữ, bao gồm:
- Ghi nhận thanh toán học phí
- Quản lý lịch sử giao dịch
- Báo cáo doanh thu và công nợ
- Xuất biên lai/hóa đơn

## 🎯 Chức năng chính

### 1. Dashboard Tổng quan
- **Thống kê nhanh**: Doanh thu, giao dịch, công nợ
- **Top khóa học**: Khóa học có doanh thu cao nhất
- **Truy cập**: Tab "Tổng quan" trong trang Finance

### 2. Ghi nhận Thanh toán
- **Form đầy đủ**: Chọn học viên, khóa học, số tiền, phương thức
- **Validation**: Kiểm tra tính hợp lệ của dữ liệu
- **Phương thức**: Tiền mặt, chuyển khoản, thẻ tín dụng, ví điện tử
- **Truy cập**: Button "Ghi nhận thanh toán" ở header

### 3. Lịch sử Giao dịch
- **Bảng đầy đủ**: Hiển thị tất cả giao dịch với thông tin chi tiết
- **Bộ lọc mạnh mẽ**: Theo tên, mã HV, trạng thái, phương thức, ngày
- **Phân trang**: Hiển thị 10 giao dịch/trang
- **Xuất CSV**: Tải dữ liệu về Excel
- **Truy cập**: Tab "Giao dịch"

### 4. Báo cáo Tài chính
- **Doanh thu theo tháng**: Biểu đồ và thống kê chi tiết
- **Công nợ quá hạn**: Danh sách khách hàng chưa thanh toán
- **AR Aging**: Phân tích tuổi nợ theo khoảng thời gian
- **Báo cáo theo khóa học**: Doanh thu và hiệu quả từng khóa
- **Truy cập**: Tab "Báo cáo"

### 5. Biên lai/Hóa đơn
- **Xem biên lai**: Hiển thị đầy đủ thông tin thanh toán
- **In biên lai**: Chức năng in trực tiếp
- **Xuất PDF**: Tải biên lai dạng PDF (sẽ cài đặt)
- **Truy cập**: Button "Xem biên lai" trong bảng giao dịch

## 🗂️ Cấu trúc File

```
src/components/Finance/
├── PaymentManagement.jsx    # Component chính với tabs
├── PaymentForm.jsx          # Form ghi nhận thanh toán  
├── PaymentHistory.jsx       # Bảng lịch sử giao dịch
├── FinanceReports.jsx       # Dashboard báo cáo
├── InvoiceModal.jsx         # Modal xem/in biên lai
└── index.js                 # Export components

src/pages/
└── FinancePage.jsx          # Page wrapper cho Finance
```

## 🎨 UI/UX Features

### Design
- **Clean & Modern**: Thiết kế sạch sẽ, dễ sử dụng
- **Responsive**: Tương thích mobile và desktop
- **Color Coding**: 
  - 🟢 Xanh: Doanh thu, thanh toán thành công
  - 🟡 Vàng: Đang xử lý, cảnh báo nhẹ
  - 🔴 Đỏ: Công nợ, quá hạn, lỗi

### Navigation
- **Tab-based**: 3 tab chính (Tổng quan, Giao dịch, Báo cáo)
- **Modal Forms**: Form và chi tiết hiển thị dạng modal
- **Quick Actions**: Buttons nổi bật cho actions quan trọng

### Data Visualization
- **Progress Bars**: Hiển thị tỷ lệ doanh thu
- **Status Badges**: Trạng thái giao dịch dễ nhận biết
- **Summary Cards**: Thống kê nhanh dạng card

## 📊 Business Rules

### Thanh toán
- **Validation**: Số tiền > 0, bắt buộc chọn học viên & khóa học
- **Phương thức**: Hỗ trợ 4 loại (tiền mặt, chuyển khoản, thẻ, ví điện tử)
- **Trạng thái**: Completed, Pending, Failed

### Công nợ
- **Quá hạn**: Tính theo ngày (0-30, 31-60, 61-90, >90 ngày)
- **Màu cảnh báo**: Vàng (≤30), Cam (31-60), Đỏ (>60)
- **Logic**: `sum(payments) >= course_fee` → "Đã đóng"

## 🔧 Technical Details

### Dependencies
- **React**: Functional components với hooks
- **Tailwind CSS**: Styling responsive
- **Lucide React**: Icons đẹp và nhất quán
- **Date handling**: JavaScript Date API

### State Management
- **useState**: Local state cho forms và filters
- **Props**: Truyền data giữa components
- **Dummy Data**: Hardcoded trong components (sẽ thay bằng API)

### Features sẽ thêm
- [ ] **API Integration**: Kết nối với backend Django
- [ ] **PDF Generation**: Thư viện jsPDF cho xuất PDF
- [ ] **Charts**: Chart.js hoặc Recharts cho biểu đồ
- [ ] **Real-time**: WebSocket cho cập nhật real-time
- [ ] **Bulk Actions**: Xử lý nhiều giao dịch cùng lúc

## 🚀 Cách sử dụng

### Truy cập
1. Đăng nhập với quyền Admin
2. Click "Quản lý Tài chính" trong sidebar
3. URL: `http://localhost:5174/finance`

### Workflow thông thường
1. **Xem tổng quan** → Kiểm tra doanh thu và công nợ
2. **Ghi nhận thanh toán** → Thêm giao dịch mới
3. **Kiểm tra lịch sử** → Xem và tìm kiếm giao dịch
4. **Xuất biên lai** → In hoặc tải PDF cho khách hàng
5. **Xem báo cáo** → Phân tích doanh thu và công nợ

### Keyboard Shortcuts
- **Ctrl + P**: In biên lai (khi modal mở)
- **ESC**: Đóng modal/form
- **Enter**: Submit form (khi focus vào button)

## 🔒 Permissions
- **Admin**: Full access tất cả chức năng
- **Staff**: Chỉ xem và ghi nhận thanh toán (sẽ cài đặt)
- **Teacher/Student**: Không có quyền truy cập

---

**Lưu ý**: Module này đang sử dụng dummy data. Khi tích hợp API, cần cập nhật các service calls và error handling.