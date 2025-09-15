#!/bin/sh

set -e

echo "Đợi database..."
until nc -z "$POSTGRES_HOST" "$POSTGRES_PORT"; do
  echo "DB chưa sẵn sàng - chờ 1s..."
  sleep 1
done

echo "Database đã sẵn sàng!"

# Apply migrations
python manage.py migrate --noinput

# Nếu là production thì collectstatic
if [ "$DJANGO_SETTINGS_MODULE" = "app.settings.prod" ]; then
  echo "Thu thập staticfiles cho production..."
  python manage.py collectstatic --noinput
fi

# Nếu là development thì tạo superuser mặc định từ ENV
if [ "$DJANGO_SETTINGS_MODULE" = "app.settings.dev" ]; then
  echo "Kiểm tra superuser..."
  python manage.py shell <<EOF
from django.contrib.auth import get_user_model
import os
User = get_user_model()

username = os.getenv("DJANGO_SUPERUSER_NAME")
email = os.getenv("DJANGO_SUPERUSER_EMAIL")
password = os.getenv("DJANGO_SUPERUSER_PASSWORD")

if not User.objects.filter(username=username).exists():
    User.objects.create_superuser(username, email, password)
    print(f"✅ Superuser '{username}' đã được tạo ({username}/{password})")
else:
    print(f"ℹ️ Superuser '{username}' đã tồn tại")
EOF
fi

# Chạy server theo môi trường
if [ "$DJANGO_SETTINGS_MODULE" = "app.settings.dev" ]; then
  echo "Chạy Django development server..."
  exec python manage.py runserver 0.0.0.0:8000
else
  echo "Chạy Gunicorn production server..."
  exec gunicorn app.wsgi:application --bind 0.0.0.0:8000 --workers 4
fi
