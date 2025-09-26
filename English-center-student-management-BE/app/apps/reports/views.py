from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db import models
from django.utils import timezone
from datetime import datetime, timedelta

from app.core.permissions import IsAdminUser
from app.apps.users.models import User
from app.apps.khoahocs.models import KhoaHoc
from app.apps.dangky.models import DangKyKhoaHoc
from app.apps.thanhtoans.models import ThanhToan
from app.apps.chamsoc.models import ChamSocHocVien
from app.apps.thongbaos.models import ThongBao


@api_view(['GET'])
@permission_classes([IsAdminUser])
def overview_report(request):
    """
    Báo cáo tổng quan (Admin only)
    """
    # Lấy tham số từ query string
    from_date = request.GET.get('from')
    to_date = request.GET.get('to')
    
    # Xử lý ngày tháng
    if from_date:
        try:
            from_date = datetime.strptime(from_date, '%Y-%m-%d').date()
        except ValueError:
            from_date = None
    
    if to_date:
        try:
            to_date = datetime.strptime(to_date, '%Y-%m-%d').date()
        except ValueError:
            to_date = None
    
    # Tổng học viên mới
    hocvien_query = User.objects.filter(role__role_name='student')
    if from_date:
        hocvien_query = hocvien_query.filter(created_at__date__gte=from_date)
    if to_date:
        hocvien_query = hocvien_query.filter(created_at__date__lte=to_date)
    
    total_hocvien_moi = hocvien_query.count()
    
    # Doanh thu
    thanhtoan_query = ThanhToan.objects.all()
    if from_date:
        thanhtoan_query = thanhtoan_query.filter(ngay_dong__date__gte=from_date)
    if to_date:
        thanhtoan_query = thanhtoan_query.filter(ngay_dong__date__lte=to_date)
    
    doanh_thu = thanhtoan_query.aggregate(total=models.Sum('so_tien'))['total'] or 0
    
    # Tỷ lệ hoàn thành khóa học
    total_dangky = DangKyKhoaHoc.objects.count()
    hoan_thanh = DangKyKhoaHoc.objects.filter(phan_tram_hoan_thanh=100).count()
    ty_le_hoan_thanh = round((hoan_thanh / total_dangky * 100) if total_dangky > 0 else 0, 2)
    
    # Danh sách nợ học phí
    danh_sach_no = User.objects.filter(
        role__role_name='student',
        trang_thai_hoc_phi__in=['conno', 'chuadong']
    ).values('id', 'ten', 'email', 'sdt', 'trang_thai_hoc_phi')[:10]
    
    # Top khóa học
    top_khoahoc = KhoaHoc.objects.annotate(
        so_hoc_vien=models.Count('dangkykhoahoc')
    ).order_by('-so_hoc_vien')[:5]
    
    top_khoahoc_data = []
    for kh in top_khoahoc:
        top_khoahoc_data.append({
            'id': kh.id,
            'ten': kh.ten,
            'so_hoc_vien': kh.so_hoc_vien,
            'ty_le_hoan_thanh': kh.ty_le_hoan_thanh,
            'hoc_phi': kh.hoc_phi
        })
    
    # Thống kê theo tháng (6 tháng gần nhất)
    thang_stats = []
    for i in range(6):
        date = timezone.now() - timedelta(days=30*i)
        month_start = date.replace(day=1)
        month_end = (month_start + timedelta(days=32)).replace(day=1) - timedelta(days=1)

        month_hocvien = User.objects.filter(
            role__role_name='student',
            created_at__date__gte=month_start,
            created_at__date__lte=month_end
        ).count()

        month_doanhthu = ThanhToan.objects.filter(
            ngay_dong__date__gte=month_start,
            ngay_dong__date__lte=month_end
        ).aggregate(total=models.Sum('so_tien'))['total'] or 0

        thang_stats.append({
            'thang': month_start.strftime('%m/%Y'),
            'hoc_vien_moi': month_hocvien,
            'doanh_thu': month_doanhthu
        })
    
    return Response({
        'tong_quan': {
            'total_hocvien_moi': total_hocvien_moi,
            'doanh_thu': doanh_thu,
            'ty_le_hoan_thanh': ty_le_hoan_thanh,
            'total_hocvien': User.objects.filter(role__role_name='student').count(),
            'total_khoahoc': KhoaHoc.objects.count(),
            'total_dangky': total_dangky
        },
        'danh_sach_no_hoc_phi': list(danh_sach_no),
        'top_khoahoc': top_khoahoc_data,
        'thang_stats': thang_stats,
        'filters': {
            'from_date': from_date.isoformat() if from_date else None,
            'to_date': to_date.isoformat() if to_date else None
        }
    })


