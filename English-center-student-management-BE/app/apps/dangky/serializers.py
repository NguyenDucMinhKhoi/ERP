from rest_framework import serializers
from .models import DangKyKhoaHoc
from app.apps.users.serializers import UserSerializer
from app.apps.khoahocs.serializers import KhoaHocSerializer

class DangKyKhoaHocSerializer(serializers.ModelSerializer):
    """
    Serializer cơ bản cho DangKyKhoaHoc
    """
    hocvien_info = UserSerializer(source='hocvien', read_only=True)
    khoahoc_info = KhoaHocSerializer(source='khoahoc', read_only=True)
    so_buoi_da_hoc = serializers.ReadOnlyField()
    so_buoi_con_lai = serializers.ReadOnlyField()
    hoan_thanh = serializers.ReadOnlyField()

    class Meta:
        model = DangKyKhoaHoc
        fields = [
            'id', 'hocvien', 'khoahoc', 'ngay_dang_ky', 'phan_tram_hoan_thanh',
            'trang_thai', 'ghi_chu', 'hocvien_info', 'khoahoc_info',
            'so_buoi_da_hoc', 'so_buoi_con_lai', 'hoan_thanh',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'ngay_dang_ky', 'created_at', 'updated_at']


class DangKyKhoaHocCreateSerializer(serializers.ModelSerializer):
    """
    Serializer để tạo DangKyKhoaHoc mới
    """
    class Meta:
        model = DangKyKhoaHoc
        fields = ['hocvien', 'khoahoc', 'ghi_chu']

    def validate(self, attrs):
        hocvien = attrs.get('hocvien')
        khoahoc = attrs.get('khoahoc')
        
        # Kiểm tra xem học viên đã đăng ký khóa học này chưa
        if DangKyKhoaHoc.objects.filter(hocvien=hocvien, khoahoc=khoahoc).exists():
            raise serializers.ValidationError("Học viên đã đăng ký khóa học này rồi.")
        
        return attrs


class DangKyKhoaHocUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer để cập nhật DangKyKhoaHoc
    """
    class Meta:
        model = DangKyKhoaHoc
        fields = ['phan_tram_hoan_thanh', 'trang_thai', 'ghi_chu']


class DangKyKhoaHocDetailSerializer(serializers.ModelSerializer):
    """
    Serializer chi tiết cho DangKyKhoaHoc
    """
    hocvien_info = UserSerializer(source='hocvien', read_only=True)
    khoahoc_info = KhoaHocSerializer(source='khoahoc', read_only=True)
    so_buoi_da_hoc = serializers.ReadOnlyField()
    so_buoi_con_lai = serializers.ReadOnlyField()
    hoan_thanh = serializers.ReadOnlyField()

    class Meta:
        model = DangKyKhoaHoc
        fields = [
            'id', 'hocvien', 'khoahoc', 'ngay_dang_ky', 'phan_tram_hoan_thanh',
            'trang_thai', 'ghi_chu', 'hocvien_info', 'khoahoc_info',
            'so_buoi_da_hoc', 'so_buoi_con_lai', 'hoan_thanh',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'ngay_dang_ky', 'created_at', 'updated_at']
