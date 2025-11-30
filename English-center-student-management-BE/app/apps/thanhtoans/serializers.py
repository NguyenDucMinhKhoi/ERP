from rest_framework import serializers
from .models import ThanhToan
from app.apps.hocviens.models import HocVien
from app.apps.hocviens.serializers import HocVienSerializer


class ThanhToanSerializer(serializers.ModelSerializer):
    """
    Serializer cơ bản cho ThanhToan
    """
    hocvien = serializers.PrimaryKeyRelatedField(queryset=HocVien.objects.all())

    class Meta:
        model = ThanhToan
        fields = [
            'id', 'hocvien', 'so_tien', 'ngay_dong',
            'hinh_thuc', 'so_bien_lai', 'trang_thai',
            'ghi_chu', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'ngay_dong', 'created_at', 'updated_at']

    def create(self, validated_data):
        # If payment method and receipt provided and trang_thai not provided, mark as paid
        hinh_thuc = validated_data.get('hinh_thuc')
        so_bien_lai = validated_data.get('so_bien_lai')
        if not validated_data.get('trang_thai') and hinh_thuc and so_bien_lai:
            validated_data['trang_thai'] = 'paid'
        return super().create(validated_data)

    def update(self, instance, validated_data):
        # If updating to include method+receipt and not yet marked paid, set trang_thai='paid'
        hinh_thuc = validated_data.get('hinh_thuc', instance.hinh_thuc)
        so_bien_lai = validated_data.get('so_bien_lai', instance.so_bien_lai)
        if not validated_data.get('trang_thai') and hinh_thuc and so_bien_lai:
            validated_data['trang_thai'] = 'paid'
        return super().update(instance, validated_data)


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
