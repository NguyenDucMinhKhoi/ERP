from django.urls import path
from . import views

app_name = 'thongbaos'

urlpatterns = [
    path('thongbaos/', views.ThongBaoListView.as_view(), name='thongbao-list'),
    path('thongbaos/<uuid:pk>/', views.ThongBaoDetailView.as_view(), name='thongbao-detail'),
    path('thongbaos/public/', views.ThongBaoPublicListView.as_view(), name='thongbao-public'),
    path('thongbaos/me/', views.ThongBaoMyListView.as_view(), name='thongbao-me'),
    path('thongbaos/stats/', views.thongbao_stats, name='thongbao-stats'),
]
