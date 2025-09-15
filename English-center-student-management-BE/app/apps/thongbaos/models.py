from django.db import models
from app.core.models import BaseModel
from app.apps.users.models import User


class ThongBao(BaseModel):
    """
    Model quản lý thông báo
    """
    NGUOI_NHAN_CHOICES = [
        ('tatca', 'Tất cả'),
        ('hocvien', 'Học viên'),
        ('nhanvien', 'Nhân viên'),
        ('user', 'Người dùng cụ thể'),
    ]

    tieu_de = models.CharField(max_length=200, verbose_name='Tiêu đề')
    noi_dung = models.TextField(verbose_name='Nội dung')
    ngay_gui = models.DateTimeField(auto_now_add=True, verbose_name='Ngày gửi')
    nguoi_nhan = models.CharField(
        max_length=20,
        choices=NGUOI_NHAN_CHOICES,
        default='tatca',
        verbose_name='Người nhận'
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        verbose_name='Người dùng cụ thể',
        help_text='Chỉ cần thiết khi chọn "Người dùng cụ thể"'
    )
    trang_thai = models.CharField(
        max_length=20,
        choices=[
            ('moi', 'Mới'),
            ('dang_gui', 'Đang gửi'),
            ('da_gui', 'Đã gửi'),
            ('huy_bo', 'Hủy bỏ'),
        ],
        default='moi',
        verbose_name='Trạng thái'
    )
    loai_thong_bao = models.CharField(
        max_length=20,
        choices=[
            ('thong_bao', 'Thông báo'),
            ('canh_bao', 'Cảnh báo'),
            ('thong_tin', 'Thông tin'),
            ('khac', 'Khác'),
        ],
        default='thong_bao',
        verbose_name='Loại thông báo'
    )

    class Meta:
        verbose_name = 'Thông báo'
        verbose_name_plural = 'Thông báo'
        ordering = ['-ngay_gui']
        db_table = 'erp_notifications'

    def __str__(self):
        return f"{self.tieu_de} - {self.ngay_gui.strftime('%d/%m/%Y %H:%M')}"

    def get_nguoi_nhan_display_name(self):
        if self.nguoi_nhan == 'user' and self.user:
            return f"Người dùng: {self.user.get_full_name()}"
        return self.get_nguoi_nhan_display()

    @property
    def is_public(self):
        return self.nguoi_nhan in ['tatca', 'hocvien', 'nhanvien']
