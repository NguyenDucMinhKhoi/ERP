# app/apps/lichhocs/urls.py
from django.urls import path
from . import views

app_name = 'lichhocs'

urlpatterns = [
    path('lichhocs/', views.LichHocListView.as_view(), name='lichhoc-list'),
    path('lichhocs/<uuid:pk>/', views.LichHocDetailView.as_view(), name='lichhoc-detail'),
]