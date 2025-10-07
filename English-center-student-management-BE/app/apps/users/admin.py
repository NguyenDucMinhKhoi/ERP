from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """
    Custom admin cho User model
    """

    # Các field hiển thị trong danh sách
    list_display = ("username", "email", "role", "staff_status", "is_active", "date_joined")
    list_filter = ("role", "is_superuser", "is_active", "groups")
    search_fields = ("username", "email", "first_name", "last_name")

    def staff_status(self, obj):
        """Hiển thị trạng thái staff dựa trên role"""
        return obj.is_staff_member
    staff_status.boolean = True
    staff_status.short_description = "Staff"

    ordering = ("username",)

    # Form chỉnh sửa User
    fieldsets = (
        (None, {"fields": ("username", "password")}),
        ("Thông tin cá nhân", {"fields": ("first_name", "last_name", "email")}),
        ("Vai trò & Quyền", {"fields": ("role", "is_active", "is_superuser", "groups", "user_permissions")}),
        ("Thông tin khác", {"fields": ("last_login", "date_joined")}),
    )

    # Form khi tạo User mới trong admin
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("username", "email", "password1", "password2", "role", "is_active"),
        }),
    )
