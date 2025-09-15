# CRM Trung Tâm Tiếng Anh

Hệ thống quản lý học viên trung tâm tiếng Anh được xây dựng với Django 5.x, Django REST Framework và PostgreSQL.

## Tính năng chính

- **Quản lý người dùng**: Hệ thống role-based access control (Admin, Nhân viên, Học viên)
- **Quản lý học viên**: Thông tin cá nhân, trạng thái học phí
- **Quản lý khóa học**: Thông tin khóa học, giảng viên, học phí
- **Đăng ký khóa học**: Theo dõi tiến độ học tập
- **Quản lý thanh toán**: Theo dõi học phí, biên lai
- **Chăm sóc học viên**: Hỗ trợ, tư vấn, theo dõi
- **Thông báo**: Gửi thông báo cho từng nhóm người dùng
- **Báo cáo thống kê**: Dashboard tổng quan, báo cáo tài chính, học tập

## Công nghệ sử dụng

- **Backend**: Django 5.x + Django REST Framework
- **Database**: PostgreSQL
- **Authentication**: JWT (djangorestframework-simplejwt)
- **API Documentation**: drf-spectacular (Swagger/OpenAPI)
- **Containerization**: Docker + Docker Compose
- **Testing**: pytest-django

## Cấu trúc thư mục

```
/app
├── settings/          # Cấu hình Django (base, dev, prod)
├── apps/             # Các ứng dụng Django
│   ├── users/        # Quản lý người dùng
│   ├── hocviens/     # Quản lý học viên
│   ├── khoahocs/     # Quản lý khóa học
│   ├── dangky/       # Đăng ký khóa học
│   ├── thanhtoans/   # Quản lý thanh toán
│   ├── chamsoc/      # Chăm sóc học viên
│   ├── thongbaos/    # Quản lý thông báo
│   └── reports/      # Báo cáo thống kê
├── core/             # Core utilities (pagination, permissions, models)
└── admin.py          # Django admin interface
```

## Cài đặt và chạy

### 1) Yêu cầu hệ thống

- Cài Docker Desktop (Windows/Mac) hoặc Docker Engine + Docker Compose V2 (Linux)
- RAM còn trống tối thiểu ~2GB
- Mở cổng 8000 (API) và 55432 (PostgreSQL trên host)

### 2) Clone repository

```bash
git clone <repository-url>
cd crm-trung-tam-tieng-anh
```

### 3) Cấu hình môi trường

```bash
# Copy file môi trường
cp env.example .env

# Chỉnh sửa các biến trong .env nếu cần
```

File `.env` mẫu (bạn có thể copy nội dung này vào `.env`):

```
# Django
DEBUG=1
SECRET_KEY=changeme

# Postgres (trong Docker network: HOST=db, PORT=5432)
POSTGRES_DB=crm
POSTGRES_USER=username
POSTGRES_PASSWORD=password
POSTGRES_HOST=db
POSTGRES_PORT=5432

# JWT (ví dụ)
JWT_ACCESS_LIFETIME=900
JWT_REFRESH_LIFETIME=604800
```

### 4) Chạy với Docker (Development)

```bash
# Build và chạy các services (file dev)
docker compose -f docker-compose.dev.yml up -d --build

# Chạy migrations
docker compose -f docker-compose.dev.yml exec api python manage.py migrate

# Tạo superuser (tùy chọn)
docker compose -f docker-compose.dev.yml exec api python manage.py createsuperuser

# Load dữ liệu mẫu
docker compose -f docker-compose.dev.yml exec api python manage.py loaddata seed.json
```

### 5) Truy cập ứng dụng

- **API**: http://localhost:8000/api/
- **Admin**: http://localhost:8000/admin/
- **API Docs**: http://localhost:8000/api/docs/
- **PostgreSQL (từ máy host)**: `localhost:55432` (map 55432 -> 5432 trong container)
  - User mặc định: lấy từ `.env` (ví dụ `erp`)
  - Password: lấy từ `.env` (ví dụ `aicungbietpass`)
  - Database: `crm`

## Tài khoản mặc định

Sau khi load seed data, bạn có thể sử dụng các tài khoản sau:

### Admin
- **Username**: admin
- **Password**: Admin@123

### Nhân viên
- **Username**: nhanvien1 / nhanvien2
- **Password**: Nhanvien@123

