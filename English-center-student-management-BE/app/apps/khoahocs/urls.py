from django.urls import path
from . import views

app_name = 'khoahocs'

urlpatterns = [
    path('khoahocs/', views.KhoaHocListView.as_view(), name='khoahoc-list'),
    path('khoahocs/<uuid:pk>/', views.KhoaHocDetailView.as_view(), name='khoahoc-detail'),
    path('khoahocs/public/', views.KhoaHocPublicListView.as_view(), name='khoahoc-public'),
    path('khoahocs/stats/', views.khoahoc_stats, name='khoahoc-stats'),
]
