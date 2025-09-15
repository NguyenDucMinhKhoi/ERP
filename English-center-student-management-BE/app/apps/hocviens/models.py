from django.db import models
from django.core.validators import RegexValidator
from app.core.models import BaseModel
from app.apps.users.models import User


class HocVien(BaseModel):
    """
    Model quản lý thông tin học viên
    """
    TRANG_THAI_HOC_PHI_CHOICES = [
        ('dadong', 'Đã đóng'),
        ('conno', 'Còn nợ'),
        ('chuadong', 'Chưa đóng'),
    ]

    ten = models.CharField(max_length=100, verbose_name='Họ và tên')
    email = models.EmailField(unique=True, verbose_name='Email')
    sdt = models.CharField(
        max_length=15,
        validators=[
            RegexValidator(
                regex=r'^(\+84|84|0)?[1-9]\d{8}$',
                message='Số điện thoại không hợp lệ'
            )
        ],
        verbose_name='Số điện thoại'
    )
    ngay_sinh = models.DateField(verbose_name='Ngày sinh')
    trang_thai_hoc_phi = models.CharField(
        max_length=20,
        choices=TRANG_THAI_HOC_PHI_CHOICES,
        default='chuadong',
        verbose_name='Trạng thái học phí'
    )
    ghi_chu = models.TextField(blank=True, null=True, verbose_name='Ghi chú')
    user = models.OneToOneField(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name='Tài khoản'
    )

    class Meta:
        verbose_name = 'Học viên'
        verbose_name_plural = 'Học viên'
        ordering = ['-created_at']
        db_table = 'erp_students'
        
    def __str__(self):
        return self.ten

    @property
    def tuoi(self):
        from datetime import date
        today = date.today()
        return today.year - self.ngay_sinh.year - ((today.month, today.day) < (self.ngay_sinh.month, self.ngay_sinh.day))

    @property
    def co_tai_khoan(self):
        return self.user is not None