### Học viên
- **Username**: hocvien1 / hocvien2
- **Password**: Hocvien@123

## API Endpoints

### Authentication
- `POST /api/auth/register/` - Đăng ký tài khoản
- `POST /api/auth/login/` - Đăng nhập
- `POST /api/auth/logout/` - Đăng xuất
- `POST /api/auth/refresh/` - Làm mới token

### Users (Admin only)
- `GET/POST /api/users/` - Danh sách và tạo user
- `GET/PUT/DELETE /api/users/{id}/` - Chi tiết, cập nhật, xóa user

### Học viên
- `GET/POST /api/hocviens/` - Danh sách và tạo học viên (Nhân viên/Admin)
- `GET/PUT/DELETE /api/hocviens/{id}/` - Chi tiết, cập nhật, xóa học viên
- `GET /api/hocviens/me/` - Thông tin học viên hiện tại
- `GET /api/hocviens/stats/` - Thống kê học viên

### Khóa học
- `GET/POST /api/khoahocs/` - Danh sách và tạo khóa học (Nhân viên/Admin)
- `GET/PUT/DELETE /api/khoahocs/{id}/` - Chi tiết, cập nhật, xóa khóa học
- `GET /api/khoahocs/public/` - Danh sách khóa học công khai
- `GET /api/khoahocs/stats/` - Thống kê khóa học

### Đăng ký khóa học
- `GET/POST /api/dangky/` - Danh sách và tạo đăng ký (Nhân viên/Admin)
- `GET/PUT/DELETE /api/dangky/{id}/` - Chi tiết, cập nhật, xóa đăng ký
- `GET /api/dangky/me/` - Danh sách đăng ký của học viên hiện tại
- `GET /api/dangky/stats/` - Thống kê đăng ký

### Thanh toán
- `GET/POST /api/thanhtoans/` - Danh sách và tạo thanh toán (Nhân viên/Admin)
- `GET/PUT/DELETE /api/thanhtoans/{id}/` - Chi tiết, cập nhật, xóa thanh toán
- `GET /api/thanhtoans/me/` - Danh sách thanh toán của học viên hiện tại
- `GET /api/thanhtoans/stats/` - Thống kê thanh toán

### Chăm sóc học viên
- `GET/POST /api/chamsoc/` - Danh sách và tạo chăm sóc (Nhân viên/Admin)
- `GET/PUT/DELETE /api/chamsoc/{id}/` - Chi tiết, cập nhật, xóa chăm sóc
- `GET /api/chamsoc/me/` - Danh sách chăm sóc của học viên hiện tại
- `GET /api/chamsoc/stats/` - Thống kê chăm sóc

### Thông báo
- `GET/POST /api/thongbaos/` - Danh sách và tạo thông báo (Admin/Nhân viên)
- `GET/PUT/DELETE /api/thongbaos/{id}/` - Chi tiết, cập nhật, xóa thông báo
- `GET /api/thongbaos/public/` - Danh sách thông báo công khai
- `GET /api/thongbaos/me/` - Thông báo cá nhân
- `GET /api/thongbaos/stats/` - Thống kê thông báo

### Báo cáo (Admin only)
- `GET /api/reports/overview/` - Báo cáo tổng quan
- `GET /api/reports/financial/` - Báo cáo tài chính
- `GET /api/reports/academic/` - Báo cáo học tập

## Quyền truy cập (RBAC)

### Admin
- Toàn quyền truy cập tất cả endpoints
- Quản lý users, reports
- Tạo thông báo cho mọi người

### Nhân viên
- CRUD học viên, khóa học, đăng ký, thanh toán, chăm sóc
- Xem thống kê của các module
- Tạo thông báo cho nhóm người dùng

### Học viên
- Xem thông tin cá nhân
- Xem tiến độ học tập
- Xem thông báo công khai và cá nhân
- Xem danh sách khóa học công khai

## Testing

```bash
# Chạy tests
docker compose exec api python -m pytest

# Chạy tests với coverage
docker compose exec api python -m pytest --cov=app --cov-report=html

# Chạy tests cụ thể
docker compose exec api python -m pytest app/apps/users/tests.py
```

## Development

### 6) Tạo migration mới

```bash
docker compose -f docker-compose.dev.yml exec api python manage.py makemigrations
docker compose -f docker-compose.dev.yml exec api python manage.py migrate
```

