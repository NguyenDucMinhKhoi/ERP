from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import update_session_auth_hash
from django.contrib.auth.forms import PasswordChangeForm

from app.core.permissions import IsAdminUser, IsOwnerOrStaff
from .models import User
from .serializers import (
    UserSerializer, UserCreateSerializer, UserUpdateSerializer,
    LoginSerializer, ChangePasswordSerializer
)
from app.apps.users.permissions import HasPrivilege
from app.apps.users.constants import PRIVILEGE_READ, PRIVILEGE_UPDATE, PRIVILEGE_DELETE

from django.http import JsonResponse, HttpResponseForbidden


class RegisterView(generics.CreateAPIView):
    """
    Đăng ký tài khoản mới
    """
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = UserCreateSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Tạo JWT tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'message': 'Đăng ký thành công!',
            'user': UserSerializer(user).data,
            'tokens': {
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            }
        }, status=status.HTTP_201_CREATED)


class LoginView(TokenObtainPairView):
    """
    Đăng nhập và nhận JWT tokens
    """
    permission_classes = [AllowAny]
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        
        # Tạo JWT tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'message': 'Đăng nhập thành công!',
            'user': UserSerializer(user).data,
            'tokens': {
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            }
        }, status=status.HTTP_200_OK)


class LogoutView(generics.GenericAPIView):
    """
    Đăng xuất
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
                return Response({'message': 'Đăng xuất thành công!'}, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Refresh token không được cung cấp'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': 'Token không hợp lệ'}, status=status.HTTP_400_BAD_REQUEST)


class UserListView(generics.ListCreateAPIView):
    """
    Danh sách và tạo User (Admin only)
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [HasPrivilege.with_privilege(PRIVILEGE_READ)]
    filterset_fields = ['role', 'is_active']
    search_fields = ['username', 'email', 'first_name', 'last_name']
    ordering_fields = ['username', 'date_joined', 'role']


class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Chi tiết, cập nhật và xóa User (Admin only)
    """
    queryset = User.objects.all()
    serializer_class = UserUpdateSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            return [HasPrivilege.with_privilege(PRIVILEGE_READ)()]
        elif self.request.method in ['PUT', 'PATCH']:
            return [HasPrivilege.with_privilege(PRIVILEGE_UPDATE)()]
        elif self.request.method == 'DELETE':
            return [HasPrivilege.with_privilege(PRIVILEGE_DELETE)()]
        return super().get_permissions()


class UserProfileView(generics.RetrieveUpdateAPIView):
    """
    Thông tin profile của user hiện tại
    """
    serializer_class = UserSerializer
    permission_classes = [HasPrivilege.with_privilege(PRIVILEGE_READ)]

    def get_object(self):
        return self.request.user


class ChangePasswordView(generics.GenericAPIView):
    """
    Thay đổi mật khẩu
    """
    permission_classes = [HasPrivilege.with_privilege(PRIVILEGE_UPDATE)]
    serializer_class = ChangePasswordSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = request.user
        user.set_password(serializer.validated_data['new_password'])
        user.save()
        
        # Cập nhật session để tránh logout
        update_session_auth_hash(request, user)
        
        return Response({'message': 'Mật khẩu đã được thay đổi thành công!'}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([HasPrivilege.with_privilege(PRIVILEGE_READ)])
def me(request):
    """
    Lấy thông tin user hiện tại
    """
    return Response(UserSerializer(request.user).data)
