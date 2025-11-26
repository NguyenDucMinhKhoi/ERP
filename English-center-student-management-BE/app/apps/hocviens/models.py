from django.db import models
from django.core.validators import RegexValidator
from app.core.models import BaseModel
from app.apps.users.models import User
from app.apps.khoahocs.models import KhoaHoc  # add import


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
    address = models.CharField(max_length=255, blank=True, null=True, verbose_name='Địa chỉ')
    ngay_sinh = models.DateField(verbose_name='Ngày sinh', null=True, blank=True)
    khoa_hoc_quan_tam = models.ForeignKey(
        KhoaHoc,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name='Khóa học quan tâm',
        related_name='interested_students'
    )
    is_converted = models.BooleanField(default=False, verbose_name='Đã chuyển đổi từ lead')
    created_as_lead = models.BooleanField(default=False, verbose_name='Tạo như lead')

    # New optional source field (e.g., "facebook", "instagram", "google")
    sourced = models.CharField(max_length=64, blank=True, null=True, verbose_name='Nguồn')

    # Concern level choices: Mới, Quan Tâm, Nóng, Mất
    CONCERN_LEVEL_CHOICES = [
        ('moi', 'Mới'),
        ('quan_tam', 'Quan Tâm'),
        ('nong', 'Nóng'),
        ('mat', 'Mất'),
    ]
    concern_level = models.CharField(
        max_length=16,
        choices=CONCERN_LEVEL_CHOICES,
        null=True,
        blank=True,
        verbose_name='Mức độ quan tâm'
    )
    trang_thai_hoc_phi = models.CharField(
        max_length=20,
        choices=TRANG_THAI_HOC_PHI_CHOICES,
        default='chuadong',
        verbose_name='Trạng thái học phí'
    )
    nhu_cau_hoc = models.TextField(blank=True, null=True, verbose_name='Ghi chú')
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

# New model: one-to-one contact note for a lead/hocvien
class LeadContactNote(BaseModel):
    """
    Store a single contact note per HocVien (lead). One-to-one relation to HocVien.
    """
    hoc_vien = models.OneToOneField(
        HocVien,
        on_delete=models.CASCADE,
        related_name='contact_note',
        verbose_name='Học viên'
    )
    content = models.TextField(blank=True, null=True, verbose_name='Nội dung liên hệ')

    class Meta:
        verbose_name = 'Ghi chú liên hệ'
        verbose_name_plural = 'Ghi chú liên hệ'
        db_table = 'erp_lead_contact_notes'

    def __str__(self):
        return f"Note for {self.hoc_vien.ten}"
