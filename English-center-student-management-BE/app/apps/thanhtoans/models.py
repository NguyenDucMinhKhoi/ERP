from django.db import models
from django.utils import timezone
from app.core.models import BaseModel
from app.apps.hocviens.models import HocVien


class ThanhToan(BaseModel):
    """
    Model quản lý thanh toán học phí
    """
    HINH_THUC_CHOICES = [
        ('tienmat', 'Tiền mặt'),
        ('chuyenkhoan', 'Chuyển khoản'),
        ('the', 'Thẻ'),
    ]

    TRANG_THAI_CHOICES = [
        ('pending', 'Chưa thanh toán'),
        ('partial', 'Thanh toán một phần'),
        ('paid', 'Đã thanh toán'),
    ]

    hocvien = models.ForeignKey(
        HocVien,
        on_delete=models.CASCADE,
        verbose_name='Học viên'
    )
    so_tien = models.DecimalField(
        max_digits=12,
        decimal_places=0,
        verbose_name='Số tiền (VNĐ)'
    )
    # created when payment is recorded; nullable for invoices created without payment
    ngay_dong = models.DateTimeField(null=True, blank=True, verbose_name='Ngày đóng')
    # payment method can be empty for invoices created before recording payment
    hinh_thuc = models.CharField(
        max_length=20,
        choices=HINH_THUC_CHOICES,
        null=True,
        blank=True,
        verbose_name='Hình thức thanh toán'
    )
    # receipt number optional until payment is recorded; keep uniqueness when provided
    so_bien_lai = models.CharField(
        max_length=50,
        unique=True,
        null=True,
        blank=True,
        verbose_name='Số biên lai'
    )
    # payment status: pending / partial / paid
    trang_thai = models.CharField(
        max_length=16,
        choices=TRANG_THAI_CHOICES,
        default='pending',
        verbose_name='Trạng thái thanh toán'
    )

    ghi_chu = models.TextField(blank=True, null=True, verbose_name='Ghi chú')

    class Meta:
        verbose_name = 'Thanh toán'
        verbose_name_plural = 'Thanh toán'
        ordering = ['-ngay_dong']
        db_table = 'erp_payments'
        
    def __str__(self):
        status_display = dict(self.TRANG_THAI_CHOICES).get(self.trang_thai, '')
        method_display = self.get_hinh_thuc_display() if self.hinh_thuc else ''
        return f"{self.hocvien.ten} - {self.so_tien:,} VNĐ - {method_display} {status_display}"

    def save(self, *args, **kwargs):
        # If payment is marked as paid but ngay_dong not set, set it now
        if self.trang_thai == 'paid' and not self.ngay_dong:
            self.ngay_dong = timezone.now()

        super().save(*args, **kwargs)
        # Only update HocVien payment status when a payment is recorded as paid or partial
        if self.trang_thai in ('paid', 'partial'):
            self._update_hocvien_status()

    def _update_hocvien_status(self):
        """
        Cập nhật trạng thái học phí của học viên
        """
        # Tính tổng tiền đã đóng (chỉ tính các thanh toán có trạng_thai != pending)
        total_paid = ThanhToan.objects.filter(hocvien=self.hocvien, trang_thai__in=['partial', 'paid']).aggregate(
            total=models.Sum('so_tien')
        )['total'] or 0

        # Lấy tổng học phí từ các khóa học đã đăng ký
        from app.apps.dangky.models import DangKyKhoaHoc
        total_fee = DangKyKhoaHoc.objects.filter(
            hocvien=self.hocvien,
            trang_thai__in=['dang_hoc', 'hoan_thanh']
        ).aggregate(
            total=models.Sum('khoahoc__hoc_phi')
        )['total'] or 0

        if total_fee and total_paid >= total_fee:
            self.hocvien.trang_thai_hoc_phi = 'dadong'
        elif total_paid > 0:
            self.hocvien.trang_thai_hoc_phi = 'conno'
        else:
            self.hocvien.trang_thai_hoc_phi = 'chuadong'

        self.hocvien.save()
