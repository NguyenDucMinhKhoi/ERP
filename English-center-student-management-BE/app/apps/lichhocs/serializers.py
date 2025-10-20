# app/apps/lichhocs/serializers.py
from datetime import datetime
from rest_framework import serializers
from .models import LichHoc
from app.apps.lophocs.models import LopHoc


class LichHocSerializer(serializers.ModelSerializer):
    """
    Serializer for LichHoc model.
    """
    lophocid = serializers.UUIDField(write_only=True, required=True)

    class Meta:
        model = LichHoc
        fields = [
            'id', 'lophocid', 'ngay_hoc', 'gio_bat_dau', 'gio_ket_thuc',
            'phong_hoc', 'noi_dung', 'note', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_lophocid(self, value):
        """
        Validate that lophocid corresponds to an existing LopHoc.
        """
        try:
            LopHoc.objects.get(pk=value)
        except LopHoc.DoesNotExist:
            raise serializers.ValidationError("Lớp học không tồn tại.")
        return value

    def validate_ngay_hoc(self, value):
        """
        Convert date string (e.g., '0002-02-02') to day name (e.g., 'saturday').
        """
        try:
            date_obj = datetime.strptime(value, '%Y-%m-%d')
            day_name = date_obj.strftime('%A').lower()
            return day_name
        except ValueError:
            raise serializers.ValidationError("Định dạng ngày học không hợp lệ. Vui lòng sử dụng YYYY-MM-DD.")

    def validate(self, data):
        """
        Ensure unique_together constraint (lop_hoc, ngay_hoc, gio_bat_dau).
        Also accept legacy 'ghi_chu' from input (map to 'note').
        """
        # map legacy ghi_chu from initial_data into validated data if present
        if 'note' not in data and isinstance(self.initial_data, dict) and 'ghi_chu' in self.initial_data:
            data['note'] = self.initial_data.get('ghi_chu')

        lophocid = data.get('lophocid')
        ngay_hoc = data.get('ngay_hoc')
        gio_bat_dau = data.get('gio_bat_dau')

        if LichHoc.objects.filter(
            lop_hoc__id=lophocid,
            ngay_hoc=ngay_hoc,
            gio_bat_dau=gio_bat_dau
        ).exists():
            raise serializers.ValidationError("Lịch học với lớp học, ngày học và giờ bắt đầu này đã tồn tại.")
        return data

    def create(self, validated_data):
        """
        Create a new LichHoc instance, mapping lophocid to lop_hoc.
        """
        lophocid = validated_data.pop('lophocid')
        lop_hoc = LopHoc.objects.get(pk=lophocid)
        lich_hoc = LichHoc.objects.create(lop_hoc=lop_hoc, **validated_data)
        return lich_hoc