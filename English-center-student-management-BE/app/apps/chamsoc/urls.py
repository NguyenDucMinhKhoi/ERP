from django.urls import path
from . import views

app_name = 'chamsoc'

urlpatterns = [
    path('chamsoc/', views.ChamSocHocVienListView.as_view(), name='chamsoc-list'),
    path('chamsoc/<uuid:pk>/', views.ChamSocHocVienDetailView.as_view(), name='chamsoc-detail'),
    path('chamsoc/me/', views.ChamSocHocVienMyListView.as_view(), name='chamsoc-me'),
    path('chamsoc/stats/', views.chamsoc_stats, name='chamsoc-stats'),
]
