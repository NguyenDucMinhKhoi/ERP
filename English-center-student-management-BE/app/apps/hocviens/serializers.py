from rest_framework import serializers
from .models import HocVien, LeadContactNote
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
    # expose lead flag
    is_converted = serializers.BooleanField(read_only=False, required=False)
    created_as_lead = serializers.BooleanField(read_only=False, required=False)
    # new fields
    sourced = serializers.CharField(allow_null=True, allow_blank=True, required=False)
    concern_level = serializers.ChoiceField(choices=HocVien.CONCERN_LEVEL_CHOICES, allow_null=True, required=False)

    class Meta:
        model = HocVien
        fields = [
            'id', 'ten', 'email', 'sdt', 'ngay_sinh', 'trang_thai_hoc_phi',
            'ghi_chu', 'user', 'tuoi', 'co_tai_khoan', 'user_info',
            'created_at', 'updated_at', 'address', 'nhu_cau_hoc',
            'khoa_hoc_quan_tam', 'khoa_hoc_quan_tam_detail',
            'is_converted', 'created_as_lead',
            'sourced', 'concern_level'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class HocVienCreateSerializer(serializers.ModelSerializer):
    """
    Serializer để tạo HocVien mới
    """
    # Direct creates via this serializer represent immediate students by default
    is_converted = serializers.BooleanField(required=False, default=True)
    created_as_lead = serializers.BooleanField(required=False, default=False)
    sourced = serializers.CharField(allow_null=True, allow_blank=True, required=False)
    concern_level = serializers.ChoiceField(choices=HocVien.CONCERN_LEVEL_CHOICES, allow_null=True, required=False)

    class Meta:
        model = HocVien
        fields = ['ten', 'email', 'sdt', 'ngay_sinh', 'ghi_chu', 'address', 'nhu_cau_hoc', 'khoa_hoc_quan_tam', 'is_converted', 'created_as_lead', 'sourced', 'concern_level']
        extra_kwargs = {'is_converted': {'required': False}, 'created_as_lead': {'required': False}}


class HocVienUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer để cập nhật HocVien
    """
    sourced = serializers.CharField(allow_null=True, allow_blank=True, required=False)
    concern_level = serializers.ChoiceField(choices=HocVien.CONCERN_LEVEL_CHOICES, allow_null=True, required=False)

    class Meta:
        model = HocVien
        fields = ['ten', 'email', 'sdt', 'ngay_sinh', 'trang_thai_hoc_phi', 'ghi_chu', 'address', 'nhu_cau_hoc', 'khoa_hoc_quan_tam', 'is_converted', 'created_as_lead', 'sourced', 'concern_level']


class HocVienDetailSerializer(serializers.ModelSerializer):
    """
    Serializer chi tiết cho HocVien
    """
    tuoi = serializers.ReadOnlyField()
    co_tai_khoan = serializers.ReadOnlyField()
    user_info = UserSerializer(source='user', read_only=True)
    # include nested course object for detail view
    khoa_hoc_quan_tam_detail = KhoaHocSummarySerializer(source='khoa_hoc_quan_tam', read_only=True)
    sourced = serializers.CharField(allow_null=True, allow_blank=True, required=False)
    concern_level = serializers.ChoiceField(choices=HocVien.CONCERN_LEVEL_CHOICES, allow_null=True, required=False)

    class Meta:
        model = HocVien
        fields = [
            'id', 'ten', 'email', 'sdt', 'ngay_sinh', 'trang_thai_hoc_phi',
            'ghi_chu', 'user', 'tuoi', 'co_tai_khoan', 'user_info',
            'created_at', 'updated_at', 'address', 'nhu_cau_hoc',
            'khoa_hoc_quan_tam', 'khoa_hoc_quan_tam_detail', 'sourced', 'concern_level'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class LeadContactNoteSerializer(serializers.ModelSerializer):
    """
    Serializer for LeadContactNote
    """
    hoc_vien = serializers.PrimaryKeyRelatedField(queryset=HocVien.objects.all())

    class Meta:
        model = LeadContactNote
        fields = ['id', 'hoc_vien', 'content', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
