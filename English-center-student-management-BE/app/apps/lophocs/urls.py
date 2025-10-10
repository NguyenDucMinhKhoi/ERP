# app/apps/lophocs/urls.py
from django.urls import path
from . import views

app_name = 'lophocs'

urlpatterns = [
    path('lophocs/', views.LopHocListView.as_view(), name='lophoc-list'),
    path('lophocs/<uuid:pk>/', views.LopHocDetailView.as_view(), name='lophoc-detail'),
    path('lophocs/<uuid:class_id>/add-student/', views.AddStudentToClassView.as_view(), name='lophoc-add-student'),
]