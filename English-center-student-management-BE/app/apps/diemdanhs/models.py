from django.db import models
from app.core.models import BaseModel
from app.apps.hocviens.models import HocVien
from app.apps.lichhocs.models import LichHoc


class DiemDanh(BaseModel):
    """
    Model quản lý điểm danh
    """
    lich_hoc = models.ForeignKey(
        LichHoc,
        on_delete=models.CASCADE,
        verbose_name='Lịch học'
    )
    hoc_vien = models.ForeignKey(
        HocVien,
        on_delete=models.CASCADE,
        verbose_name='Học viên'
    )
    thoi_gian = models.DateTimeField(blank=True, null=True, verbose_name='Thời gian điểm danh')
    trang_thai = models.CharField(
        max_length=20,
        choices=[
            ('co_mat', 'Có mặt'),
            ('vang_co_phep', 'Vắng có phép'),
            ('vang_khong_phep', 'Vắng không phép')
        ],
        default='co_mat',
        verbose_name='Trạng thái điểm danh'
    )
    ghi_chu = models.TextField(blank=True, null=True, verbose_name='Ghi chú')

    class Meta:
        verbose_name = 'Điểm danh'
        verbose_name_plural = 'Điểm danh'
        ordering = ['-created_at']
        db_table = 'erp_attendances'
        unique_together = ['lich_hoc', 'hoc_vien']

    def __str__(self):
        return f"{self.hoc_vien.ten} - {self.lich_hoc} - {self.trang_thai}"