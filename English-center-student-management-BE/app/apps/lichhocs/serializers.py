# app/apps/lichhocs/serializers.py
from rest_framework import serializers
from .models import LichHoc
from app.apps.lophocs.models import LopHoc


class LichHocSerializer(serializers.ModelSerializer):
    """
    Serializer for LichHoc model.
    """
    lop_hoc = serializers.PrimaryKeyRelatedField(queryset=LopHoc.objects.all())

    class Meta:
        model = LichHoc
        fields = [
            'id', 'lop_hoc', 'ngay_hoc', 'gio_bat_dau', 'gio_ket_thuc',
            'phong_hoc', 'noi_dung', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']