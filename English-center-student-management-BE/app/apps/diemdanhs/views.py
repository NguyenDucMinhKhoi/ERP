# app/apps/diemdanhs/views.py
from rest_framework import viewsets
from .models import DiemDanh
from .serializers import DiemDanhSerializer
from app.core.permissions import IsOwnerOrStaff


class DiemDanhViewSet(viewsets.ModelViewSet):
    """
    ViewSet for CRUD operations on DiemDanh model.
    Admin, Staff can perform all operations; học viên can update their own records.
    """
    queryset = DiemDanh.objects.all()
    serializer_class = DiemDanhSerializer
    permission_classes = [IsOwnerOrStaff]

    def get_queryset(self):
        """
        Filter queryset based on query params and user role.
        """
        queryset = super().get_queryset()
        lich_hoc_id = self.request.query_params.get('lich_hoc')
        hoc_vien_id = self.request.query_params.get('hoc_vien')
        if not (self.request.user.is_admin or self.request.user.is_nhanvien or self.request.user.is_giangvien):
            # Non-staff (e.g., hocvien) only see their own attendance
            queryset = queryset.filter(hoc_vien__user=self.request.user)
        if lich_hoc_id:
            queryset = queryset.filter(lich_hoc_id=lich_hoc_id)
        if hoc_vien_id:
            queryset = queryset.filter(hoc_vien_id=hoc_vien_id)
        return queryset.order_by('-created_at')