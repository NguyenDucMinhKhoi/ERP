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
        ('nhanvien', 'Nhân viên'),
        ('hocvien', 'Học viên'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default='hocvien',
        verbose_name=_('Vai trò')
    )

    # username đã có sẵn từ AbstractUser, nhưng bạn override lại cho unique & custom help_text
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

    @property
    def is_admin(self):
        return self.role == 'admin'

    @property
    def is_staff_member(self):
        return self.role in ['admin', 'nhanvien']

    @property
    def is_student(self):
        return self.role == 'hocvien'
