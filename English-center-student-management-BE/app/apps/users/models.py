
import uuid
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.core.validators import RegexValidator



# Role model
class Role(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    role_name = models.CharField(max_length=50, unique=True, verbose_name=_('Tên vai trò'), help_text=_('student, employee, admin, other'))
    mo_ta = models.TextField(blank=True, null=True, verbose_name=_('Mô tả'))

    class Meta:
        verbose_name = _('Vai trò')
        verbose_name_plural = _('Vai trò')
        db_table = 'erp_roles'

    def __str__(self):
        return self.role_name


# Updated User model
class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    role = models.ForeignKey(
        Role,
        on_delete=models.PROTECT,
        verbose_name=_('Vai trò'),
        related_name='users',
        null=False
    )

    # Student fields merged into User
    ten = models.CharField(max_length=100, verbose_name=_('Họ và tên'))
    email = models.EmailField(unique=True, verbose_name=_('Email'))
    sdt = models.CharField(
        max_length=15,
        validators=[RegexValidator(regex=r'^(\+84|84|0)?[1-9]\d{8}$', message=_('Số điện thoại không hợp lệ'))],
        verbose_name=_('Số điện thoại')
    )
    ngay_sinh = models.DateField(verbose_name=_('Ngày sinh'), null=True, blank=True)
    trang_thai_hoc_phi = models.CharField(
        max_length=20,
        choices=[('dadong', 'Đã đóng'), ('conno', 'Còn nợ'), ('chuadong', 'Chưa đóng')],
        default=None,
        null=True,
        blank=True,
        verbose_name=_('Trạng thái học phí')
    )
    ghi_chu = models.TextField(blank=True, null=True, verbose_name=_('Ghi chú'))

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
        return f"{self.ten} ({self.username})"

    @property
    def is_admin(self):
        return self.role.role_name == 'admin'

    @property
    def is_staff_member(self):
        return self.role.role_name in ['admin', 'employee']

    @property
    def is_student(self):
        return self.role.role_name == 'student'
