# app/apps/lophocs/views.py
from django.apps import apps
from rest_framework import viewsets, generics, filters
from rest_framework.response import Response
from .models import LopHoc
from .serializers import LopHocSerializer
from app.core.permissions import CanManageCourses
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from app.apps.users.models import User


class LopHocViewSet(viewsets.ModelViewSet):
    """
    ViewSet for CRUD operations on LopHoc model.
    Admin, Academic Staff, and Giảng viên can perform all operations.
    """
    queryset = LopHoc.objects.all()
    serializer_class = LopHocSerializer
    permission_classes = [CanManageCourses]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['ten', 'giang_vien', 'phong_hoc']
    ordering_fields = ['ten', 'ngay_bat_dau', 'ngay_ket_thuc']

    def get_queryset(self):
        """
        Filter queryset based on query params (e.g., khoa_hoc, trang_thai).
        """
        qs = super().get_queryset()
        khoa_hoc = self.request.query_params.get('khoa_hoc')
        trang_thai = self.request.query_params.get('trang_thai')
        if khoa_hoc:
            qs = qs.filter(khoa_hoc_id=khoa_hoc)
        if trang_thai:
            qs = qs.filter(trang_thai=trang_thai)
        return qs.order_by('-created_at')


class LopHocListView(generics.ListCreateAPIView):
    """
    List and create LopHoc
    Endpoint: /api/lophoc/  (singular)
    """
    queryset = LopHoc.objects.all()
    serializer_class = LopHocSerializer
    permission_classes = [CanManageCourses]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['ten', 'giang_vien', 'phong_hoc']
    ordering_fields = ['ten', 'ngay_bat_dau', 'ngay_ket_thuc']

    def get_queryset(self):
        qs = super().get_queryset()
        khoa_hoc = self.request.query_params.get('khoa_hoc')
        if khoa_hoc:
            qs = qs.filter(khoa_hoc_id=khoa_hoc)
        return qs

    def list(self, request, *args, **kwargs):
        """
        List LopHoc and attach schedule built from related LichHoc records.
        Each schedule item: { "day": "<ngay_hoc>", "time": "<gio_bat_dau>-<gio_ket_thuc>" }
        Also attach 'students' (array) and 'currentStudents' (count) derived from enrollments.
        """
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        lops = list(page) if page is not None else list(queryset)

        # collect lop ids
        lop_ids = [getattr(l, 'id') for l in lops]
        schedule_map = {}

        # load LichHoc model dynamically to avoid circular imports
        try:
            LichHoc = apps.get_model('lichhocs', 'LichHoc')
            lich_qs = LichHoc.objects.filter(lop_hoc_id__in=lop_ids).values('lop_hoc_id', 'ngay_hoc', 'gio_bat_dau', 'gio_ket_thuc')
            for r in lich_qs:
                lid = str(r.get('lop_hoc_id'))
                day = r.get('ngay_hoc')
                start = r.get('gio_bat_dau') or ''
                end = r.get('gio_ket_thuc') or ''
                time = f"{start}-{end}" if start or end else ''
                schedule_map.setdefault(lid, []).append({"day": day, "time": time})
        except Exception:
            # if model not available or query fails, leave schedule_map empty
            schedule_map = {}

        # --- NEW: load enrollments and build course -> students map and counts ---
        enroll_students_map = {}
        try:
            DangKy = apps.get_model('dangky', 'dangkykhoahoc')
            # determine course ids referenced by lops (khoa_hoc)
            course_ids = []
            for l in lops:
                cid = getattr(l, 'khoa_hoc_id', None)
                if not cid:
                    kh = getattr(l, 'khoa_hoc', None)
                    cid = getattr(kh, 'id', None) if kh else None
                if cid:
                    course_ids.append(cid)
            if course_ids:
                # select related hocvien for each enrollment
                dk_qs = DangKy.objects.filter(khoahoc_id__in=course_ids).select_related('hocvien')
                for dk in dk_qs:
                    # robustly get course id and hocvien
                    cid = getattr(dk, 'khoahoc_id', None) or (getattr(dk, 'khoahoc', None) and getattr(getattr(dk, 'khoahoc', None), 'id', None))
                    if not cid:
                        continue
                    hv = getattr(dk, 'hocvien', None)
                    if hv:
                        student_obj = {
                            "id": getattr(hv, 'id', None),
                            "ten": getattr(hv, 'ten', None) or getattr(hv, 'name', None),
                            "email": getattr(hv, 'email', None)
                        }
                    else:
                        student_obj = None
                    enroll_students_map.setdefault(str(cid), []).append(student_obj)
        except Exception:
            enroll_students_map = {}
        # --- END NEW ---

        # build DTOs for frontend
        items = []
        for lop in lops:
            lid = str(getattr(lop, 'id'))
            linked_course_id = getattr(lop, 'khoa_hoc_id', None)
            if not linked_course_id:
                kh = getattr(lop, 'khoa_hoc', None)
                linked_course_id = getattr(kh, 'id', None) if kh else None
            linked_course_key = str(linked_course_id) if linked_course_id else None

            students = enroll_students_map.get(linked_course_key, [])
            current_students_count = len(students) if isinstance(students, list) else 0

            # Join to user table for teacher info
            teacher_obj = None
            teacher = getattr(lop, 'giang_vien_id', None)
            if teacher and isinstance(teacher, User):
                teacher_obj = {
                    "id": str(teacher.id),
                    "name": f"{teacher.first_name} {teacher.last_name}".strip() or teacher.username,
                    "email": teacher.email,
                    "username": teacher.username,
                }

            dto = {
                "id": getattr(lop, 'id'),
                "ten": getattr(lop, 'ten', None),
                "khoa_hoc": linked_course_id,
                "giang_vien": teacher_obj,  # now an object
                "phong_hoc": getattr(lop, 'phong_hoc', None),
                "ngay_bat_dau": getattr(lop, 'ngay_bat_dau', None),
                "ngay_ket_thuc": getattr(lop, 'ngay_ket_thuc', None),
                "trang_thai": getattr(lop, 'trang_thai', None),
                "mo_ta": getattr(lop, 'mo_ta', None),
                "created_at": getattr(lop, 'created_at', None),
                "updated_at": getattr(lop, 'updated_at', None),
                "schedule": schedule_map.get(lid, []),
                "students": students,
                "currentStudents": current_students_count,
            }
            items.append(dto)

        if page is not None:
            return self.get_paginated_response(items)

        return Response({"results": items})


class LopHocDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Retrieve, update, delete a LopHoc"""
    queryset = LopHoc.objects.all()
    serializer_class = LopHocSerializer
    permission_classes = [CanManageCourses]


class AddStudentToClassView(APIView):
    """
    API to add one or multiple students to a class (LopHoc).
    POST body: { "student_id": <hocvien_id> } or { "student_id": [<hocvien_id>, ...] }
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, class_id):
        student_ids = request.data.get("student_id")
        if not student_ids:
            return Response({"error": "student_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Accept both single string and list of strings
        if isinstance(student_ids, str):
            student_ids = [student_ids]
        elif not isinstance(student_ids, list):
            return Response({"error": "student_id must be a string or list of strings"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            LopHoc = apps.get_model('lophocs', 'LopHoc')
            DangKy = apps.get_model('dangky', 'dangkykhoahoc')
            Hocvien = apps.get_model('hocviens', 'Hocvien')
            lop = LopHoc.objects.get(id=class_id)
            added = []
            already = []
            not_found = []
            for sid in student_ids:
                try:
                    hocvien = Hocvien.objects.get(id=sid)
                except Hocvien.DoesNotExist:
                    not_found.append(sid)
                    continue
                obj, created = DangKy.objects.get_or_create(
                    khoahoc=lop.khoa_hoc,
                    hocvien=hocvien,
                    defaults={"trang_thai": "dang_hoc"}
                )
                if created:
                    added.append(sid)
                else:
                    already.append(sid)
            return Response({
                "success": True,
                "added": added,
                "already_in_class": already,
                "not_found": not_found,
                "message": f"{len(added)} học viên đã được thêm, {len(already)} đã có trong lớp, {len(not_found)} không tìm thấy."
            }, status=status.HTTP_200_OK)
        except LopHoc.DoesNotExist:
            return Response({"error": "Class not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)