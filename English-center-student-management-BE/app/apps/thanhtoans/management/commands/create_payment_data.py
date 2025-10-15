from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import datetime, timedelta
import random
from decimal import Decimal
from app.apps.hocviens.models import HocVien
from app.apps.thanhtoans.models import ThanhToan


class Command(BaseCommand):
    help = 'Tạo dữ liệu mẫu cho thanh toán học phí'

    def add_arguments(self, parser):
        parser.add_argument(
            '--payments',
            type=int,
            default=50,
            help='Số lượng thanh toán cần tạo (mặc định: 50)'
        )

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Bắt đầu tạo dữ liệu thanh toán mẫu...'))

        # Xóa dữ liệu cũ nếu có
        if options.get('clear', False):
            ThanhToan.objects.all().delete()
            self.stdout.write(self.style.WARNING('Đã xóa tất cả dữ liệu thanh toán cũ'))

        # Tạo thanh toán mẫu
        self.create_sample_payments(options['payments'])

        self.stdout.write(
            self.style.SUCCESS(
                f'Đã tạo thành công {options["payments"]} thanh toán mẫu!'
            )
        )

    def create_sample_payments(self, count):
        """Tạo dữ liệu mẫu cho thanh toán"""
        self.stdout.write('Tạo thanh toán mẫu...')
        
        # Lấy danh sách học viên
        students = list(HocVien.objects.all())
        if not students:
            self.stdout.write(self.style.ERROR('Không có học viên nào trong database. Hãy tạo học viên trước.'))
            return

        # Các hình thức thanh toán
        payment_methods = ['tienmat', 'chuyenkhoan', 'the']
        
        # Các khoản tiền phổ biến
        common_amounts = [
            500000, 750000, 1000000, 1250000, 1500000,
            2000000, 2500000, 3000000, 3500000, 4000000
        ]

        created_count = 0
        for i in range(count):
            try:
                # Chọn học viên ngẫu nhiên
                student = random.choice(students)
                
                # Tạo số tiền ngẫu nhiên
                amount = random.choice(common_amounts)
                
                # Chọn hình thức thanh toán ngẫu nhiên
                payment_method = random.choice(payment_methods)
                
                # Tạo ngày thanh toán ngẫu nhiên trong 6 tháng qua
                days_ago = random.randint(0, 180)
                payment_date = timezone.now() - timedelta(days=days_ago)
                
                # Tạo số biên lai unique
                receipt_number = f"BL{payment_date.strftime('%Y%m%d')}{str(i+1).zfill(3)}"
                
                # Kiểm tra xem số biên lai đã tồn tại chưa
                if ThanhToan.objects.filter(so_bien_lai=receipt_number).exists():
                    receipt_number = f"BL{payment_date.strftime('%Y%m%d')}{str(i+1).zfill(3)}{random.randint(10,99)}"
                
                # Tạo ghi chú ngẫu nhiên
                notes = [
                    'Thanh toán đầy đủ học phí',
                    'Thanh toán đợt 1',
                    'Thanh toán đợt 2', 
                    'Thanh toán cuối kỳ',
                    'Thanh toán bù trừ',
                    'Thanh toán gia hạn',
                    'Thanh toán học phí khóa mới',
                    'Thanh toán phí thi thử',
                    'Thanh toán phí tài liệu',
                    ''
                ]
                note = random.choice(notes)
                
                # Tạo thanh toán
                payment = ThanhToan.objects.create(
                    hocvien=student,
                    so_tien=Decimal(str(amount)),
                    hinh_thuc=payment_method,
                    so_bien_lai=receipt_number,
                    ghi_chu=note,
                    created_at=payment_date,
                    updated_at=payment_date
                )
                
                created_count += 1
                self.stdout.write(f'  ✓ Tạo thanh toán: {receipt_number} - {student.ten} - {amount:,} VNĐ')
                
            except Exception as e:
                self.stdout.write(self.style.ERROR(f'  ✗ Lỗi tạo thanh toán {i+1}: {str(e)}'))
                continue

        self.stdout.write(self.style.SUCCESS(f'Đã tạo thành công {created_count}/{count} thanh toán'))

        # Cập nhật trạng thái học phí cho học viên
        self.update_student_payment_status()

    def update_student_payment_status(self):
        """Cập nhật trạng thái học phí của học viên dựa trên thanh toán"""
        self.stdout.write('Cập nhật trạng thái học phí học viên...')
        
        for student in HocVien.objects.all():
            payments = ThanhToan.objects.filter(hocvien=student)
            total_paid = sum(payment.so_tien for payment in payments)
            
            # Logic đơn giản để phân loại trạng thái
            if total_paid == 0:
                student.trang_thai_hoc_phi = 'chuadong'
            elif total_paid >= 3000000:  # Coi như đã đóng đủ nếu trên 3 triệu
                student.trang_thai_hoc_phi = 'dadong'
            else:
                student.trang_thai_hoc_phi = 'conno'
            
            student.save()
            
        self.stdout.write('✓ Đã cập nhật trạng thái học phí cho tất cả học viên')