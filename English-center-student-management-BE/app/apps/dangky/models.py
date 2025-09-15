from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from app.core.models import BaseModel
from app.apps.hocviens.models import HocVien
from app.apps.khoahocs.models import KhoaHoc


class DangKyKhoaHoc(BaseModel):
    """
    Model quản lý đăng ký khóa học
    """
    hocvien = models.ForeignKey(
        HocVien,
        on_delete=models.CASCADE,
        verbose_name='Học viên'
    )
    khoahoc = models.ForeignKey(
        KhoaHoc,
        on_delete=models.CASCADE,
        verbose_name='Khóa học'
    )
    ngay_dang_ky = models.DateTimeField(auto_now_add=True, verbose_name='Ngày đăng ký')
    phan_tram_hoan_thanh = models.IntegerField(
        default=0,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        verbose_name='Phần trăm hoàn thành'
    )
    trang_thai = models.CharField(
        max_length=20,
        choices=[
            ('dang_ky', 'Đã đăng ký'),
            ('dang_hoc', 'Đang học'),
            ('hoan_thanh', 'Hoàn thành'),
            ('huy', 'Hủy')
        ],
        default='dang_ky',
        verbose_name='Trạng thái'
    )
    ghi_chu = models.TextField(blank=True, null=True, verbose_name='Ghi chú')

    class Meta:
        verbose_name = 'Đăng ký khóa học'
        verbose_name_plural = 'Đăng ký khóa học'
        unique_together = ['hocvien', 'khoahoc']
        ordering = ['-ngay_dang_ky']
        db_table = 'erp_enrollment'

    def __str__(self):
        return f"{self.hocvien.ten} - {self.khoahoc.ten}"

    @property
    def tien_do(self):
        """Tính tiến độ học tập"""
        if self.phan_tram_hoan_thanh >= 100:
            return "Hoàn thành"
        elif self.phan_tram_hoan_thanh >= 80:
            return "Gần hoàn thành"
        elif self.phan_tram_hoan_thanh >= 50:
            return "Đang học"
        else:
            return "Mới bắt đầu"
