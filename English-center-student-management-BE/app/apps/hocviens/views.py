from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.views import APIView
from django.db import transaction
from django.db.models import Count
from django.db.models.functions import TruncDate
from django.db.models import Q
from django.utils.timezone import now
from django.apps import apps

from app.core.permissions import CanManageStudents, IsOwnerOrStaff, CanManageCourses
from .models import HocVien, LeadContactNote
from app.apps.khoahocs.models import KhoaHoc
from .serializers import (
    HocVienSerializer, HocVienCreateSerializer,
    HocVienUpdateSerializer, HocVienDetailSerializer, LeadContactNoteSerializer
)
from app.apps.users.models import User


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

    def create(self, request, *args, **kwargs):
        """
        Create a HocVien and optionally create/attach a User account when 'password' + 'email' provided.
        - If a user with the email exists, reuse that user and update password.
        - Otherwise create a new User with role='hocvien', username from email (add suffix if needed).
        - Save HocVien with user attached, is_converted=True, created_as_lead=False.
        """
        data = request.data.copy() if isinstance(request.data, dict) else dict(request.data)
        password = data.pop('password', None)
        email = data.get('email') or data.get('email'.lower())  # defensive

        user = None
        try:
            with transaction.atomic():
                if password and email:
                    # reuse existing user by email if present
                    user_qs = User.objects.filter(email__iexact=email)
                    if user_qs.exists():
                        user = user_qs.first()
                        user.set_password(password)
                        user.role = getattr(user, 'role', 'hocvien') or 'hocvien'
                        user.is_active = True
                        user.save()
                    else:
                        # derive candidate username from email local part; ensure uniqueness
                        base = email.split('@')[0]
                        username = base
                        i = 1
                        while User.objects.filter(username=username).exists():
                            username = f"{base}{i}"
                            i += 1
                        user = User(username=username, email=email, is_active=True)
                        # set role if model has role field
                        if hasattr(user, 'role'):
                            try:
                                user.role = 'hocvien'
                            except Exception:
                                pass
                        user.set_password(password)
                        user.save()

                # create HocVien via serializer, attach user if present
                serializer = self.get_serializer(data=data)
                serializer.is_valid(raise_exception=True)
                save_kwargs = {'is_converted': True, 'created_as_lead': False}
                if user:
                    save_kwargs['user'] = user
                hv = serializer.save(**save_kwargs)
                out_serializer = HocVienSerializer(hv)
                headers = self.get_success_headers(out_serializer.data)
                return Response(out_serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        except Exception as exc:
            # return validation-like response for API consumers
            return Response({'detail': str(exc)}, status=status.HTTP_400_BAD_REQUEST)


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


class LeadConvertView(APIView):
    """
    POST /api/hocviens/leads/<pk>/convert/
    Mark a lead as converted to a student (is_converted=True).
    """
    permission_classes = [CanManageStudents]

    def post(self, request, pk):
        try:
            hv = HocVien.objects.get(pk=pk)
        except HocVien.DoesNotExist:
            return Response({"detail": "Lead not found."}, status=status.HTTP_404_NOT_FOUND)

        # mark converted
        hv.is_converted = True
        # it's fine to keep created_as_lead as-is; if desired, ensure it's True
        if not hv.created_as_lead:
            hv.created_as_lead = False
        hv.save()

        serializer = HocVienSerializer(hv)
        return Response(serializer.data, status=status.HTTP_200_OK)


class LeadsListCreateView(generics.ListCreateAPIView):
    """
    GET  /api/hocviens/leads/  -> list all records with created_as_lead=True and not yet converted (staff only)
    POST /api/hocviens/leads/  -> create a new lead (public allowed)
    """
    # only leads created as leads and not yet converted to student
    queryset = HocVien.objects.filter(created_as_lead=True, is_converted=False)
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


class LeadContactNoteView(APIView):
    """
    GET /api/hocviens/<lead_id>/contact-note/  -> retrieve note (200 or 404)
    POST /api/hocviens/<lead_id>/contact-note/ -> create or update note (returns note)
    """
    permission_classes = [CanManageStudents]  # restrict to staff; adjust as needed

    def get_object(self, lead_id):
        try:
            return HocVien.objects.get(pk=lead_id)
        except HocVien.DoesNotExist:
            return None

    def get(self, request, lead_id):
        lead = self.get_object(lead_id)
        if not lead:
            return Response({"detail": "Lead not found."}, status=status.HTTP_404_NOT_FOUND)
        note = getattr(lead, 'contact_note', None)
        if not note:
            return Response({}, status=status.HTTP_200_OK)
        serializer = LeadContactNoteSerializer(note)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, lead_id):
        lead = self.get_object(lead_id)
        if not lead:
            return Response({"detail": "Lead not found."}, status=status.HTTP_404_NOT_FOUND)

        # allow create or update: if exists update, else create
        note = getattr(lead, 'contact_note', None)
        data = {'hoc_vien': str(lead.id), 'content': request.data.get('content', '')}
        if note:
            serializer = LeadContactNoteSerializer(note, data=data, partial=True)
        else:
            serializer = LeadContactNoteSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)


class StudentRegistrationTrendView(APIView):
    """
    GET /api/hocviens/registrations/?from=YYYY-MM-DD&to=YYYY-MM-DD
    Returns daily counts of new students (not leads OR leads converted).
    Response:
      [{ "date": "2025-11-01", "count": 5 }, ...]
    """
    permission_classes = [CanManageStudents]

    def get(self, request):
        try:
            qs = HocVien.objects.filter(
                Q(created_as_lead=False) | Q(created_as_lead=True, is_converted=True)
            )
            # optional date range
            from_date = request.query_params.get('from')
            to_date = request.query_params.get('to')
            if from_date:
                qs = qs.filter(created_at__date__gte=from_date)
            if to_date:
                qs = qs.filter(created_at__date__lte=to_date)

            daily = qs.annotate(day=TruncDate('created_at')).values('day').annotate(count=Count('id')).order_by('day')
            result = [{'date': d['day'].strftime('%Y-%m-%d'), 'count': d['count']} for d in daily]
            return Response(result, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class StudentCountByCourseView(APIView):
    """
    GET /api/hocviens/by-course/
    Returns list of courses with student counts (based on enrollments).
    Response:
      [{ "id": "<khoahoc_id>", "ten": "Course name", "student_count": 12 }, ... ]
    """
    permission_classes = [CanManageCourses]

    def get(self, request):
        try:
            # use enrollment model to count distinct students per khoahoc
            DangKy = apps.get_model('dangky', 'dangkykhoahoc')
            enroll_counts = DangKy.objects.values('khoahoc').annotate(student_count=Count('hocvien', distinct=True))
            enroll_map = {str(item['khoahoc']): item['student_count'] for item in enroll_counts}

            courses_qs = KhoaHoc.objects.all().values('id', 'ten')
            courses = []
            for c in courses_qs:
                cid = str(c['id'])
                courses.append({
                    'id': c['id'],
                    'ten': c['ten'],
                    'student_count': enroll_map.get(cid, 0)
                })
            return Response(courses, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
