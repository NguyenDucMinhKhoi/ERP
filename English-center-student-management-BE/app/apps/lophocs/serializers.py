# app/apps/lophocs/serializers.py
from rest_framework import serializers
from .models import LopHoc
from app.apps.khoahocs.models import KhoaHoc


class LopHocSerializer(serializers.ModelSerializer):
    """
    Serializer for LopHoc model.
    """
    khoa_hoc = serializers.PrimaryKeyRelatedField(queryset=KhoaHoc.objects.all())

    class Meta:
        model = LopHoc
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'so_hoc_vien']