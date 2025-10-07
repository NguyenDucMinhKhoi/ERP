from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.db import models

from app.core.permissions import CanManageCourses
from .models import KhoaHoc
from .serializers import (
    KhoaHocSerializer, KhoaHocCreateSerializer,
    KhoaHocUpdateSerializer, KhoaHocDetailSerializer
)


class KhoaHocListView(generics.ListCreateAPIView):
    """
    Danh sách và tạo khóa học (Nhân viên/Admin)
    """
    queryset = KhoaHoc.objects.all()
    serializer_class = KhoaHocSerializer
    permission_classes = [CanManageCourses]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['trang_thai', 'giang_vien']
    search_fields = ['ten', 'giang_vien']
    ordering_fields = ['ten', 'hoc_phi', 'so_buoi', 'created_at', 'trang_thai']

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return KhoaHocCreateSerializer
        return KhoaHocSerializer


class KhoaHocDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Chi tiết, cập nhật và xóa khóa học (Nhân viên/Admin)
    """
    queryset = KhoaHoc.objects.all()
    serializer_class = KhoaHocDetailSerializer
    permission_classes = [CanManageCourses]

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return KhoaHocUpdateSerializer
        return KhoaHocDetailSerializer


class KhoaHocPublicListView(generics.ListAPIView):
    """
    Danh sách khóa học công khai (cho học viên xem)
    """
    queryset = KhoaHoc.objects.filter(trang_thai='mo')
    serializer_class = KhoaHocSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['giang_vien']
    search_fields = ['ten', 'giang_vien']
    ordering_fields = ['ten', 'hoc_phi', 'so_buoi']


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def khoahoc_stats(request):
    """
    Thống kê khóa học (Nhân viên/Admin)
    """
    if request.user.role not in ['admin', 'nhanvien']:
        return Response({'error': 'Không có quyền truy cập'}, status=status.HTTP_403_FORBIDDEN)

    total_khoahoc = KhoaHoc.objects.count()
    mo = KhoaHoc.objects.filter(trang_thai='mo').count()
    dong = KhoaHoc.objects.filter(trang_thai='dong').count()
    hoan_thanh = KhoaHoc.objects.filter(trang_thai='hoan_thanh').count()

    # Top khóa học có nhiều học viên nhất
    top_khoahoc = KhoaHoc.objects.annotate(
        so_hv=models.Count('dangkykhoahoc')
    ).order_by('-so_hv')[:5]

    top_khoahoc_data = []
    for kh in top_khoahoc:
        top_khoahoc_data.append({
            'id': kh.id,
            'ten': kh.ten,
            'so_hoc_vien': kh.so_hv,
            'ty_le_hoan_thanh': kh.ty_le_hoan_thanh
        })

    return Response({
        'total_khoahoc': total_khoahoc,
        'mo': mo,
        'dong': dong,
        'hoan_thanh': hoan_thanh,
        'top_khoahoc': top_khoahoc_data
    })
