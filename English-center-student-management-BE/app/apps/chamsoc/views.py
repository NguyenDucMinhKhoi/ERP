from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from app.core.permissions import IsStaffUser, IsOwnerOrStaff
from .models import ChamSocHocVien
from .serializers import (
    ChamSocHocVienSerializer, ChamSocHocVienCreateSerializer,
    ChamSocHocVienUpdateSerializer, ChamSocHocVienDetailSerializer
)


class ChamSocHocVienListView(generics.ListCreateAPIView):
    """
    Danh sách và tạo chăm sóc học viên (Nhân viên/Admin)
    """
    queryset = ChamSocHocVien.objects.all()
    serializer_class = ChamSocHocVienSerializer
    permission_classes = [IsStaffUser]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['trang_thai', 'loai_cham_soc', 'hocvien', 'nhanvien']
    search_fields = ['hocvien__ten', 'noi_dung']
    ordering_fields = ['ngay', 'trang_thai', 'created_at']

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ChamSocHocVienCreateSerializer
        return ChamSocHocVienSerializer


class ChamSocHocVienDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Chi tiết, cập nhật và xóa chăm sóc học viên (Nhân viên/Admin)
    """
    queryset = ChamSocHocVien.objects.all()
    serializer_class = ChamSocHocVienDetailSerializer
    permission_classes = [IsOwnerOrStaff]

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return ChamSocHocVienUpdateSerializer
        return ChamSocHocHocVienDetailSerializer


class ChamSocHocVienMyListView(generics.ListAPIView):
    """
    Học viên xem danh sách chăm sóc của mình
    """
    serializer_class = ChamSocHocVienDetailSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == 'hocvien':
            try:
                from app.apps.hocviens.models import HocVien
                hocvien = HocVien.objects.get(user=self.request.user)
                return ChamSocHocVien.objects.filter(hocvien=hocvien)
            except HocVien.DoesNotExist:
                return ChamSocHocVien.objects.none()
        return ChamSocHocVien.objects.none()


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def chamsoc_stats(request):
    """
    Thống kê chăm sóc học viên (Nhân viên/Admin)
    """
    if request.user.role not in ['admin', 'nhanvien']:
        return Response({'error': 'Không có quyền truy cập'}, status=status.HTTP_403_FORBIDDEN)

    total_chamsoc = ChamSocHocVien.objects.count()
    moi = ChamSocHocVien.objects.filter(trang_thai='moi').count()
    dang_xu_ly = ChamSocHocVien.objects.filter(trang_thai='dang_xu_ly').count()
    hoan_thanh = ChamSocHocVien.objects.filter(trang_thai='hoan_thanh').count()
    dong = ChamSocHocVien.objects.filter(trang_thai='dong').count()

    # Thống kê theo loại chăm sóc
    tuvan = ChamSocHocVien.objects.filter(loai_cham_soc='tuvan').count()
    theodoi = ChamSocHocVien.objects.filter(loai_cham_soc='theodoi').count()
    hoidap = ChamSocHocVien.objects.filter(loai_cham_soc='hoidap').count()
    khac = ChamSocHocVien.objects.filter(loai_cham_soc='khac').count()

    return Response({
        'total_chamsoc': total_chamsoc,
        'moi': moi,
        'dang_xu_ly': dang_xu_ly,
        'hoan_thanh': hoan_thanh,
        'dong': dong,
        'tuvan': tuvan,
        'theodoi': theodoi,
        'hoidap': hoidap,
        'khac': khac
    })
