"""
ASGI config for vibera project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/6.0/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application

# Default to production settings for ASGI deployments
# Set DJANGO_SETTINGS_MODULE environment variable to override
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "settings.production")

application = get_asgi_application()
