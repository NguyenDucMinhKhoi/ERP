from rest_framework.response import Response
from rest_framework import viewsets, generics, filters
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework import status
from .models import DiemDanh
from .serializers import DiemDanhSerializer
from app.core.permissions import IsOwnerOrStaff, CanManageCourses
from app.apps.hocviens.models import HocVien
from django.utils.dateparse import parse_datetime


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

    def create(self, request, *args, **kwargs):
        """
        Accept payload:
          { "hoc_vien": { "<hocvien_id>": { "checkInTime": "...", "notes":"...", "status":"..." }, ... }, "lich_hoc": "<id>" }
        or fallback to default single-object create (uses serializer).
        """
        payload = request.data

        # helper: map common incoming status strings to canonical DB values
        status_map = {
            'co_mat': 'co_mat',
            'có mặt': 'co_mat',
            'có mặt'.lower(): 'co_mat',
            'có mặt'.upper(): 'co_mat',
            'vang_co_phep': 'vang_co_phep',
            'vắng có phép': 'vang_co_phep',
            'vang_khong_phep': 'vang_khong_phep',
            'vắng không phép': 'vang_khong_phep',
            'present': 'co_mat',
            'absent_excused': 'vang_co_phep',
            'absent_unexcused': 'vang_khong_phep',
        }

        def normalize_status(s):
            if s is None:
                return None
            key = str(s).strip().lower()
            return status_map.get(key, s)

        # If payload contains mapping under 'hoc_vien' -> handle bulk creation here
        if isinstance(payload, dict) and 'hoc_vien' in payload and isinstance(payload.get('hoc_vien'), dict):
            mapping = payload.get('hoc_vien')
            top_level_lich = payload.get('lich_hoc')
            created = []
            updated = []
            errors = []

            for idx, (hocvien_id, item) in enumerate(mapping.items()):
                if not isinstance(item, dict):
                    errors.append({"index": idx, "student": hocvien_id, "error": "Invalid item format, expected object"})
                    continue

                # normalize fields
                lich_hoc_id = item.get('lich_hoc') or top_level_lich
                checkin_raw = item.get('checkInTime') or item.get('checkinTime') or item.get('thoi_gian')
                note = item.get('notes') or item.get('note') or item.get('ghi_chu') or ''
                status_val = normalize_status(item.get('status'))

                if not (hocvien_id and lich_hoc_id and status_val):
                    errors.append({"index": idx, "student": hocvien_id, "item": item, "error": "Missing required fields (hocvien id, lich_hoc, status)"})
                    continue

                try:
                    hocvien = HocVien.objects.get(id=hocvien_id)
                except HocVien.DoesNotExist:
                    errors.append({"index": idx, "student": hocvien_id, "error": "HocVien not found"})
                    continue

                thoi_gian = None
                if checkin_raw:
                    try:
                        thoi_gian = parse_datetime(checkin_raw)
                    except Exception:
                        thoi_gian = None

                try:
                    # upsert: if attendance exists for (lich_hoc, hoc_vien) update it, else create
                    existing = DiemDanh.objects.filter(lich_hoc_id=lich_hoc_id, hoc_vien_id=hocvien_id).first()
                    if existing:
                        existing.trang_thai = status_val
                        existing.thoi_gian = thoi_gian
                        existing.ghi_chu = note
                        existing.save()
                        updated.append(str(existing.id))
                    else:
                        dd = DiemDanh.objects.create(
                            hoc_vien=hocvien,
                            lich_hoc_id=lich_hoc_id,
                            trang_thai=status_val,
                            thoi_gian=thoi_gian,
                            ghi_chu=note
                        )
                        created.append(str(dd.id))
                except Exception as e:
                    errors.append({"index": idx, "student": hocvien_id, "error": str(e)})

            status_code = status.HTTP_201_CREATED if (created or updated) else status.HTTP_400_BAD_REQUEST
            return Response({
                "created": created,
                "updated": updated,
                "errors": errors,
                "message": f"{len(created)} created, {len(updated)} updated, {len(errors)} errors."
            }, status=status_code)

        # Fallback: behave as regular single-object create using serializer
        return super().create(request, *args, **kwargs)


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


