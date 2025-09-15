import uuid
from django.db import models
from django.utils import timezone


class BaseModel(models.Model):
    """
    Base model với các trường chung
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True
        ordering = ['-created_at']
