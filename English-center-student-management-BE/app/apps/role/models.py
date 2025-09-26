import uuid
from django.db import models
from django.utils.translation import gettext_lazy as _

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
