from django.urls import path
from . import views

app_name = 'dangky'

urlpatterns = [
    path('dangky/', views.DangKyKhoaHocListView.as_view(), name='dangky-list'),
    path('dangky/<uuid:pk>/', views.DangKyKhoaHocDetailView.as_view(), name='dangky-detail'),
    path('dangky/me/', views.DangKyKhoaHocMyListView.as_view(), name='dangky-me'),
    path('dangky/stats/', views.dangky_stats, name='dangky-stats'),
]
