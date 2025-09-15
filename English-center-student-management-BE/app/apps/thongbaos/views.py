from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from app.core.permissions import IsStaffUser
from .models import ThongBao
from .serializers import (
    ThongBaoSerializer, ThongBaoCreateSerializer,
    ThongBaoUpdateSerializer, ThongBaoDetailSerializer
)


class ThongBaoListView(generics.ListCreateAPIView):
    """
    Danh sách và tạo thông báo (Admin/Nhân viên)
    """
    queryset = ThongBao.objects.all()
    serializer_class = ThongBaoSerializer
    permission_classes = [IsStaffUser]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['trang_thai', 'loai_thong_bao', 'nguoi_nhan']
    search_fields = ['tieu_de', 'noi_dung']
    ordering_fields = ['ngay_gui', 'trang_thai', 'created_at']

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ThongBaoCreateSerializer
        return ThongBaoSerializer


class ThongBaoDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Chi tiết, cập nhật và xóa thông báo (Admin/Nhân viên)
    """
    queryset = ThongBao.objects.all()
    serializer_class = ThongBaoDetailSerializer
    permission_classes = [IsStaffUser]

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return ThongBaoUpdateSerializer
        return ThongBaoDetailSerializer


class ThongBaoPublicListView(generics.ListAPIView):
    """
    Danh sách thông báo công khai (cho tất cả user)
    """
    serializer_class = ThongBaoDetailSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['loai_thong_bao']
    search_fields = ['tieu_de', 'noi_dung']
    ordering_fields = ['ngay_gui']

    def get_queryset(self):
        user = self.request.user
        
        # Lọc thông báo theo quyền truy cập
        if user.role == 'admin':
            # Admin xem tất cả
            return ThongBao.objects.filter(trang_thai='da_gui')
        elif user.role == 'nhanvien':
            # Nhân viên xem thông báo cho nhân viên và tất cả
            return ThongBao.objects.filter(
                trang_thai='da_gui',
                nguoi_nhan__in=['tatca', 'nhanvien']
            )
        elif user.role == 'hocvien':
            # Học viên xem thông báo cho học viên và tất cả
            return ThongBao.objects.filter(
                trang_thai='da_gui',
                nguoi_nhan__in=['tatca', 'hocvien']
            )
        
        return ThongBao.objects.none()


class ThongBaoMyListView(generics.ListAPIView):
    """
    Danh sách thông báo cá nhân (cho user cụ thể)
    """
    serializer_class = ThongBaoDetailSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return ThongBao.objects.filter(
            trang_thai='da_gui',
            nguoi_nhan='user',
            user=user
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def thongbao_stats(request):
    """
    Thống kê thông báo (Admin/Nhân viên)
    """
    if request.user.role not in ['admin', 'nhanvien']:
        return Response({'error': 'Không có quyền truy cập'}, status=status.HTTP_403_FORBIDDEN)

    total_thongbao = ThongBao.objects.count()
    moi = ThongBao.objects.filter(trang_thai='moi').count()
    dang_gui = ThongBao.objects.filter(trang_thai='dang_gui').count()
    da_gui = ThongBao.objects.filter(trang_thai='da_gui').count()
    huy_bo = ThongBao.objects.filter(trang_thai='huy_bo').count()

    # Thống kê theo loại thông báo
    thong_bao = ThongBao.objects.filter(loai_thong_bao='thong_bao').count()
    canh_bao = ThongBao.objects.filter(loai_thong_bao='canh_bao').count()
    thong_tin = ThongBao.objects.filter(loai_thong_bao='thong_tin').count()
    khac = ThongBao.objects.filter(loai_thong_bao='khac').count()

    # Thống kê theo người nhận
    tatca = ThongBao.objects.filter(nguoi_nhan='tatca').count()
    hocvien = ThongBao.objects.filter(nguoi_nhan='hocvien').count()
    nhanvien = ThongBao.objects.filter(nguoi_nhan='nhanvien').count()
    user = ThongBao.objects.filter(nguoi_nhan='user').count()

    return Response({
        'total_thongbao': total_thongbao,
        'moi': moi,
        'dang_gui': dang_gui,
        'da_gui': da_gui,
        'huy_bo': huy_bo,
        'thong_bao': thong_bao,
        'canh_bao': canh_bao,
        'thong_tin': thong_tin,
        'khac': khac,
        'tatca': tatca,
        'hocvien': hocvien,
        'nhanvien': nhanvien,
        'user': user
    })
