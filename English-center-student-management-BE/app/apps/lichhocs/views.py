# app/apps/lichhocs/views.py
from rest_framework import viewsets, generics
from .models import LichHoc
from .serializers import LichHocSerializer
from app.core.permissions import CanManageCourses


class LichHocViewSet(viewsets.ModelViewSet):
    """
    ViewSet for CRUD operations on LichHoc model.
    Admin, Academic Staff, and Giảng viên can perform all operations.
    """
    queryset = LichHoc.objects.all()
    serializer_class = LichHocSerializer
    permission_classes = [CanManageCourses]

    def get_queryset(self):
        """
        Filter queryset based on query params (e.g., lop_hoc, ngay_hoc).
        """
        queryset = super().get_queryset()
        lop_hoc_id = self.request.query_params.get('lop_hoc')
        ngay_hoc = self.request.query_params.get('ngay_hoc')
        if lop_hoc_id:
            queryset = queryset.filter(lop_hoc_id=lop_hoc_id)
        if ngay_hoc:
            queryset = queryset.filter(ngay_hoc=ngay_hoc)
        return queryset.order_by('ngay_hoc', 'gio_bat_dau')


class LichHocListView(generics.ListCreateAPIView):
    """List and create LichHoc"""
    queryset = LichHoc.objects.all()
    serializer_class = LichHocSerializer
    permission_classes = [CanManageCourses]

    def get_queryset(self):
        qs = super().get_queryset()
        lop_hoc_id = self.request.query_params.get('lop_hoc')
        ngay_hoc = self.request.query_params.get('ngay_hoc')
        if lop_hoc_id:
            qs = qs.filter(lop_hoc_id=lop_hoc_id)
        if ngay_hoc:
            qs = qs.filter(ngay_hoc=ngay_hoc)
        return qs.order_by('ngay_hoc', 'gio_bat_dau')


class LichHocDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, delete a LichHoc"""
    queryset = LichHoc.objects.all()
    serializer_class = LichHocSerializer
    permission_classes = [CanManageCourses]