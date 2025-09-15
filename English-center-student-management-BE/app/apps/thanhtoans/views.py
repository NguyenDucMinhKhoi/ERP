from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.db import models

from app.core.permissions import IsStaffUser, IsOwnerOrStaff
from .models import ThanhToan
from .serializers import (
    ThanhToanSerializer, ThanhToanCreateSerializer,
    ThanhToanUpdateSerializer, ThanhToanDetailSerializer
)


class ThanhToanListView(generics.ListCreateAPIView):
    """
    Danh sách và tạo thanh toán (Nhân viên/Admin)
    """
    queryset = ThanhToan.objects.all()
    serializer_class = ThanhToanSerializer
    permission_classes = [IsStaffUser]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['hinh_thuc', 'hocvien', 'ngay_dong']
    search_fields = ['hocvien__ten', 'so_bien_lai']
    ordering_fields = ['ngay_dong', 'so_tien', 'created_at']

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ThanhToanCreateSerializer
        return ThanhToanSerializer


class ThanhToanDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Chi tiết, cập nhật và xóa thanh toán (Nhân viên/Admin)
    """
    queryset = ThanhToan.objects.all()
    serializer_class = ThanhToanDetailSerializer
    permission_classes = [IsOwnerOrStaff]

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return ThanhToanUpdateSerializer
        return ThanhToanDetailSerializer


class ThanhToanMyListView(generics.ListAPIView):
    """
    Học viên xem danh sách thanh toán của mình
    """
    serializer_class = ThanhToanDetailSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == 'hocvien':
            try:
                from app.apps.hocviens.models import HocVien
                hocvien = HocVien.objects.get(user=self.request.user)
                return ThanhToan.objects.filter(hocvien=hocvien)
            except HocVien.DoesNotExist:
                return ThanhToan.objects.none()
        return ThanhToan.objects.none()


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def thanhtoan_stats(request):
    """
    Thống kê thanh toán (Nhân viên/Admin)
    """
    if request.user.role not in ['admin', 'nhanvien']:
        return Response({'error': 'Không có quyền truy cập'}, status=status.HTTP_403_FORBIDDEN)

    total_thanhtoan = ThanhToan.objects.count()
    total_tien = ThanhToan.objects.aggregate(total=models.Sum('so_tien'))['total'] or 0

    # Thống kê theo hình thức thanh toán
    tien_mat = ThanhToan.objects.filter(hinh_thuc='tienmat').aggregate(
        total=models.Sum('so_tien')
    )['total'] or 0
    chuyen_khoan = ThanhToan.objects.filter(hinh_thuc='chuyenkhoan').aggregate(
        total=models.Sum('so_tien')
    )['total'] or 0
    the = ThanhToan.objects.filter(hinh_thuc='the').aggregate(
        total=models.Sum('so_tien')
    )['total'] or 0

    # Thống kê theo tháng
    from datetime import datetime, timedelta
    now = datetime.now()
    thang_nay = ThanhToan.objects.filter(
        ngay_dong__year=now.year,
        ngay_dong__month=now.month
    ).aggregate(total=models.Sum('so_tien'))['total'] or 0

    return Response({
        'total_thanhtoan': total_thanhtoan,
        'total_tien': total_tien,
        'tien_mat': tien_mat,
        'chuyen_khoan': chuyen_khoan,
        'the': the,
        'thang_nay': thang_nay
    })
