import uuid
from django.db import models
from django.utils.translation import gettext_lazy as _

class Privilege(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    privilege_name = models.CharField(max_length=50, unique=True, verbose_name=_('Tên đặc quyền'), help_text=_('read, write, update, delete, execute'))
    mo_ta = models.TextField(blank=True, null=True, verbose_name=_('Mô tả'))

    class Meta:
        verbose_name = _('Đặc quyền')
        verbose_name_plural = _('Đặc quyền')
        db_table = 'erp_privileges'

    def __str__(self):
        return self.privilege_name
