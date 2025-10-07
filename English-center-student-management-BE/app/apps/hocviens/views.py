from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from app.core.permissions import CanManageStudents, IsOwnerOrStaff
from .models import HocVien
from .serializers import (
    HocVienSerializer, HocVienCreateSerializer,
    HocVienUpdateSerializer, HocVienDetailSerializer
)


class HocVienListView(generics.ListCreateAPIView):
    """
    Danh sách và tạo học viên (Nhân viên/Admin)
    """
    queryset = HocVien.objects.all()
    serializer_class = HocVienSerializer
    permission_classes = [CanManageStudents]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['trang_thai_hoc_phi']
    search_fields = ['ten', 'email', 'sdt']
    ordering_fields = ['ten', 'ngay_sinh', 'created_at', 'trang_thai_hoc_phi']

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return HocVienCreateSerializer
        return HocVienSerializer


class HocVienDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Chi tiết, cập nhật và xóa học viên (Nhân viên/Admin)
    """
    queryset = HocVien.objects.all()
    serializer_class = HocVienDetailSerializer
    permission_classes = [IsOwnerOrStaff]

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return HocVienUpdateSerializer
        return HocVienDetailSerializer


class HocVienMyProfileView(generics.RetrieveAPIView):
    """
    Học viên xem thông tin của mình
    """
    serializer_class = HocVienDetailSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        # Học viên chỉ có thể xem thông tin của mình
        if self.request.user.role == 'hocvien':
            try:
                return HocVien.objects.get(user=self.request.user)
            except HocVien.DoesNotExist:
                return None
        return None


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def hocvien_stats(request):
    """
    Thống kê học viên (Nhân viên/Admin)
    """
    if request.user.role not in ['admin', 'nhanvien']:
        return Response({'error': 'Không có quyền truy cập'}, status=status.HTTP_403_FORBIDDEN)

    total_hocvien = HocVien.objects.count()
    dadong_hocphi = HocVien.objects.filter(trang_thai_hoc_phi='dadong').count()
    conno_hocphi = HocVien.objects.filter(trang_thai_hoc_phi='conno').count()
    chuadong_hocphi = HocVien.objects.filter(trang_thai_hoc_phi='chuadong').count()
    co_taikhoan = HocVien.objects.filter(user__isnull=False).count()

    return Response({
        'total_hocvien': total_hocvien,
        'dadong_hocphi': dadong_hocphi,
        'conno_hocphi': conno_hocphi,
        'chuadong_hocphi': chuadong_hocphi,
        'co_taikhoan': co_taikhoan,
        'khong_co_taikhoan': total_hocvien - co_taikhoan
    })
