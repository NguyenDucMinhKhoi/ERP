# app/apps/diemdanhs/urls.py
from django.urls import path
from rest_framework.routers import DefaultRouter
from . import views
from .views import DiemDanhViewSet

app_name = 'diemdanhs'

router = DefaultRouter()
router.register(r'diemdanhs', DiemDanhViewSet, basename='diemdanh')

urlpatterns = [
    path('diemdanhs/', views.DiemDanhListView.as_view(), name='diemdanh-list'),
    path('diemdanhs/<uuid:pk>/', views.DiemDanhDetailView.as_view(), name='diemdanh-detail'),
    path('diemdanhs/me/', views.DiemDanhMeListView.as_view(), name='diemdanh-me'),
]

urlpatterns += router.urls