### 7) Tạo superuser

```bash
docker compose -f docker-compose.dev.yml exec api python manage.py createsuperuser
```

### Shell

```bash
docker compose -f docker-compose.dev.yml exec api python manage.py shell
```

### 8) Troubleshooting Docker

- Nếu đã đổi `POSTGRES_PASSWORD` hoặc `POSTGRES_USER` nhưng DB không nhận:
  ```bash
  docker compose -f docker-compose.dev.yml down -v
  docker compose -f docker-compose.dev.yml up -d --build
  ```
- Host để pgAdmin kết nối là `localhost` (không phải `db`). Cổng: `55432`.
- Trong network Docker, API kết nối DB bằng `HOST=db`, `PORT=5432`.
- Nếu máy bạn đang có PostgreSQL cục bộ chiếm cổng 5432, dự án đã map host `55432 -> container 5432` để tránh xung đột.

### 9) Quick Start (copy/paste)

```bash
# 1) Chuẩn bị env
cp env.example .env

# 2) Khởi động dev stack
docker compose -f docker-compose.dev.yml up -d --build

# 3) Áp dụng migrations và (tuỳ chọn) tạo superuser
docker compose -f docker-compose.dev.yml exec api python manage.py migrate
# docker compose -f docker-compose.dev.yml exec api python manage.py createsuperuser

# 4) Truy cập API
# - Swagger: http://localhost:8000/api/docs/
# - Admin:   http://localhost:8000/admin/

# 5) Kết nối DB từ host (psql):
# psql "host=127.0.0.1 port=55432 dbname=crm user=erp password=aicungbietpass"
```

### 10) Quy ước tên bảng (DB table names)

- Các model domain dùng tên bảng rõ ràng qua `Meta.db_table`:
  - users → `erp_users`
  - hocviens → `erp_students`
  - khoahocs → `erp_courses`
  - dangky → `erp_enrollment`
  - thanhtoans → `erp_payments`
  - chamsoc → `erp_care_logs`
  - thongbaos → `erp_notifications`
- Bảng hệ thống của Django (`auth_*`, `django_*`) được tạo tự động khi migrate; không nên đổi tên.

### 11) Quy trình Git: Merge Request từ nhánh chức năng vào `develop`

1. Tạo nhánh chức năng từ `develop` (đảm bảo `develop` mới nhất):
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b task/#<id-task><short-desc>
   ```
   Gợi ý đặt tên: `feature/#1_users_crud`, `fix/#2_payments_calc`, `chore/#3_devops_docker`.

2. Commit theo đơn vị nhỏ, message rõ ràng:
   ```bash
   git add -A
   git commit -m "feat(users): add CRUD for user profile, refs#1"
   ```

3. Đồng bộ nhánh lên remote và mở Merge Request (MR) vào `develop`:
   ```bash
   git push -u origin task/#<id-task><short-desc>
   ```
   - Trên Git hosting (GitHub/GitLab), tạo MR → target branch: `develop`.
   - Mô tả thay đổi, ảnh hưởng DB (nếu có), cách test, liên kết task.

4. Review & CI:
   - Đảm bảo build/migration/tests pass trên CI.
   - Sửa theo review → push thêm commit lên cùng nhánh.

5. Merge chiến lược đề xuất: Squash & Merge vào `develop`.
   - Sau khi merge, xóa nhánh chức năng trên remote để dọn dẹp.

6. Cập nhật local sau khi MR được merge:
   ```bash
   git checkout develop
   git pull origin develop
   ```

7. Nếu có migration DB đi kèm, ghi rõ trong MR và cập nhật `README`/changelog nếu thay đổi breaking.

## Production

Để deploy production, sử dụng file `app/settings/prod.py`:

```bash
# Set environment variable
export DJANGO_SETTINGS_MODULE=app.settings.prod

# Collect static files
python manage.py collectstatic --noinput

# Run with gunicorn
gunicorn app.wsgi:application --bind 0.0.0.0:8000
```

## Contributing

1. Fork repository
2. Tạo feature branch (`git checkout -b task/#1_login`)
3. Commit changes (`git commit -m 'Task: Login UI, refs#1'`)
4. Push to branch (`git push origin task/#1_login`)
5. Tạo Merge Request
