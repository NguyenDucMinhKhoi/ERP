from django.db import models
from app.core.models import BaseModel
from app.apps.hocviens.models import HocVien
from app.apps.users.models import User


class ChamSocHocVien(BaseModel):
    """
    Model quản lý chăm sóc học viên
    """
    LOAI_CHAM_SOC_CHOICES = [
        ('tuvan', 'Tư vấn'),
        ('theodoi', 'Theo dõi'),
        ('hoidap', 'Hỏi đáp'),
        ('khac', 'Khác'),
    ]

    hocvien = models.ForeignKey(
        HocVien,
        on_delete=models.CASCADE,
        verbose_name='Học viên'
    )
    nhanvien = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name='Nhân viên chăm sóc',
        limit_choices_to={'role': 'nhanvien'}
    )
    loai_cham_soc = models.CharField(
        max_length=20,
        choices=LOAI_CHAM_SOC_CHOICES,
        default='tuvan',
        verbose_name='Loại chăm sóc'
    )
    noi_dung = models.TextField(verbose_name='Nội dung')
    ngay = models.DateTimeField(auto_now_add=True, verbose_name='Ngày chăm sóc')
    trang_thai = models.CharField(
        max_length=20,
        choices=[
            ('moi', 'Mới'),
            ('dang_xu_ly', 'Đang xử lý'),
            ('hoan_thanh', 'Hoàn thành'),
            ('dong', 'Đóng'),
        ],
        default='moi',
        verbose_name='Trạng thái'
    )
    attachments = models.JSONField(
        blank=True,
        null=True,
        verbose_name='Tệp đính kèm'
    )
    ghi_chu = models.TextField(blank=True, null=True, verbose_name='Ghi chú')

    class Meta:
        verbose_name = 'Chăm sóc học viên'
        verbose_name_plural = 'Chăm sóc học viên'
        ordering = ['-ngay']
        db_table = 'erp_care_logs'

    def __str__(self):
        return f"{self.hocvien.ten} - {self.get_loai_cham_soc_display()} - {self.ngay.strftime('%d/%m/%Y')}"

    @property
    def nhanvien_ten(self):
        return self.nhanvien.get_full_name() if self.nhanvien else 'Hệ thống'
