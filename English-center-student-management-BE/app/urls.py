from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('app.apps.users.urls')),
    path('api/', include('app.apps.khoahocs.urls')),
    path('api/', include('app.apps.dangky.urls')),
    path('api/', include('app.apps.thanhtoans.urls')),
    path('api/', include('app.apps.chamsoc.urls')),
    path('api/', include('app.apps.thongbaos.urls')),
    path('api/', include('app.apps.reports.urls')),
    
    # API Documentation
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
