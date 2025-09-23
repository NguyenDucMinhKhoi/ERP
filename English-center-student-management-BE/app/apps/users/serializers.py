from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from .models import User


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer cho User model
    """
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'date_joined']
        read_only_fields = ['id', 'date_joined']


class UserCreateSerializer(serializers.ModelSerializer):
    """
    Serializer để tạo User mới
    """
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm', 'first_name', 'last_name', 'role']

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Mật khẩu xác nhận không khớp.")
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        return user


class UserUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer để cập nhật User
    """
    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name', 'role']
        read_only_fields = ['username']


class LoginSerializer(serializers.Serializer):
    """
    Serializer cho đăng nhập bằng email
    """
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, attrs):
        email = (attrs.get('email') or '').strip()
        password = attrs.get('password')

        if email and password:
            # Tìm user theo email (không phân biệt hoa thường)
            try:
                user_obj = User.objects.get(email__iexact=email)
            except User.DoesNotExist:
                raise serializers.ValidationError('Thông tin đăng nhập không chính xác.')
            except User.MultipleObjectsReturned:
                raise serializers.ValidationError('Email này thuộc về nhiều tài khoản. Vui lòng liên hệ quản trị.')

            user = authenticate(username=user_obj.username, password=password)
            if not user:
                raise serializers.ValidationError('Thông tin đăng nhập không chính xác.')
            if not user.is_active:
                raise serializers.ValidationError('Tài khoản này đã bị khóa.')
            attrs['user'] = user
        else:
            raise serializers.ValidationError('Vui lòng nhập đầy đủ thông tin đăng nhập.')

        return attrs


class ChangePasswordSerializer(serializers.Serializer):
    """
    Serializer để thay đổi mật khẩu
    """
    old_password = serializers.CharField()
    new_password = serializers.CharField(validators=[validate_password])
    new_password_confirm = serializers.CharField()

    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError("Mật khẩu mới xác nhận không khớp.")
        return attrs

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Mật khẩu cũ không chính xác.")
        return value
