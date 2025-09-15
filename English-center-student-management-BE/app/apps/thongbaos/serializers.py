from rest_framework import serializers
from .models import ThongBao
from app.apps.users.serializers import UserSerializer


class ThongBaoSerializer(serializers.ModelSerializer):
    """
    Serializer cơ bản cho ThongBao
    """
    user_info = UserSerializer(source='user', read_only=True)
    nguoi_nhan_display = serializers.CharField(source='get_nguoi_nhan_display_name', read_only=True)
    is_public = serializers.ReadOnlyField()

    class Meta:
        model = ThongBao
        fields = [
            'id', 'tieu_de', 'noi_dung', 'ngay_gui', 'nguoi_nhan',
            'user', 'trang_thai', 'loai_thong_bao', 'user_info',
            'nguoi_nhan_display', 'is_public', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'ngay_gui', 'created_at', 'updated_at']


class ThongBaoCreateSerializer(serializers.ModelSerializer):
    """
    Serializer để tạo ThongBao mới
    """
    class Meta:
        model = ThongBao
        fields = ['tieu_de', 'noi_dung', 'nguoi_nhan', 'user', 'loai_thong_bao']

    def validate(self, attrs):
        nguoi_nhan = attrs.get('nguoi_nhan')
        user = attrs.get('user')
        
        if nguoi_nhan == 'user' and not user:
            raise serializers.ValidationError("Phải chọn người dùng cụ thể khi gửi cho người dùng cụ thể.")
        
        if nguoi_nhan != 'user' and user:
            raise serializers.ValidationError("Không cần chọn người dùng cụ thể khi gửi cho nhóm người dùng.")
        
        return attrs


class ThongBaoUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer để cập nhật ThongBao
    """
    class Meta:
        model = ThongBao
        fields = ['tieu_de', 'noi_dung', 'nguoi_nhan', 'user', 'trang_thai', 'loai_thong_bao']


class ThongBaoDetailSerializer(serializers.ModelSerializer):
    """
    Serializer chi tiết cho ThongBao
    """
    user_info = UserSerializer(source='user', read_only=True)
    nguoi_nhan_display = serializers.CharField(source='get_nguoi_nhan_display_name', read_only=True)
    is_public = serializers.ReadOnlyField()

    class Meta:
        model = ThongBao
        fields = [
            'id', 'tieu_de', 'noi_dung', 'ngay_gui', 'nguoi_nhan',
            'user', 'trang_thai', 'loai_thong_bao', 'user_info',
            'nguoi_nhan_display', 'is_public', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'ngay_gui', 'created_at', 'updated_at']
