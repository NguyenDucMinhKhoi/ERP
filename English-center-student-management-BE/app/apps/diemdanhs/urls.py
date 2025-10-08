# app/apps/diemdanhs/urls.py
from django.urls import path
from . import views

app_name = 'diemdanhs'

urlpatterns = [
    path('diemdanhs/', views.DiemDanhListView.as_view(), name='diemdanh-list'),
    path('diemdanhs/<uuid:pk>/', views.DiemDanhDetailView.as_view(), name='diemdanh-detail'),
    path('diemdanhs/me/', views.DiemDanhMyListView.as_view(), name='diemdanh-me'),
]