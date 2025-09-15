from django.urls import path
from . import views

app_name = 'thanhtoans'

urlpatterns = [
    path('thanhtoans/', views.ThanhToanListView.as_view(), name='thanhtoan-list'),
    path('thanhtoans/<uuid:pk>/', views.ThanhToanDetailView.as_view(), name='thanhtoan-detail'),
    path('thanhtoans/me/', views.ThanhToanMyListView.as_view(), name='thanhtoan-me'),
    path('thanhtoans/stats/', views.thanhtoan_stats, name='thanhtoan-stats'),
]