@api_view(['GET'])
@permission_classes([IsAdminUser])
def financial_report(request):
    """
    Báo cáo tài chính (Admin only)
    """
    # Thống kê thanh toán theo hình thức
    thanh_toan_stats = ThanhToan.objects.aggregate(
        total=models.Sum('so_tien'),
        tien_mat=models.Sum('so_tien', filter=models.Q(hinh_thuc='tienmat')),
        chuyen_khoan=models.Sum('so_tien', filter=models.Q(hinh_thuc='chuyenkhoan')),
        the=models.Sum('so_tien', filter=models.Q(hinh_thuc='the'))
    )
    
    # Thống kê theo tháng (12 tháng gần nhất)
    monthly_stats = []
    for i in range(12):
        date = timezone.now() - timedelta(days=30*i)
        month_start = date.replace(day=1)
        month_end = (month_start + timedelta(days=32)).replace(day=1) - timedelta(days=1)
        
        month_stats = ThanhToan.objects.filter(
            ngay_dong__date__gte=month_start,
            ngay_dong__date__lte=month_end
        ).aggregate(
            total=models.Sum('so_tien'),
            count=models.Count('id')
        )
        
        monthly_stats.append({
            'thang': month_start.strftime('%m/%Y'),
            'doanh_thu': month_stats['total'] or 0,
            'so_luong': month_stats['count'] or 0
        })
    
    return Response({
        'thanh_toan_stats': {
            'total': thanh_toan_stats['total'] or 0,
            'tien_mat': thanh_toan_stats['tien_mat'] or 0,
            'chuyen_khoan': thanh_toan_stats['chuyen_khoan'] or 0,
            'the': thanh_toan_stats['the'] or 0
        },
        'monthly_stats': monthly_stats
    })


@api_view(['GET'])
@permission_classes([IsAdminUser])
def academic_report(request):
    """
    Báo cáo học tập (Admin only)
    """
    # Thống kê khóa học
    khoahoc_stats = KhoaHoc.objects.aggregate(
        total=models.Count('id'),
        dang_mo=models.Count('id', filter=models.Q(trang_thai='dang_mo')),
        da_dong=models.Count('id', filter=models.Q(trang_thai='da_dong')),
        sap_mo=models.Count('id', filter=models.Q(trang_thai='sap_mo'))
    )
    
    # Thống kê đăng ký
    dangky_stats = DangKyKhoaHoc.objects.aggregate(
        total=models.Count('id'),
        dang_hoc=models.Count('id', filter=models.Q(trang_thai='dang_hoc')),
        hoan_thanh=models.Count('id', filter=models.Q(trang_thai='hoan_thanh')),
        tam_ngung=models.Count('id', filter=models.Q(trang_thai='tam_ngung')),
        huy_bo=models.Count('id', filter=models.Q(trang_thai='huy_bo'))
    )
    
    # Top giảng viên
    top_giangvien = KhoaHoc.objects.values('giang_vien').annotate(
        so_khoahoc=models.Count('id'),
        so_hocvien=models.Count('dangkykhoahoc')
    ).order_by('-so_hocvien')[:5]
    
    return Response({
        'khoahoc_stats': khoahoc_stats,
        'dangky_stats': dangky_stats,
        'top_giangvien': list(top_giangvien)
    })
