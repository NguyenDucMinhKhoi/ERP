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
    giang_vien_id = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='lophocs_giang_vien'
    )
    phong_hoc = models.CharField(max_length=50, verbose_name='Phòng học', blank=True, null=True)
    ngay_bat_dau = models.DateField(verbose_name='Ngày bắt đầu')
    ngay_ket_thuc = models.DateField(verbose_name='Ngày kết thúc', null=True, blank=True)
    trang_thai = models.CharField(
        max_length=20,
        choices=[
            ('mo', 'Mở'),
            ('dang_hoc', 'Đang học'),
            ('hoan_thanh', 'Hoàn thành'),
            ('huy', 'Hủy')
        ],
        default='mo',
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