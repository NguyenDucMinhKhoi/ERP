from rest_framework import serializers
from .models import ThanhToan
from app.apps.hocviens.serializers import HocVienSerializer


class ThanhToanSerializer(serializers.ModelSerializer):
    """
    Serializer cơ bản cho ThanhToan
    """
    hocvien_info = HocVienSerializer(source='hocvien', read_only=True)

    class Meta:
        model = ThanhToan
        fields = [
            'id', 'hocvien', 'so_tien', 'ngay_dong', 'hinh_thuc',
            'so_bien_lai', 'ghi_chu', 'hocvien_info', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'ngay_dong', 'created_at', 'updated_at']


class ThanhToanCreateSerializer(serializers.ModelSerializer):
    """
    Serializer để tạo ThanhToan mới
    """
    class Meta:
        model = ThanhToan
        fields = ['hocvien', 'so_tien', 'hinh_thuc', 'so_bien_lai', 'ghi_chu']

    def validate_so_bien_lai(self, value):
        """
        Kiểm tra số biên lai không được trùng
        """
        if ThanhToan.objects.filter(so_bien_lai=value).exists():
            raise serializers.ValidationError("Số biên lai này đã tồn tại.")
        return value


class ThanhToanUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer để cập nhật ThanhToan
    """
    class Meta:
        model = ThanhToan
        fields = ['so_tien', 'hinh_thuc', 'ghi_chu']


class ThanhToanDetailSerializer(serializers.ModelSerializer):
    """
    Serializer chi tiết cho ThanhToan
    """
    hocvien_info = HocVienSerializer(source='hocvien', read_only=True)

    class Meta:
        model = ThanhToan
        fields = [
            'id', 'hocvien', 'so_tien', 'ngay_dong', 'hinh_thuc',
            'so_bien_lai', 'ghi_chu', 'hocvien_info', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'ngay_dong', 'created_at', 'updated_at']
