from django.db import models
from django.core.validators import MinValueValidator
from app.core.models import BaseModel


class KhoaHoc(BaseModel):
    """
    Model quản lý khóa học
    """
    ten = models.CharField(max_length=200, verbose_name='Tên khóa học')
    lich_hoc = models.CharField(max_length=100, verbose_name='Lịch học')
    giang_vien = models.CharField(max_length=100, verbose_name='Giảng viên')
    so_buoi = models.IntegerField(
        validators=[MinValueValidator(1)],
        verbose_name='Số buổi học'
    )
    hoc_phi = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)],
        verbose_name='Học phí'
    )
    mo_ta = models.TextField(blank=True, null=True, verbose_name='Mô tả')
    trang_thai = models.CharField(
        max_length=20,
        choices=[
            ('mo', 'Mở'),
            ('dong', 'Đóng'),
            ('hoan_thanh', 'Hoàn thành')
        ],
        default='mo',
        verbose_name='Trạng thái'
    )

    class Meta:
        verbose_name = 'Khóa học'
        verbose_name_plural = 'Khóa học'
        ordering = ['-created_at']
        db_table = 'erp_courses'
        
    def __str__(self):
        return self.ten

    @property
    def so_hoc_vien(self):
        """Số học viên đăng ký"""
        return self.dangkykhoahoc_set.count()

    @property
    def ty_le_hoan_thanh(self):
        """Tỷ lệ hoàn thành trung bình"""
        dang_ky = self.dangkykhoahoc_set.all()
        if not dang_ky:
            return 0
        return sum(dk.phan_tram_hoan_thanh for dk in dang_ky) / len(dang_ky)
