from django.db import models
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
    ngay_dong = models.DateTimeField(auto_now_add=True, verbose_name='Ngày đóng')
    hinh_thuc = models.CharField(
        max_length=20,
        choices=HINH_THUC_CHOICES,
        verbose_name='Hình thức thanh toán'
    )
    so_bien_lai = models.CharField(
        max_length=50,
        unique=True,
        verbose_name='Số biên lai'
    )
    ghi_chu = models.TextField(blank=True, null=True, verbose_name='Ghi chú')

    class Meta:
        verbose_name = 'Thanh toán'
        verbose_name_plural = 'Thanh toán'
        ordering = ['-ngay_dong']
        db_table = 'erp_payments'
        
    def __str__(self):
        return f"{self.hocvien.ten} - {self.so_tien:,} VNĐ - {self.get_hinh_thuc_display()}"

    def save(self, *args, **kwargs):
        # Tự động cập nhật trạng thái học phí của học viên
        super().save(*args, **kwargs)
        self._update_hocvien_status()

    def _update_hocvien_status(self):
        """
        Cập nhật trạng thái học phí của học viên
        """
        # Tính tổng tiền đã đóng
        total_paid = ThanhToan.objects.filter(hocvien=self.hocvien).aggregate(
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

        if total_paid >= total_fee:
            self.hocvien.trang_thai_hoc_phi = 'dadong'
        elif total_paid > 0:
            self.hocvien.trang_thai_hoc_phi = 'conno'
        else:
            self.hocvien.trang_thai_hoc_phi = 'chuadong'

        self.hocvien.save()
