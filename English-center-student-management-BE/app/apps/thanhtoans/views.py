from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.db import models

from app.core.permissions import (
    IsStaffUser, IsOwnerOrStaff, 
    FinancePermission, CanViewFinance, CanManageFinance
)
from .models import ThanhToan
from .serializers import (
    ThanhToanSerializer, ThanhToanCreateSerializer,
    ThanhToanUpdateSerializer, ThanhToanDetailSerializer
)


class ThanhToanListView(generics.ListCreateAPIView):
    """
    Danh sách và tạo thanh toán với phân quyền theo role
    - Admin, Finance Staff: Full CRUD
    - Academic Staff: Read + Create
    - Sales Staff: Read only
    """
    queryset = ThanhToan.objects.all()
    serializer_class = ThanhToanSerializer
    permission_classes = [FinancePermission]
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
    Chi tiết, cập nhật và xóa thanh toán với phân quyền
    - Admin, Finance Staff: Full CRUD
    - Academic Staff: Read only (không được sửa/xóa)
    - Sales Staff: Read only
    """
    queryset = ThanhToan.objects.all()
    serializer_class = ThanhToanDetailSerializer
    permission_classes = [FinancePermission]

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return ThanhToanUpdateSerializer
        return ThanhToanDetailSerializer
    
    def update(self, request, *args, **kwargs):
        # Chỉ Admin và Finance Staff mới được cập nhật
        if request.user.role not in ['admin', 'finance_staff']:
            return Response(
                {'error': 'Bạn không có quyền cập nhật thanh toán'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        return super().update(request, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        # Chỉ Admin và Finance Staff mới được xóa
        if request.user.role not in ['admin', 'finance_staff']:
            return Response(
                {'error': 'Bạn không có quyền xóa thanh toán'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        return super().destroy(request, *args, **kwargs)


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
@permission_classes([CanViewFinance])
def thanhtoan_stats(request):
    """
    Thống kê thanh toán - Có phân quyền theo role
    - Admin, Finance Staff, Academic Staff, Sales Staff: Được xem thống kê
    """

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


class ThanhToanListCreateView(generics.ListCreateAPIView):
    """
    GET /thanhtoans/  -> list payments (finance staff/admin)
    POST /thanhtoans/ -> create a payment. If hinh_thuc + so_bien_lai provided and trang_thai not provided,
                         serializer will mark trang_thai='paid' so model.save() sets ngay_dong and updates HocVien.
    """
    queryset = ThanhToan.objects.all().order_by('-created_at')
    serializer_class = ThanhToanSerializer
    permission_classes = [CanManageFinance]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        obj = serializer.save()
        out = ThanhToanSerializer(obj)
        return Response(out.data, status=status.HTTP_201_CREATED)


class ThanhToanDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET/PUT/PATCH/DELETE on /thanhtoans/<pk>/
    Updating hinh_thuc + so_bien_lai will set trang_thai='paid' by serializer logic if not provided.
    """
    queryset = ThanhToan.objects.all()
    serializer_class = ThanhToanSerializer
    permission_classes = [CanManageFinance]
