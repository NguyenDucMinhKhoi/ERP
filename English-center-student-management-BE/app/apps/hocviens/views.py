from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.views import APIView
from django.db.models import Count
from django.utils.timezone import now
from django.apps import apps

from app.core.permissions import CanManageStudents, IsOwnerOrStaff, CanManageCourses
from .models import HocVien
from app.apps.khoahocs.models import KhoaHoc
from .serializers import (
    HocVienSerializer, HocVienCreateSerializer,
    HocVienUpdateSerializer, HocVienDetailSerializer
)


class HocVienListView(generics.ListCreateAPIView):
    """
    Danh sách và tạo học viên (Nhân viên/Admin)
    """
    queryset = HocVien.objects.all()
    serializer_class = HocVienSerializer
    permission_classes = [CanManageStudents]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['trang_thai_hoc_phi']
    search_fields = ['ten', 'email', 'sdt']
    ordering_fields = ['ten', 'ngay_sinh', 'created_at', 'trang_thai_hoc_phi']

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return HocVienCreateSerializer
        return HocVienSerializer


class HocVienDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Chi tiết, cập nhật và xóa học viên (Nhân viên/Admin)
    """
    queryset = HocVien.objects.all()
    serializer_class = HocVienDetailSerializer
    permission_classes = [IsOwnerOrStaff]

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return HocVienUpdateSerializer
        return HocVienDetailSerializer


class HocVienMyProfileView(generics.RetrieveAPIView):
    """
    Học viên xem thông tin của mình
    """
    serializer_class = HocVienDetailSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        # Học viên chỉ có thể xem thông tin của mình
        if self.request.user.role == 'hocvien':
            try:
                return HocVien.objects.get(user=self.request.user)
            except HocVien.DoesNotExist:
                return None
        return None


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def hocvien_stats(request):
    """
    Thống kê học viên (Nhân viên/Admin)
    """
    if request.user.role not in ['admin', 'nhanvien']:
        return Response({'error': 'Không có quyền truy cập'}, status=status.HTTP_403_FORBIDDEN)

    total_hocvien = HocVien.objects.count()
    dadong_hocphi = HocVien.objects.filter(trang_thai_hoc_phi='dadong').count()
    conno_hocphi = HocVien.objects.filter(trang_thai_hoc_phi='conno').count()
    chuadong_hocphi = HocVien.objects.filter(trang_thai_hoc_phi='chuadong').count()
    co_taikhoan = HocVien.objects.filter(user__isnull=False).count()

    return Response({
        'total_hocvien': total_hocvien,
        'dadong_hocphi': dadong_hocphi,
        'conno_hocphi': conno_hocphi,
        'chuadong_hocphi': chuadong_hocphi,
        'co_taikhoan': co_taikhoan,
        'khong_co_taikhoan': total_hocvien - co_taikhoan
    })


class HocVienStatsView(APIView):
    """
    GET /api/hocviens/stats/
    Returns:
      {
        "total_students": int,
        "students_this_month": int,
        "courses": [
          { "id": "<khoahoc_id>", "ten": "Course name", "student_count": 12 },
          ...
        ]
      }
    """
    permission_classes = [CanManageCourses]

    def get(self, request):
        try:
            # total students
            total_students = HocVien.objects.count()

            # students created this month (use created_at from BaseModel)
            now_ts = now()
            first_of_month = now_ts.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
            students_this_month = HocVien.objects.filter(created_at__gte=first_of_month).count()

            # --- CHANGED: compute student_count per KhoaHoc from enrollments (dangkykhoahoc) ---
            # Use apps.get_model to load the enrollment model (avoid hardcoding class name)
            DangKy = apps.get_model('dangky', 'dangkykhoahoc')
            # aggregate unique students per khoahoc
            enroll_counts = DangKy.objects.values('khoahoc').annotate(student_count=Count('hocvien', distinct=True))
            enroll_map = {str(item['khoahoc']): item['student_count'] for item in enroll_counts}

            # build courses list using enroll_map (falls back to 0)
            courses_qs = KhoaHoc.objects.all().values('id', 'ten')
            courses = []
            for c in courses_qs:
                cid = str(c['id'])
                courses.append({
                    'id': c['id'],
                    'ten': c['ten'],
                    'student_count': enroll_map.get(cid, 0)
                })

            return Response({
                "total_students": total_students,
                "students_this_month": students_this_month,
                "courses": courses
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class LeadCreateView(APIView):
    """
    Create a new Lead (a person not yet converted to student).
    POST /api/hocviens/leads/
    Accepts same payload as HocVienCreateSerializer (ten, email, sdt, ngay_sinh, address, etc.)
    The created HocVien will have is_converted=False.
    """
    # Make public if you want leads created by unauthenticated sources;
    # restrict with permission_classes = [IsAuthenticated] if you want only staff to create leads.
    permission_classes = []

    def post(self, request):
        serializer = HocVienCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        # create as lead: mark created_as_lead True and is_converted False
        hv = serializer.save(is_converted=False, created_as_lead=True)
        out = HocVienSerializer(hv)
        return Response(out.data, status=status.HTTP_201_CREATED)


class LeadsListCreateView(generics.ListCreateAPIView):
    """
    GET  /api/hocviens/leads/  -> list all records with created_as_lead=True (staff only)
    POST /api/hocviens/leads/  -> create a new lead (public allowed)
    """
    queryset = HocVien.objects.filter(created_as_lead=True)
    # return full serializer for listing
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return HocVienCreateSerializer
        return HocVienSerializer

    def get_permissions(self):
        # GET: only staff/admin who can manage students
        # POST: allow public lead creation
        if self.request.method == 'GET':
            return [CanManageStudents()]
        return [AllowAny()]
