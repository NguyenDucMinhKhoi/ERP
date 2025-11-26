# app/apps/diemdanhs/serializers.py
from rest_framework import serializers
from .models import DiemDanh
from app.apps.lichhocs.models import LichHoc
from app.apps.hocviens.models import HocVien


class DiemDanhSerializer(serializers.ModelSerializer):
    """
    Serializer for DiemDanh model.
    """
    lich_hoc = serializers.PrimaryKeyRelatedField(queryset=LichHoc.objects.all())
    hoc_vien = serializers.PrimaryKeyRelatedField(queryset=HocVien.objects.all())

    class Meta:
        model = DiemDanh
        fields = [
            'id', 'lich_hoc', 'hoc_vien', 'trang_thai', 'ghi_chu',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate(self, data):
        """
        Ensure hoc_vien can only mark their own attendance if not staff.
        """
        request = self.context['request']
        if not (request.user.is_admin or request.user.is_nhanvien or request.user.is_giangvien):
            if data['hoc_vien'].user != request.user:
                raise serializers.ValidationError("Học viên chỉ có thể điểm danh cho chính mình.")
        return data