class DiemDanhBulkCreateView(APIView):
    """
    POST /api/diemdanhs/
    Body can be either:
      - A mapping where keys are hocvien ids and values are { checkInTime, notes, status }
        e.g. { "a1b2...": { "checkInTime": "2025-10-15T08:00:00Z", "notes": "late", "status": "co_mat" }, "lich_hoc": "<lop id>" }
      - Or a list of items [{ studentId, status, checkinTime, note, lich_hoc }]
    Creates multiple DiemDanh records.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        payload = request.data
        created = []
        errors = []

        # Helper to create one record from normalized item dict
        def create_record(hocvien_id, item_dict, idx=None):
            lich_hoc_id = item_dict.get('lich_hoc') or payload.get('lich_hoc')
            checkin_raw = item_dict.get('checkInTime') or item_dict.get('checkinTime') or item_dict.get('thoi_gian')
            note = item_dict.get('notes') or item_dict.get('note') or item_dict.get('ghi_chu') or ''
            status_val = normalize_status(item_dict.get('status'))
            if not (hocvien_id and lich_hoc_id and status_val):
                errors.append({"index": idx, "student": hocvien_id, "item": item_dict, "error": "Missing required fields (hocvien id, lich_hoc, status)"})
                return
            try:
                hocvien = HocVien.objects.get(id=hocvien_id)
            except HocVien.DoesNotExist:
                errors.append({"index": idx, "student": hocvien_id, "error": "HocVien not found"})
                return

            # parse datetime if provided
            thoi_gian = None
            if checkin_raw:
                try:
                    thoi_gian = parse_datetime(checkin_raw)
                except Exception:
                    thoi_gian = None

            try:
                # upsert to avoid unique constraint violation
                existing = DiemDanh.objects.filter(lich_hoc_id=lich_hoc_id, hoc_vien_id=hocvien_id).first()
                if existing:
                    existing.trang_thai = status_val
                    existing.thoi_gian = thoi_gian
                    existing.ghi_chu = note
                    existing.save()
                    created.append(str(existing.id))  # report id in created for backward compat
                else:
                    dd = DiemDanh.objects.create(
                        hoc_vien=hocvien,
                        lich_hoc_id=lich_hoc_id,
                        trang_thai=status_val,
                        thoi_gian=thoi_gian,
                        ghi_chu=note
                    )
                    created.append(str(dd.id))
            except Exception as e:
                errors.append({"index": idx, "student": hocvien_id, "error": str(e)})

        # New: support payload shaped as { "hoc_vien": { "<id>": {...}, ... }, "lich_hoc": "<id>" }
        if isinstance(payload, dict) and 'hoc_vien' in payload and isinstance(payload.get('hoc_vien'), dict):
            top_level_lich = payload.get('lich_hoc')
            for idx, (hocvien_id, info) in enumerate(payload.get('hoc_vien').items()):
                if not isinstance(info, dict):
                    errors.append({"index": idx, "student": hocvien_id, "error": "Invalid item format, expected object"})
                    continue
                # ensure lich_hoc present in item or fallback to top-level
                if 'lich_hoc' not in info and top_level_lich:
                    info['lich_hoc'] = top_level_lich
                create_record(hocvien_id, info, idx=idx)

        # If payload is a list -> existing behavior (list of item objects)
        elif isinstance(payload, list):
            for idx, item in enumerate(payload):
                student_id = item.get("studentId") or item.get("hoc_vien") or item.get("hocvien")
                create_record(student_id, {
                    'lich_hoc': item.get('lich_hoc'),
                    'checkInTime': item.get('checkinTime') or item.get('checkInTime'),
                    'notes': item.get('note') or item.get('notes'),
                    'status': item.get('status')
                }, idx=idx)

        # Backward-compatible: top-level mapping where keys are hocvien ids
        elif isinstance(payload, dict):
            top_level_lich = payload.get('lich_hoc')
            for key, value in payload.items():
                if key == 'lich_hoc':
                    continue
                if not isinstance(value, dict):
                    errors.append({"student": key, "error": "Invalid item format, expected object"})
                    continue
                item_dict = value.copy()
                if 'lich_hoc' not in item_dict and top_level_lich:
                    item_dict['lich_hoc'] = top_level_lich
                create_record(key, item_dict)

        else:
            return Response({"error": "Invalid payload format"}, status=status.HTTP_400_BAD_REQUEST)

        status_code = status.HTTP_201_CREATED if created else status.HTTP_400_BAD_REQUEST
        return Response({
            "created": created,
            "errors": errors,
            "message": f"{len(created)} diem_danh created, {len(errors)} errors."
        }, status=status_code)