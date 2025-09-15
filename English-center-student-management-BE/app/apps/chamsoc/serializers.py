from rest_framework import serializers
from .models import ChamSocHocVien
from app.apps.hocviens.serializers import HocVienSerializer
from app.apps.users.serializers import UserSerializer


class ChamSocHocVienSerializer(serializers.ModelSerializer):
    """
    Serializer cơ bản cho ChamSocHocVien
    """
    hocvien_info = HocVienSerializer(source='hocvien', read_only=True)
    nhanvien_info = UserSerializer(source='nhanvien', read_only=True)
    nhanvien_ten = serializers.ReadOnlyField()

    class Meta:
        model = ChamSocHocVien
        fields = [
            'id', 'hocvien', 'nhanvien', 'loai_cham_soc', 'noi_dung',
            'ngay', 'trang_thai', 'attachments', 'ghi_chu', 'hocvien_info',
            'nhanvien_info', 'nhanvien_ten', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'ngay', 'created_at', 'updated_at']


class ChamSocHocVienCreateSerializer(serializers.ModelSerializer):
    """
    Serializer để tạo ChamSocHocVien mới
    """
    class Meta:
        model = ChamSocHocVien
        fields = ['hocvien', 'nhanvien', 'loai_cham_soc', 'noi_dung', 'attachments', 'ghi_chu']


class ChamSocHocVienUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer để cập nhật ChamSocHocVien
    """
    class Meta:
        model = ChamSocHocVien
        fields = ['loai_cham_soc', 'noi_dung', 'trang_thai', 'attachments', 'ghi_chu']


class ChamSocHocVienDetailSerializer(serializers.ModelSerializer):
    """
    Serializer chi tiết cho ChamSocHocVien
    """
    hocvien_info = HocVienSerializer(source='hocvien', read_only=True)
    nhanvien_info = UserSerializer(source='nhanvien', read_only=True)
    nhanvien_ten = serializers.ReadOnlyField()

    class Meta:
        model = ChamSocHocVien
        fields = [
            'id', 'hocvien', 'nhanvien', 'loai_cham_soc', 'noi_dung',
            'ngay', 'trang_thai', 'attachments', 'ghi_chu', 'hocvien_info',
            'nhanvien_info', 'nhanvien_ten', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'ngay', 'created_at', 'updated_at']
