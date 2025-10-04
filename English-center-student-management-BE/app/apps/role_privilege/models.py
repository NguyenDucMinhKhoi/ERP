import uuid
from django.db import models
from django.utils.translation import gettext_lazy as _
from app.apps.role.models import Role
from app.apps.privilege.models import Privilege

class RolePrivilege(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    role = models.ForeignKey(Role, on_delete=models.CASCADE, verbose_name=_('Vai trò'))
    privilege = models.ForeignKey(Privilege, on_delete=models.CASCADE, verbose_name=_('Đặc quyền'))
    module = models.CharField(max_length=100, verbose_name=_('Module'), help_text=_('user_mgmt, crm, course_mgmt, finance, reports, ...'))
    raci_role = models.CharField(max_length=2, blank=True, null=True, verbose_name=_('RACI'), help_text=_('A, R, C, I'))

    class Meta:
        verbose_name = _('Quyền vai trò')
        verbose_name_plural = _('Quyền vai trò')
        db_table = 'erp_role_privileges'
        unique_together = ('role', 'privilege', 'module')

    def __str__(self):
        return f"{self.role} - {self.privilege} - {self.module}"
