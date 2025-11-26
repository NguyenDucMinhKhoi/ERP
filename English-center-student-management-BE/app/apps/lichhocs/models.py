from django.db import models
from app.core.models import BaseModel
from app.apps.lophocs.models import LopHoc


class LichHoc(BaseModel):
    """
    Model quản lý lịch học
    """
    lop_hoc = models.ForeignKey(
        LopHoc,
        on_delete=models.CASCADE,
        verbose_name='Lớp học'
    )
    lophocid = models.UUIDField(verbose_name='LopHoc ID', null=True, blank=True)  # Add this column
    ngay_hoc = models.CharField(max_length=16)  # e.g. "friday", "sunday"
    gio_bat_dau = models.TimeField(verbose_name='Giờ bắt đầu')
    gio_ket_thuc = models.TimeField(verbose_name='Giờ kết thúc')
    phong_hoc = models.CharField(max_length=50, verbose_name='Phòng học', blank=True, null=True)
    noi_dung = models.TextField(blank=True, null=True, verbose_name='Nội dung buổi học')
    note = models.CharField(max_length=255, blank=True, null=True, verbose_name='Ghi chú')  # New note field (string)

    class Meta:
        verbose_name = 'Lịch học'
        verbose_name_plural = 'Lịch học'
        ordering = ['ngay_hoc', 'gio_bat_dau']
        db_table = 'erp_schedules'
        unique_together = ['lop_hoc', 'ngay_hoc', 'gio_bat_dau']

    def __str__(self):
        return f"{self.lop_hoc.ten} - {self.ngay_hoc} ({self.gio_bat_dau} - {self.gio_ket_thuc})"