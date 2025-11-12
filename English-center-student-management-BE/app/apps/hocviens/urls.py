from django.urls import path
from . import views
from .views import HocVienStatsView

app_name = 'hocviens'

urlpatterns = [
    path('hocviens/', views.HocVienListView.as_view(), name='hocvien-list'),
    path('hocviens/<uuid:pk>/', views.HocVienDetailView.as_view(), name='hocvien-detail'),
    path('hocviens/me/', views.HocVienMyProfileView.as_view(), name='hocvien-me'),
    path('hocviens/leads/', views.LeadsListCreateView.as_view(), name='hocvien-leads'),
    path('hocviens/leads/<uuid:pk>/convert/', views.LeadConvertView.as_view(), name='hocvien-lead-convert'),
    path('hocviens/<uuid:lead_id>/contact-note/', views.LeadContactNoteView.as_view(), name='hocvien-contact-note'),
    path('hocviens/stats/', HocVienStatsView.as_view(), name='hocvien-stats'),
]
