from rest_framework.permissions import BasePermission
from django.http import HttpRequest
from app.apps.users.guards import user_has_privilege_from_token

class HasPrivilege(BasePermission):
    """
    Permission class to check if user has a specific privilege using JWT token.
    Usage: permission_classes = [HasPrivilege.with_privilege('read')]
    """
    privilege_name = None

    def has_permission(self, request: HttpRequest, view):
        auth_header = request.headers.get('Authorization', '')
        token = ''
        if auth_header.startswith('Bearer '):
            token = auth_header[7:]
        if not token or not self.privilege_name:
            return False
        try:
            return user_has_privilege_from_token(token, self.privilege_name)
        except Exception:
            return False

    @classmethod
    def with_privilege(cls, privilege_name):
        # Use a closure to bind privilege_name correctly
        class CustomHasPrivilege(cls):
            pass
        CustomHasPrivilege.privilege_name = privilege_name
        return CustomHasPrivilege
