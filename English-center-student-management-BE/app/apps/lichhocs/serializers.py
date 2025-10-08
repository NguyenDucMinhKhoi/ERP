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
        fields = '__all__'