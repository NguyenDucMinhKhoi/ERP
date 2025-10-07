#!/usr/bin/env python
"""
Script to test KhoaHoc model fields and serializer
"""
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'app.settings.dev')
sys.path.append('.')

try:
    django.setup()
    
    from app.apps.khoahocs.models import KhoaHoc
    from app.apps.khoahocs.serializers import KhoaHocSerializer
    
    print("=== KIỂM TRA CẤU TRÚC MODEL KHOAHOC ===")
    print("\nCác trường trong model KhoaHoc:")
    for field in KhoaHoc._meta.fields:
        print(f"- {field.name}: {field.__class__.__name__}")
    
    print("\nCác properties của model:")
    properties = [attr for attr in dir(KhoaHoc) if isinstance(getattr(KhoaHoc, attr, None), property)]
    for prop in properties:
        print(f"- {prop}")
    
    print("\n=== KIỂM TRA SERIALIZER ===")
    serializer = KhoaHocSerializer()
    print("\nCác fields trong serializer:")
    for field_name in serializer.fields:
        print(f"- {field_name}: {serializer.fields[field_name].__class__.__name__}")
    
    print("\n=== KIỂM TRA DỮ LIỆU MẪU ===")
    total_courses = KhoaHoc.objects.count()
    print(f"Tổng số khóa học trong DB: {total_courses}")
    
    if total_courses > 0:
        sample_course = KhoaHoc.objects.first()
        print(f"\nKhóa học mẫu: {sample_course}")
        print(f"Số học viên: {sample_course.so_hoc_vien}")
        print(f"Tỷ lệ hoàn thành: {sample_course.ty_le_hoan_thanh}")
        
        # Test serializer
        serialized = KhoaHocSerializer(sample_course)
        print(f"\nDữ liệu serialized:")
        for key, value in serialized.data.items():
            print(f"  {key}: {value}")
    else:
        print("Không có dữ liệu khóa học trong DB")
        
except Exception as e:
    print(f"Lỗi: {e}")
    import traceback
    traceback.print_exc()