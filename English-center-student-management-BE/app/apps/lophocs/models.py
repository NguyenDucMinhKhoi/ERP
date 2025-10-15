from django.db import models
from app.core.models import BaseModel
from app.apps.hocviens.models import HocVien
from app.apps.khoahocs.models import KhoaHoc
from app.apps.users.models import User


class LopHoc(BaseModel):
    """
    Model quản lý lớp học
    """
    ten = models.CharField(max_length=100, verbose_name='Tên lớp học')
    khoa_hoc = models.ForeignKey(
        KhoaHoc,
        on_delete=models.CASCADE,
        verbose_name='Khóa học'
    )
    giang_vien = models.ForeignKey(  # Changed from giang_vien_id to giang_vien
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='lophocs_giang_vien'
    )
    phong_hoc = models.CharField(max_length=50, verbose_name='Phòng học', blank=True, null=True)
    ngay_bat_dau = models.DateField(verbose_name='Ngày bắt đầu')
    ngay_ket_thuc = models.DateField(verbose_name='Ngày kết thúc', null=True, blank=True)
    so_hoc_vien_toi_da = models.IntegerField(default=20, verbose_name='Số học viên tối đa')  # Added field
    trang_thai = models.CharField(
        max_length=20,
        choices=[
            ('Chờ mở lớp', 'Chờ mở lớp'),
            ('Đang học', 'Đang học'),
            ('Tạm dừng', 'Tạm dừng'),
            ('Đã kết thúc', 'Đã kết thúc'),
            ('Đã hủy', 'Đã hủy')
        ],
        default='Chờ mở lớp',
        verbose_name='Trạng thái'
    )
    mo_ta = models.TextField(blank=True, null=True, verbose_name='Mô tả')

    class Meta:
        verbose_name = 'Lớp học'
        verbose_name_plural = 'Lớp học'
        ordering = ['-created_at']
        db_table = 'erp_classes'

    def __str__(self):
        return f"{self.ten} - {self.khoa_hoc.ten}"

    @property
    def so_hoc_vien(self):
        """Số học viên trong lớp"""
        return self.dangkylophoc_set.count()