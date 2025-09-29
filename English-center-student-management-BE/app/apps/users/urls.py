from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

app_name = 'users'

urlpatterns = [
    # Authentication
    path('auth/register/', views.RegisterView.as_view(), name='register'),  # POST
    path('auth/login/', views.LoginView.as_view(), name='login'),           # POST
    path('auth/logout/', views.LogoutView.as_view(), name='logout'),        # POST
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),# POST

    # User management (Admin only)
    path('users/', views.UserListView.as_view(), name='user-list'),         # GET, POST
    path('users/<uuid:pk>/', views.UserDetailView.as_view(), name='user-detail'), # GET, PUT, PATCH, DELETE

    # Profile and password
    path('auth/me/', views.me, name='me'),                                  # GET
    path('auth/profile/', views.UserProfileView.as_view(), name='profile'), # GET, PUT, PATCH
    path('auth/change-password/', views.ChangePasswordView.as_view(), name='change-password'), # POST
]
