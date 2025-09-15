from rest_framework import serializers
from .models import HocVien
from app.apps.users.serializers import UserSerializer


class HocVienSerializer(serializers.ModelSerializer):
    """
    Serializer cơ bản cho HocVien
    """
    tuoi = serializers.ReadOnlyField()
    co_tai_khoan = serializers.ReadOnlyField()
    user_info = UserSerializer(source='user', read_only=True)

    class Meta:
        model = HocVien
        fields = [
            'id', 'ten', 'email', 'sdt', 'ngay_sinh', 'trang_thai_hoc_phi',
            'ghi_chu', 'user', 'tuoi', 'co_tai_khoan', 'user_info',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class HocVienCreateSerializer(serializers.ModelSerializer):
    """
    Serializer để tạo HocVien mới
    """
    class Meta:
        model = HocVien
        fields = ['ten', 'email', 'sdt', 'ngay_sinh', 'ghi_chu']


class HocVienUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer để cập nhật HocVien
    """
    class Meta:
        model = HocVien
        fields = ['ten', 'email', 'sdt', 'ngay_sinh', 'trang_thai_hoc_phi', 'ghi_chu']


class HocVienDetailSerializer(serializers.ModelSerializer):
    """
    Serializer chi tiết cho HocVien
    """
    tuoi = serializers.ReadOnlyField()
    co_tai_khoan = serializers.ReadOnlyField()
    user_info = UserSerializer(source='user', read_only=True)

    class Meta:
        model = HocVien
        fields = [
            'id', 'ten', 'email', 'sdt', 'ngay_sinh', 'trang_thai_hoc_phi',
            'ghi_chu', 'user', 'tuoi', 'co_tai_khoan', 'user_info',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
