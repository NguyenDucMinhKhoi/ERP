import uuid
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _


class User(AbstractUser):
    """
    Custom User model với role-based access control
    """
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('giangvien', 'Giảng viên'),
        ('academic_staff', 'Nhân viên Học vụ'),
        ('sales_staff', 'Nhân viên Tư vấn'),
        ('finance_staff', 'Nhân viên Tài chính'),
        ('student', 'Học viên'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        verbose_name=_('Vai trò')
    )

    username = models.CharField(
        _('Tên đăng nhập'),
        max_length=150,
        unique=True,
        help_text=_('Bắt buộc. 150 ký tự trở xuống. Chỉ chứa chữ cái, số và @/./+/-/_'),
        error_messages={
            'unique': _('Tên đăng nhập này đã tồn tại.'),
        },
    )

    class Meta:
        verbose_name = _('Người dùng')
        verbose_name_plural = _('Người dùng')
        ordering = ['-date_joined']
        db_table = 'erp_users'

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"

    # Properties để kiểm tra role
    @property
    def is_admin(self):
        """Kiểm tra có phải Admin không"""
        return self.role == 'admin'

    @property
    def is_giangvien(self):
        """Kiểm tra có phải Giảng viên không"""
        return self.role == 'giangvien'

    @property
    def is_nhanvien(self):
        """Kiểm tra có phải Nhân viên (bất kỳ loại) không"""
        return self.role in ['academic_staff', 'sales_staff', 'finance_staff']

    @property
    def is_academic_staff(self):
        """Kiểm tra có phải Nhân viên Học vụ không"""
        return self.role == 'academic_staff'

    @property
    def is_sales_staff(self):
        """Kiểm tra có phải Nhân viên Tư vấn không"""
        return self.role == 'sales_staff'

    @property
    def is_finance_staff(self):
        """Kiểm tra có phải Nhân viên Tài chính không"""
        return self.role == 'finance_staff'

    @property
    def is_staff_member(self):
        """Kiểm tra có phải staff (Admin + Giảng viên + Nhân viên) không"""
        return self.role in ['admin', 'giangvien', 'academic_staff', 'sales_staff', 'finance_staff']

    @property 
    def role_group(self):
        """Trả về nhóm role chính"""
        if self.role == 'admin':
            return 'admin'
        elif self.role == 'giangvien':
            return 'giangvien'
        elif self.role in ['academic_staff', 'sales_staff', 'finance_staff']:
            return 'nhanvien'
        return None

    def save(self, *args, **kwargs):
        """Override save để tự động set is_staff và is_superuser dựa trên role"""
        # Tự động set is_staff và is_superuser dựa trên role
        if self.role == 'admin':
            self.is_staff = True
            self.is_superuser = True
        elif self.role in ['academic_staff']:
            self.is_staff = True
            self.is_superuser = False
        else:
            self.is_staff = False
            self.is_superuser = False
        
        super().save(*args, **kwargs)

    # Override is_superuser logic nếu cần
    @property
    def is_superuser_custom(self):
        """Chỉ Admin mới có quyền superuser"""
        return self.role == 'admin'
