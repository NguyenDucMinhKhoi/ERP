from rest_framework import permissions


class IsAdminUser(permissions.BasePermission):
    """
    Chỉ admin mới có quyền truy cập
    """
    def has_permission(self, request, view):
        return request.user and request.user.role == 'admin'


class IsStaffUser(permissions.BasePermission):
    """
    Chỉ nhân viên và admin mới có quyền truy cập
    """
    def has_permission(self, request, view):
        return request.user and request.user.role in ['admin', 'nhanvien']


class IsStudentUser(permissions.BasePermission):
    """
    Chỉ học viên mới có quyền truy cập
    """
    def has_permission(self, request, view):
        return request.user and request.user.role == 'hocvien'


class IsOwnerOrStaff(permissions.BasePermission):
    """
    Chỉ chủ sở hữu hoặc nhân viên/admin mới có quyền truy cập
    """
    def has_object_permission(self, request, view, obj):
        # Admin và nhân viên có toàn quyền
        if request.user.role in ['admin', 'nhanvien']:
            return True
        
        # Học viên chỉ có thể truy cập dữ liệu của mình
        if hasattr(obj, 'hocvien'):
            return obj.hocvien.user == request.user
        elif hasattr(obj, 'user'):
            return obj.user == request.user
        
        return False
