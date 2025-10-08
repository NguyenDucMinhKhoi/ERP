# app/apps/diemdanhs/views.py
from rest_framework import viewsets, generics, filters
from rest_framework.permissions import IsAuthenticated
from .models import DiemDanh
from .serializers import DiemDanhSerializer
from app.core.permissions import IsOwnerOrStaff, CanManageCourses
from app.apps.hocviens.models import HocVien


class DiemDanhViewSet(viewsets.ModelViewSet):
    """
    ViewSet for CRUD operations on DiemDanh model.
    Admin, Staff can perform all operations; học viên can update their own records.
    """
    queryset = DiemDanh.objects.all()
    serializer_class = DiemDanhSerializer
    permission_classes = [IsOwnerOrStaff | CanManageCourses]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['ghi_chu']
    ordering_fields = ['lich_hoc', 'hoc_vien']

    def get_queryset(self):
        """
        Filter queryset based on query params and user role.
        """
        queryset = super().get_queryset()
        hoc_vien = self.request.query_params.get('hoc_vien')
        lich_hoc = self.request.query_params.get('lich_hoc')
        if not (self.request.user.is_admin or self.request.user.is_nhanvien or self.request.user.is_giangvien):
            # Non-staff (e.g., hocvien) only see their own attendance
            queryset = queryset.filter(hoc_vien__user=self.request.user)
        if hoc_vien:
            queryset = queryset.filter(hoc_vien_id=hoc_vien)
        if lich_hoc:
            queryset = queryset.filter(lich_hoc_id=lich_hoc)
        return queryset.order_by('-created_at')


class DiemDanhListView(generics.ListCreateAPIView):
    """List and create DiemDanh"""
    queryset = DiemDanh.objects.all()
    serializer_class = DiemDanhSerializer
    permission_classes = [CanManageCourses]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['ghi_chu']
    ordering_fields = ['lich_hoc', 'hoc_vien']

    def get_queryset(self):
        qs = super().get_queryset()
        hoc_vien = self.request.query_params.get('hoc_vien')
        lich_hoc = self.request.query_params.get('lich_hoc')
        if hoc_vien:
            qs = qs.filter(hoc_vien_id=hoc_vien)
        if lich_hoc:
            qs = qs.filter(lich_hoc_id=lich_hoc)
        return qs


class DiemDanhDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, delete a DiemDanh"""
    queryset = DiemDanh.objects.all()
    serializer_class = DiemDanhSerializer
    permission_classes = [CanManageCourses]


class DiemDanhMeListView(generics.ListAPIView):
    """
    List attendance records for the authenticated user's Hocvien.
    URL: /api/diemdanhs/me/
    """
    serializer_class = DiemDanhSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # find Hocvien linked to this user
        hocvien = HocVien.objects.filter(user=user).first()
        if not hocvien:
            return DiemDanh.objects.none()
        qs = DiemDanh.objects.filter(hoc_vien=hocvien)
        # optional filters (preserve existing pattern)
        lich_hoc = self.request.query_params.get('lich_hoc')
        if lich_hoc:
            qs = qs.filter(lich_hoc_id=lich_hoc)
        return qs.order_by('-created_at')