from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from app.apps.users.models import User  # Import User model directly

class TeacherListView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request):
        # Get all users with role 'giangvien'
        teachers = User.objects.filter(role='giangvien')
        data = [
            {
                "id": t.id,
                "name": f"{t.first_name} {t.last_name}".strip() or t.username,
                "email": t.email,
                "username": t.username,
            }
            for t in teachers
        ]
        return Response(data)
