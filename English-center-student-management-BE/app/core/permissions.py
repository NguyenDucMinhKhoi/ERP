from rest_framework import permissions


class IsAdminUser(permissions.BasePermission):
    """
    Chỉ admin mới có quyền truy cập
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_admin


class IsGiangVienUser(permissions.BasePermission):
    """
    Chỉ giảng viên mới có quyền truy cập
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_giangvien


class IsAcademicStaffUser(permissions.BasePermission):
    """
    Chỉ nhân viên học vụ mới có quyền truy cập
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_academic_staff


class IsSalesStaffUser(permissions.BasePermission):
    """
    Chỉ nhân viên tư vấn mới có quyền truy cập
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_sales_staff


class IsFinanceStaffUser(permissions.BasePermission):
    """
    Chỉ nhân viên tài chính mới có quyền truy cập
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_finance_staff


class IsStaffUser(permissions.BasePermission):
    """
    Chỉ nhân viên (bất kỳ loại) và admin mới có quyền truy cập
    """
    def has_permission(self, request, view):
        return (request.user and request.user.is_authenticated and 
                (request.user.is_admin or request.user.is_nhanvien))


class IsStaffMember(permissions.BasePermission):
    """
    Chỉ staff (admin, giảng viên, nhân viên) mới có quyền truy cập
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_staff_member


class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Admin có thể CRUD, các role khác chỉ được đọc
    """
    def has_permission(self, request, view):
        if request.method in permissions.READONLY_METHODS:
            return request.user and request.user.is_authenticated
        return request.user and request.user.is_authenticated and request.user.is_admin


class IsAdminOrStaffReadOnly(permissions.BasePermission):
    """
    Admin có thể CRUD, Staff chỉ được đọc
    """
    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        
        if request.method in permissions.READONLY_METHODS:
            return request.user.is_staff_member
        return request.user.is_admin


class IsOwnerOrStaff(permissions.BasePermission):
    """
    Chỉ chủ sở hữu hoặc staff mới có quyền truy cập
    """
    def has_object_permission(self, request, view, obj):
        # Admin có toàn quyền
        if request.user.is_admin:
            return True
        
        # Nhân viên có quyền theo chức năng
        if request.user.is_nhanvien:
            return True
            
        # Giảng viên có quyền với lớp của mình
        if request.user.is_giangvien:
            # Kiểm tra nếu object liên quan đến giảng viên
            if hasattr(obj, 'giang_vien') and obj.giang_vien and hasattr(obj.giang_vien, 'user'):
                return obj.giang_vien.user == request.user
            return True  # Tạm thời cho phép, có thể tùy chỉnh sau
        
        # Học viên chỉ có thể truy cập dữ liệu của mình
        if hasattr(obj, 'hocvien') and obj.hocvien and hasattr(obj.hocvien, 'user'):
            return obj.hocvien.user == request.user
        elif hasattr(obj, 'user'):
            return obj.user == request.user
        
        return False


# Permissions kết hợp cho các tình huống cụ thể
class CanManageStudents(permissions.BasePermission):
    """
    Admin, Academic Staff, Sales Staff có thể quản lý học viên
    """
    def has_permission(self, request, view):
        return (request.user and request.user.is_authenticated and 
                (request.user.is_admin or request.user.is_academic_staff or request.user.is_sales_staff))


class CanManageCourses(permissions.BasePermission):
    """
    Admin, Academic Staff, Giảng viên có thể quản lý khóa học
    """
    def has_permission(self, request, view):
        return (request.user and request.user.is_authenticated and 
                (request.user.is_admin or request.user.is_academic_staff or request.user.is_giangvien))


class CanManageFinance(permissions.BasePermission):
    """
    Admin, Finance Staff có thể quản lý tài chính
    """
    def has_permission(self, request, view):
        return (request.user and request.user.is_authenticated and 
                (request.user.is_admin or request.user.is_finance_staff))


class CanManageCRM(permissions.BasePermission):
    """
    Admin, Sales Staff có thể quản lý CRM
    """
    def has_permission(self, request, view):
        return (request.user and request.user.is_authenticated and 
                (request.user.is_admin or request.user.is_sales_staff))


# === FINANCE PERMISSIONS ===

class CanManageFinance(permissions.BasePermission):
    """
    Admin và Finance Staff có thể quản lý tài chính đầy đủ
    """
    def has_permission(self, request, view):
        return (request.user and request.user.is_authenticated and 
                (request.user.is_admin or request.user.is_finance_staff))


class CanViewFinance(permissions.BasePermission):
    """
    Admin, Finance Staff, Academic Staff, Sales Staff có thể xem thống kê tài chính
    """
    def has_permission(self, request, view):
        return (request.user and request.user.is_authenticated and 
                request.user.role in ['admin', 'finance_staff', 'academic_staff', 'sales_staff'])


class CanCreatePayment(permissions.BasePermission):
    """
    Admin, Finance Staff, Academic Staff có thể tạo thanh toán
    """
    def has_permission(self, request, view):
        return (request.user and request.user.is_authenticated and 
                request.user.role in ['admin', 'finance_staff', 'academic_staff'])


class FinancePermission(permissions.BasePermission):
    """
    Custom permission cho Finance module
    - Admin: Full CRUD
    - Finance Staff: Full CRUD  
    - Academic Staff: Read + Create
    - Sales Staff: Read only
    """
    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        
        # Admin và Finance Staff có full quyền
        if request.user.role in ['admin', 'finance_staff']:
            return True
            
        # Academic Staff có thể xem và tạo
        if request.user.role == 'academic_staff':
            return request.method in ['GET', 'POST']
            
        # Sales Staff chỉ được xem
        if request.user.role == 'sales_staff':
            return request.method == 'GET'
            
        return False
