from app.apps.users.models import User
from app.apps.role_privilege.models import RolePrivilege
from app.apps.privilege.models import Privilege
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from django.contrib.auth import get_user_model

def user_has_privilege(user: User, privilege_name: str) -> bool:
    """
    Check if the user (via their role) has the given privilege.
    """
    if not user or not user.role:
        return False
    return RolePrivilege.objects.filter(
        role=user.role,
        privilege__privilege_name=privilege_name
    ).exists()

def user_has_privilege_from_token(token: str, privilege_name: str) -> bool:
    """
    Check if the user (via their role) has the given privilege, using JWT token.
    Raises TokenError with a user-facing error message if the token is invalid.
    """
    try:
        validated_token = UntypedToken(token)
        user_id = validated_token.get('user_id')
        User = get_user_model()
        user = User.objects.filter(id=user_id).first()
        if not user or not user.role:
            return False
        return RolePrivilege.objects.filter(
            role=user.role,
            privilege__privilege_name=privilege_name
        ).exists()
    except (InvalidToken, TokenError):
        raise TokenError("Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.")
    except Exception:
        raise TokenError("Có lỗi xác thực token. Vui lòng thử lại.")
