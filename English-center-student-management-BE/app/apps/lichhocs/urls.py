# app/apps/lichhocs/urls.py
from django.urls import path
from rest_framework.routers import DefaultRouter
from . import views
from .views import LichHocViewSet

app_name = 'lichhocs'

router = DefaultRouter()
router.register(r'lichhocs', LichHocViewSet, basename='lichhoc')

urlpatterns = router.urls + [
    path('lichhocs/', views.LichHocListView.as_view(), name='lichhoc-list'),
    path('lichhocs/<uuid:pk>/', views.LichHocDetailView.as_view(), name='lichhoc-detail'),
    path('lichhocs/', views.LichHocBulkCreateView.as_view(), name='lichhoc-bulk-create'),
    path('lichhocs/class/<uuid:class_id>/', views.LichHocByClassView.as_view(), name='lichhoc-by-class'),  # NEW
]