from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth import get_user_model
from app.apps.role.models import Role

class Command(BaseCommand):
    help = "Create a user with username, password, and role"

    def add_arguments(self, parser):
        parser.add_argument('--username', type=str, required=True, help='Username for the user')
        parser.add_argument('--password', type=str, required=True, help='Password for the user')
        parser.add_argument('--role', type=str, required=True, help='Role key (e.g. admin, employee, student)')

    def handle(self, *args, **options):
        username = options['username']
        password = options['password']
        role_name = options['role']

        User = get_user_model()
        try:
            role = Role.objects.get(role_name=role_name)
        except Role.DoesNotExist:
            raise CommandError(f"Role '{role_name}' does not exist.")

        if User.objects.filter(username=username).exists():
            self.stdout.write(self.style.WARNING(f"User '{username}' already exists."))
            return

        user = User.objects.create_user(
            username=username,
            password=password,
            role=role
        )
        self.stdout.write(self.style.SUCCESS(f"User '{username}' created with role '{role_name}'."))
