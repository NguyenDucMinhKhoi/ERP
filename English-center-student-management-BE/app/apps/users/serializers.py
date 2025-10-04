from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from .models import User, Role


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer cho UserModel
    """
    role_name = serializers.CharField(source='role.role_name', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role_name']

class UserCreateSerializer(serializers.ModelSerializer):
    """
    Serializer để tạo User mới
    """
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)
    role_name = serializers.CharField(write_only=True)  # Accept role_name as input

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm', 'first_name', 'last_name', 'role_name']

    def validate(self, attrs):
        # Validate password confirmation
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password_confirm": "Mật khẩu xác nhận không khớp."})

        # Validate role_name exists
        role_name = attrs.get('role_name')
        try:
            role = Role.objects.get(role_name=role_name)
        except Role.DoesNotExist:
            raise serializers.ValidationError({"role_name": f"Vai trò '{role_name}' không tồn tại."})
        
        # Replace role_name with role UUID in validated data
        attrs['role'] = role
        attrs.pop('role_name')
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
    Serializer để đăng nhập bằng email và password
    """
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True, style={'input_type': 'password'})

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        # Tìm user theo email (case-insensitive)
        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            raise serializers.ValidationError(
                {'email': 'Email không tồn tại.'}
            )

        # Kiểm tra password
        if not user.check_password(password):
            raise serializers.ValidationError(
                {'password': 'Mật khẩu không đúng.'}
            )

        # Kiểm tra user active
        if not user.is_active:
            raise serializers.ValidationError(
                {'email': 'Tài khoản này đã bị vô hiệu hóa.'}
            )

        attrs['user'] = user
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
