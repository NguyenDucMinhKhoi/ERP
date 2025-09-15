from .base import *
from decouple import config

import logging
logging.disable(logging.DEBUG)

DEBUG = True

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': config('POSTGRES_DB', default='crm'),
        'USER': config('POSTGRES_USER', default='postgres'),
        'PASSWORD': config('POSTGRES_PASSWORD', default='postgres'),
        'HOST': config('POSTGRES_HOST', default='db'),
        'PORT': config('POSTGRES_PORT', default='5432'),
    }
}

# CORS cho môi trường dev (mở hết)
CORS_ALLOW_ALL_ORIGINS = True

# Logging cho môi trường dev (chi tiết hơn)
LOGGING["loggers"]["django"]["level"] = "DEBUG"
