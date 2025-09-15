from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.db import models

from app.core.permissions import IsStaffUser, IsOwnerOrStaff
from .models import DangKyKhoaHoc
from .serializers import (
    DangKyKhoaHocSerializer, DangKyKhoaHocCreateSerializer,
    DangKyKhoaHocUpdateSerializer, DangKyKhoaHocDetailSerializer
)


class DangKyKhoaHocListView(generics.ListCreateAPIView):
    """
    Danh sách và tạo đăng ký khóa học (Nhân viên/Admin)
    """
    queryset = DangKyKhoaHoc.objects.all()
    serializer_class = DangKyKhoaHocSerializer
    permission_classes = [IsStaffUser]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['trang_thai', 'phan_tram_hoan_thanh', 'hocvien', 'khoahoc']
    search_fields = ['hocvien__ten', 'khoahoc__ten']
    ordering_fields = ['ngay_dang_ky', 'phan_tram_hoan_thanh', 'created_at']

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return DangKyKhoaHocCreateSerializer
        return DangKyKhoaHocSerializer


class DangKyKhoaHocDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Chi tiết, cập nhật và xóa đăng ký khóa học (Nhân viên/Admin)
    """
    queryset = DangKyKhoaHoc.objects.all()
    serializer_class = DangKyKhoaHocDetailSerializer
    permission_classes = [IsOwnerOrStaff]

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return DangKyKhoaHocUpdateSerializer
        return DangKyKhoaHocDetailSerializer


class DangKyKhoaHocMyListView(generics.ListAPIView):
    """
    Học viên xem danh sách đăng ký của mình
    """
    serializer_class = DangKyKhoaHocDetailSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == 'hocvien':
            try:
                from app.apps.hocviens.models import HocVien
                hocvien = HocVien.objects.get(user=self.request.user)
                return DangKyKhoaHoc.objects.filter(hocvien=hocvien)
            except HocVien.DoesNotExist:
                return DangKyKhoaHoc.objects.none()
        return DangKyKhoaHoc.objects.none()


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dangky_stats(request):
    """
    Thống kê đăng ký khóa học (Nhân viên/Admin)
    """
    if request.user.role not in ['admin', 'nhanvien']:
        return Response({'error': 'Không có quyền truy cập'}, status=status.HTTP_403_FORBIDDEN)

    total_dangky = DangKyKhoaHoc.objects.count()
    dang_hoc = DangKyKhoaHoc.objects.filter(trang_thai='dang_hoc').count()
    hoan_thanh = DangKyKhoaHoc.objects.filter(trang_thai='hoan_thanh').count()
    tam_ngung = DangKyKhoaHoc.objects.filter(trang_thai='tam_ngung').count()
    huy_bo = DangKyKhoaHoc.objects.filter(trang_thai='huy_bo').count()

    # Tỷ lệ hoàn thành trung bình
    ty_le_hoan_thanh_tb = DangKyKhoaHoc.objects.aggregate(
        avg=models.Avg('phan_tram_hoan_thanh')
    )['avg'] or 0

    return Response({
        'total_dangky': total_dangky,
        'dang_hoc': dang_hoc,
        'hoan_thanh': hoan_thanh,
        'tam_ngung': tam_ngung,
        'huy_bo': huy_bo,
        'ty_le_hoan_thanh_tb': round(ty_le_hoan_thanh_tb, 2)
    })
