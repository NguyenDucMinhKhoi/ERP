from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from app.apps.users.models import User
from app.apps.role.models import Role
from app.apps.khoahocs.models import KhoaHoc
from app.apps.dangky.models import DangKyKhoaHoc
from app.apps.thanhtoans.models import ThanhToan
from app.apps.chamsoc.models import ChamSocHocVien
from app.apps.thongbaos.models import ThongBao


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ['username', 'email', 'first_name', 'last_name', 'role', 'is_active', 'date_joined']
    list_filter = ['role', 'is_active', 'date_joined']
    search_fields = ['username', 'email', 'first_name', 'last_name']
    ordering = ['-date_joined']
    fieldsets = UserAdmin.fieldsets + (
        ('Thông tin bổ sung', {'fields': ('role',)}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Thông tin bổ sung', {'fields': ('role',)}),
    )


@admin.register(KhoaHoc)
class KhoaHocAdmin(admin.ModelAdmin):
    list_display = ['ten', 'giang_vien', 'so_buoi', 'hoc_phi', 'trang_thai', 'so_hoc_vien_dang_ky', 'ty_le_hoan_thanh', 'created_at']
    list_filter = ['trang_thai', 'giang_vien', 'created_at']
    search_fields = ['ten', 'giang_vien']
    ordering = ['-created_at']
    readonly_fields = ['created_at', 'updated_at', 'so_hoc_vien_dang_ky', 'so_hoc_vien_hoan_thanh', 'ty_le_hoan_thanh']
    
    fieldsets = (
        ('Thông tin khóa học', {
            'fields': ('ten', 'lich_hoc', 'giang_vien', 'so_buoi', 'hoc_phi', 'mo_ta')
        }),
        ('Trạng thái', {
            'fields': ('trang_thai',)
        }),
        ('Thống kê', {
            'fields': ('so_hoc_vien_dang_ky', 'so_hoc_vien_hoan_thanh', 'ty_le_hoan_thanh'),
            'classes': ('collapse',)
        }),
        ('Thời gian', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(DangKyKhoaHoc)
class DangKyKhoaHocAdmin(admin.ModelAdmin):
    list_display = ['hocvien', 'khoahoc', 'ngay_dang_ky', 'phan_tram_hoan_thanh', 'trang_thai', 'so_buoi_da_hoc', 'so_buoi_con_lai']
    list_filter = ['trang_thai', 'phan_tram_hoan_thanh', 'ngay_dang_ky', 'khoahoc']
    search_fields = ['hocvien__ten', 'khoahoc__ten']
    ordering = ['-ngay_dang_ky']
    readonly_fields = ['ngay_dang_ky', 'created_at', 'updated_at', 'so_buoi_da_hoc', 'so_buoi_con_lai', 'hoan_thanh']
    
    fieldsets = (
        ('Thông tin đăng ký', {
            'fields': ('hocvien', 'khoahoc', 'ngay_dang_ky')
        }),
        ('Tiến độ học tập', {
            'fields': ('phan_tram_hoan_thanh', 'trang_thai', 'ghi_chu')
        }),
        ('Thống kê', {
            'fields': ('so_buoi_da_hoc', 'so_buoi_con_lai', 'hoan_thanh'),
            'classes': ('collapse',)
        }),
        ('Thời gian', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(ThanhToan)
class ThanhToanAdmin(admin.ModelAdmin):
    list_display = ['hocvien', 'so_tien', 'ngay_dong', 'hinh_thuc', 'so_bien_lai', 'created_at']
    list_filter = ['hinh_thuc', 'ngay_dong', 'created_at']
    search_fields = ['hocvien__ten', 'so_bien_lai']
    ordering = ['-ngay_dong']
    readonly_fields = ['ngay_dong', 'created_at', 'updated_at']
    
    fieldsets = (
        ('Thông tin thanh toán', {
            'fields': ('hocvien', 'so_tien', 'hinh_thuc', 'so_bien_lai')
        }),
        ('Chi tiết', {
            'fields': ('ngay_dong', 'ghi_chu')
        }),
        ('Thời gian', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(ChamSocHocVien)
class ChamSocHocVienAdmin(admin.ModelAdmin):
    list_display = ['hocvien', 'nhanvien_ten', 'loai_cham_soc', 'trang_thai', 'ngay', 'created_at']
    list_filter = ['loai_cham_soc', 'trang_thai', 'ngay', 'created_at']
    search_fields = ['hocvien__ten', 'noi_dung']
    ordering = ['-ngay']
    readonly_fields = ['ngay', 'created_at', 'updated_at', 'nhanvien_ten']
    
    fieldsets = (
        ('Thông tin chăm sóc', {
            'fields': ('hocvien', 'nhanvien', 'loai_cham_soc')
        }),
        ('Nội dung', {
            'fields': ('noi_dung', 'trang_thai', 'attachments', 'ghi_chu')
        }),
        ('Thời gian', {
            'fields': ('ngay', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(ThongBao)
class ThongBaoAdmin(admin.ModelAdmin):
    list_display = ['tieu_de', 'nguoi_nhan', 'loai_thong_bao', 'trang_thai', 'ngay_gui', 'created_at']
    list_filter = ['nguoi_nhan', 'loai_thong_bao', 'trang_thai', 'ngay_gui', 'created_at']
    search_fields = ['tieu_de', 'noi_dung']
    ordering = ['-ngay_gui']
    readonly_fields = ['ngay_gui', 'created_at', 'updated_at']
    
    fieldsets = (
        ('Thông tin thông báo', {
            'fields': ('tieu_de', 'noi_dung', 'loai_thong_bao')
        }),
        ('Người nhận', {
            'fields': ('nguoi_nhan', 'user')
        }),
        ('Trạng thái', {
            'fields': ('trang_thai',)
        }),
        ('Thời gian', {
            'fields': ('ngay_gui', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


# Cấu hình admin site
admin.site.site_header = 'CRM Trung Tâm Tiếng Anh'
admin.site.site_title = 'CRM Admin'
admin.site.index_title = 'Quản lý hệ thống'
