from django.urls import path
from . import views

app_name = 'hocviens'

urlpatterns = [
    path('hocviens/', views.HocVienListView.as_view(), name='hocvien-list'),
    path('hocviens/<uuid:pk>/', views.HocVienDetailView.as_view(), name='hocvien-detail'),
    path('hocviens/me/', views.HocVienMyProfileView.as_view(), name='hocvien-me'),
    path('hocviens/stats/', views.hocvien_stats, name='hocvien-stats'),
]
