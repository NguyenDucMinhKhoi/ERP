from rest_framework import serializers
from .models import HocVien
from app.apps.users.serializers import UserSerializer
from app.apps.khoahocs.models import KhoaHoc


class KhoaHocSummarySerializer(serializers.ModelSerializer):
    """Small read-only summary for course"""

    class Meta:
        model = KhoaHoc
        fields = ['id', 'ten']


class HocVienSerializer(serializers.ModelSerializer):
    """
    Serializer cơ bản cho HocVien
    """
    tuoi = serializers.ReadOnlyField()
    co_tai_khoan = serializers.ReadOnlyField()
    user_info = UserSerializer(source='user', read_only=True)
    # writable FK by id
    khoa_hoc_quan_tam = serializers.PrimaryKeyRelatedField(
        queryset=KhoaHoc.objects.all(), allow_null=True, required=False)
    # read-only nested summary
    khoa_hoc_quan_tam_detail = KhoaHocSummarySerializer(source='khoa_hoc_quan_tam', read_only=True)

    class Meta:
        model = HocVien
        fields = [
            'id', 'ten', 'email', 'sdt', 'ngay_sinh', 'trang_thai_hoc_phi',
            'ghi_chu', 'user', 'tuoi', 'co_tai_khoan', 'user_info',
            'created_at', 'updated_at', 'address', 'nhu_cau_hoc',
            'khoa_hoc_quan_tam', 'khoa_hoc_quan_tam_detail'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class HocVienCreateSerializer(serializers.ModelSerializer):
    """
    Serializer để tạo HocVien mới
    """
    class Meta:
        model = HocVien
        fields = ['ten', 'email', 'sdt', 'ngay_sinh', 'ghi_chu', 'address', 'nhu_cau_hoc', 'khoa_hoc_quan_tam']


class HocVienUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer để cập nhật HocVien
    """
    class Meta:
        model = HocVien
        fields = ['ten', 'email', 'sdt', 'ngay_sinh', 'trang_thai_hoc_phi', 'ghi_chu', 'address', 'nhu_cau_hoc', 'khoa_hoc_quan_tam']


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
            'created_at', 'updated_at', 'address', 'nhu_cau_hoc',
            'khoa_hoc_quan_tam', 'khoa_hoc_quan_tam_detail'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
