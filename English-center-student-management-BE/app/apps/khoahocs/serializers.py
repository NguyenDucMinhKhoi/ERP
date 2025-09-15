from rest_framework import serializers
from .models import KhoaHoc


class KhoaHocSerializer(serializers.ModelSerializer):
    """
    Serializer cơ bản cho KhoaHoc
    """
    so_hoc_vien_dang_ky = serializers.ReadOnlyField()
    so_hoc_vien_hoan_thanh = serializers.ReadOnlyField()
    ty_le_hoan_thanh = serializers.ReadOnlyField()

    class Meta:
        model = KhoaHoc
        fields = [
            'id', 'ten', 'lich_hoc', 'giang_vien', 'so_buoi', 'hoc_phi',
            'mo_ta', 'trang_thai', 'so_hoc_vien_dang_ky', 'so_hoc_vien_hoan_thanh',
            'ty_le_hoan_thanh', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class KhoaHocCreateSerializer(serializers.ModelSerializer):
    """
    Serializer để tạo KhoaHoc mới
    """
    class Meta:
        model = KhoaHoc
        fields = ['ten', 'lich_hoc', 'giang_vien', 'so_buoi', 'hoc_phi', 'mo_ta', 'trang_thai']


class KhoaHocUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer để cập nhật KhoaHoc
    """
    class Meta:
        model = KhoaHoc
        fields = ['ten', 'lich_hoc', 'giang_vien', 'so_buoi', 'hoc_phi', 'mo_ta', 'trang_thai']


class KhoaHocDetailSerializer(serializers.ModelSerializer):
    """
    Serializer chi tiết cho KhoaHoc
    """
    so_hoc_vien_dang_ky = serializers.ReadOnlyField()
    so_hoc_vien_hoan_thanh = serializers.ReadOnlyField()
    ty_le_hoan_thanh = serializers.ReadOnlyField()

    class Meta:
        model = KhoaHoc
        fields = [
            'id', 'ten', 'lich_hoc', 'giang_vien', 'so_buoi', 'hoc_phi',
            'mo_ta', 'trang_thai', 'so_hoc_vien_dang_ky', 'so_hoc_vien_hoan_thanh',
            'ty_le_hoan_thanh', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
