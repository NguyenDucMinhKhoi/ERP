# app/apps/lophocs/views.py
from rest_framework import viewsets
from .models import LopHoc
from .serializers import LopHocSerializer
from app.core.permissions import CanManageCourses


class LopHocViewSet(viewsets.ModelViewSet):
    """
    ViewSet for CRUD operations on LopHoc model.
    Admin, Academic Staff, and Giảng viên can perform all operations.
    """
    queryset = LopHoc.objects.all()
    serializer_class = LopHocSerializer
    permission_classes = [CanManageCourses]

    def get_queryset(self):
        """
        Filter queryset based on query params (e.g., khoa_hoc, trang_thai).
        """
        queryset = super().get_queryset()
        khoa_hoc_id = self.request.query_params.get('khoa_hoc')
        trang_thai = self.request.query_params.get('trang_thai')
        if khoa_hoc_id:
            queryset = queryset.filter(khoa_hoc_id=khoa_hoc_id)
        if trang_thai:
            queryset = queryset.filter(trang_thai=trang_thai)
        return queryset.order_by('-created_at')