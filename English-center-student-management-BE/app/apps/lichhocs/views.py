# app/apps/lichhocs/views.py
from rest_framework import viewsets, generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import LichHoc
from .serializers import LichHocSerializer
from app.core.permissions import CanManageCourses
from django.utils.dateparse import parse_date, parse_time


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


class LichHocBulkCreateView(APIView):
    """
    POST /api/lichhocs/
    Body: [{date, time, topic, note}]
    Creates multiple LichHoc records.
    """
    permission_classes = [CanManageCourses]

    def post(self, request):
        data = request.data
        if not isinstance(data, list):
            return Response({"error": "Body must be a list of objects"}, status=status.HTTP_400_BAD_REQUEST)
        created = []
        errors = []
        for item in data:
            date = item.get("date")
            time = item.get("time")
            topic = item.get("topic")
            note = item.get("note")
            lop_hoc_id = item.get("lop_hoc")  # required: FE must send lop_hoc id

            if not (date and time and topic and lop_hoc_id):
                errors.append({"item": item, "error": "Missing required fields"})
                continue

            # Split time into gio_bat_dau, gio_ket_thuc if format is "HH:MM-HH:MM"
            if "-" in time:
                gio_bat_dau, gio_ket_thuc = time.split("-", 1)
            else:
                gio_bat_dau, gio_ket_thuc = time, None

            lichhoc = LichHoc(
                lop_hoc_id=lop_hoc_id,
                ngay_hoc=parse_date(date),
                gio_bat_dau=parse_time(gio_bat_dau),
                gio_ket_thuc=parse_time(gio_ket_thuc) if gio_ket_thuc else None,
                noi_dung=topic,
                ghi_chu=note or "",
            )
            try:
                lichhoc.save()
                created.append(lichhoc.id)
            except Exception as e:
                errors.append({"item": item, "error": str(e)})

        return Response({
            "created": created,
            "errors": errors,
            "message": f"{len(created)} lichhoc created, {len(errors)} errors."
        }, status=status.HTTP_201_CREATED if created else status.HTTP_400_BAD_REQUEST)