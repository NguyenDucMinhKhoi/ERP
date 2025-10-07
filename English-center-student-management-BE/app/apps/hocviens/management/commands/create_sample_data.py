from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import date, timedelta
from app.apps.hocviens.models import HocVien
from app.apps.khoahocs.models import KhoaHoc
from app.apps.users.models import User


class Command(BaseCommand):
    help = 'Tạo dữ liệu mẫu cho học viên và khóa học'

    def add_arguments(self, parser):
        parser.add_argument(
            '--students',
            type=int,
            default=10,
            help='Số lượng học viên cần tạo (mặc định: 10)'
        )
        parser.add_argument(
            '--courses',
            type=int,
            default=5,
            help='Số lượng khóa học cần tạo (mặc định: 5)'
        )

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Bắt đầu tạo dữ liệu mẫu...'))

        # Tạo khóa học mẫu
        self.create_sample_courses(options['courses'])
        
        # Tạo học viên mẫu
        self.create_sample_students(options['students'])

        self.stdout.write(
            self.style.SUCCESS(
                f'Đã tạo thành công {options["courses"]} khóa học và {options["students"]} học viên!'
            )
        )

    def create_sample_courses(self, count):
        """Tạo dữ liệu mẫu cho khóa học"""
        self.stdout.write('Tạo khóa học mẫu...')
        
        courses_data = [
            {
                'ten': 'TOEIC 450-650',
                'mo_ta': 'Khóa học TOEIC từ cơ bản đến trung cấp, mục tiêu đạt 450-650 điểm',
                'lich_hoc': 'Thứ 2,4,6 - 19:00-21:00',
                'giang_vien': 'Thầy Minh',
                'hoc_phi': 2500000,
                'so_buoi': 40,
                'trang_thai': 'mo'
            },
            {
                'ten': 'IELTS 6.0-7.0',
                'mo_ta': 'Khóa học IELTS từ trung cấp đến cao cấp, mục tiêu đạt 6.0-7.0 điểm',
                'lich_hoc': 'Thứ 3,5,7 - 18:30-20:30',
                'giang_vien': 'Cô Hằng',
                'hoc_phi': 3500000,
                'so_buoi': 50,
                'trang_thai': 'mo'
            },
            {
                'ten': 'TOEFL 80-100',
                'mo_ta': 'Khóa học TOEFL iBT, mục tiêu đạt 80-100 điểm',
                'lich_hoc': 'Cuối tuần - 08:00-12:00',
                'giang_vien': 'Thầy Long',
                'hoc_phi': 3200000,
                'so_buoi': 45,
                'trang_thai': 'mo'
            },
            {
                'ten': 'General English A1-A2',
                'mo_ta': 'Khóa học tiếng Anh giao tiếp cơ bản, từ A1 lên A2',
                'lich_hoc': 'Thứ 2,4,6 - 17:00-19:00',
                'giang_vien': 'Cô Linh',
                'hoc_phi': 2000000,
                'so_buoi': 36,
                'trang_thai': 'mo'
            },
            {
                'ten': 'Business English',
                'mo_ta': 'Tiếng Anh thương mại, giao tiếp trong môi trường công việc',
                'lich_hoc': 'Thứ 3,5 - 19:30-21:30',
                'giang_vien': 'Thầy Đức',
                'hoc_phi': 2800000,
                'so_buoi': 42,
                'trang_thai': 'dong'
            },
            {
                'ten': 'IELTS 5.0-6.0',
                'mo_ta': 'Khóa học IELTS cơ bản, mục tiêu đạt 5.0-6.0 điểm',
                'lich_hoc': 'Thứ 2,4,6 - 20:00-22:00',
                'giang_vien': 'Cô Mai',
                'hoc_phi': 3000000,
                'so_buoi': 48,
                'trang_thai': 'mo'
            }
        ]

        created_courses = 0
        for i, course_data in enumerate(courses_data):
            if created_courses >= count:
                break
                
            course, created = KhoaHoc.objects.get_or_create(
                ten=course_data['ten'],
                defaults=course_data
            )
            
            if created:
                created_courses += 1
                self.stdout.write(f'  ✓ Tạo khóa học: {course.ten}')
            else:
                self.stdout.write(f'  - Khóa học đã tồn tại: {course.ten}')

    def create_sample_students(self, count):
        """Tạo dữ liệu mẫu cho học viên"""
        self.stdout.write('Tạo học viên mẫu...')
        
        students_data = [
            {
                'ten': 'Nguyễn Văn An',
                'email': 'nguyenvanan@gmail.com',
                'sdt': '0901234567',
                'ngay_sinh': date(1995, 3, 15),
                'trang_thai_hoc_phi': 'dadong',
                'ghi_chu': 'Học viên chăm chỉ, tiến bộ tốt'
            },
            {
                'ten': 'Trần Thị Bình',
                'email': 'tranthibinh@yahoo.com',
                'sdt': '0912345678',
                'ngay_sinh': date(1998, 7, 22),
                'trang_thai_hoc_phi': 'conno',
                'ghi_chu': 'Cần nhắc nhở về việc đóng học phí'
            },
            {
                'ten': 'Lê Minh Cường',
                'email': 'leminhcuong@outlook.com',
                'sdt': '0923456789',
                'ngay_sinh': date(1992, 11, 8),
                'trang_thai_hoc_phi': 'dadong',
                'ghi_chu': 'Mục tiêu du học Canada'
            },
            {
                'ten': 'Phạm Thị Dung',
                'email': 'phamthidung@gmail.com',
                'sdt': '0934567890',
                'ngay_sinh': date(2000, 5, 12),
                'trang_thai_hoc_phi': 'chuadong',
                'ghi_chu': 'Sinh viên năm cuối, cần hỗ trợ tài chính'
            },
            {
                'ten': 'Hoàng Văn Em',
                'email': 'hoangvanem@outlook.com',
                'sdt': '0945678901',
                'ngay_sinh': date(1997, 9, 30),
                'trang_thai_hoc_phi': 'dadong',
                'ghi_chu': 'Cần cải thiện kỹ năng listening'
            },
            {
                'ten': 'Võ Thị Phương',
                'email': 'vothiphuong@gmail.com',
                'sdt': '0956789012',
                'ngay_sinh': date(1994, 12, 3),
                'trang_thai_hoc_phi': 'conno',
                'ghi_chu': 'Làm việc tại công ty nước ngoài'
            },
            {
                'ten': 'Đặng Minh Giang',
                'email': 'dangminhgiang@gmail.com',
                'sdt': '0967890123',
                'ngay_sinh': date(1996, 4, 18),
                'trang_thai_hoc_phi': 'dadong',
                'ghi_chu': 'Chuẩn bị thi Cambridge FCE'
            },
            {
                'ten': 'Bùi Thị Hằng',
                'email': 'buithihang@yahoo.com',
                'sdt': '0978901234',
                'ngay_sinh': date(1993, 8, 25),
                'trang_thai_hoc_phi': 'chuadong',
                'ghi_chu': 'Mới đăng ký, chờ xác nhận học phí'
            },
            {
                'ten': 'Trương Văn Ích',
                'email': 'truongvanich@gmail.com',
                'sdt': '0989012345',
                'ngay_sinh': date(1999, 1, 14),
                'trang_thai_hoc_phi': 'dadong',
                'ghi_chu': 'Học viên ưu tú, có khả năng trở thành trợ giảng'
            },
            {
                'ten': 'Phan Thị Kim',
                'email': 'phanthikim@outlook.com',
                'sdt': '0990123456',
                'ngay_sinh': date(1991, 6, 7),
                'trang_thai_hoc_phi': 'conno',
                'ghi_chu': 'Làm việc ca đêm, cần lớp học buổi tối'
            },
            {
                'ten': 'Lý Văn Long',
                'email': 'lyvanlong@gmail.com',
                'sdt': '0901123456',
                'ngay_sinh': date(1996, 10, 20),
                'trang_thai_hoc_phi': 'dadong',
                'ghi_chu': 'Chuẩn bị đi du học Úc'
            },
            {
                'ten': 'Đinh Thị Mai',
                'email': 'dinhthimai@yahoo.com',
                'sdt': '0912234567',
                'ngay_sinh': date(1998, 2, 28),
                'trang_thai_hoc_phi': 'chuadong',
                'ghi_chu': 'Sinh viên y khoa, lịch học linh hoạt'
            }
        ]

        created_students = 0
        for i, student_data in enumerate(students_data):
            if created_students >= count:
                break
                
            student, created = HocVien.objects.get_or_create(
                email=student_data['email'],
                defaults=student_data
            )
            
            if created:
                created_students += 1
                self.stdout.write(f'  ✓ Tạo học viên: {student.ten}')
            else:
                self.stdout.write(f'  - Học viên đã tồn tại: {student.ten}')

        # Tạo thêm dữ liệu ngẫu nhiên nếu cần
        if created_students < count:
            remaining = count - created_students
            self.stdout.write(f'Tạo thêm {remaining} học viên ngẫu nhiên...')
            
            for i in range(remaining):
                student_data = {
                    'ten': f'Học viên mẫu {created_students + i + 1}',
                    'email': f'hocvien{created_students + i + 1}@example.com',
                    'sdt': f'0{900000000 + created_students + i + 1}',
                    'ngay_sinh': date(1995, 1, 1) + timedelta(days=(created_students + i) * 30),
                    'trang_thai_hoc_phi': ['dadong', 'conno', 'chuadong'][i % 3],
                    'ghi_chu': f'Học viên mẫu số {created_students + i + 1}'
                }
                
                student = HocVien.objects.create(**student_data)
                self.stdout.write(f'  ✓ Tạo học viên: {student.ten}')