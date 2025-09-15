from django.urls import path
from . import views

app_name = 'reports'

urlpatterns = [
    path('reports/overview/', views.overview_report, name='overview-report'),
    path('reports/financial/', views.financial_report, name='financial-report'),
    path('reports/academic/', views.academic_report, name='academic-report'),
]
