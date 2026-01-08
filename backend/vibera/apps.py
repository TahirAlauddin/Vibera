"""
Django app configuration for vibera.
"""

from django.apps import AppConfig


class ViberaConfig(AppConfig):
    """App configuration for vibera project."""
    
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'vibera'
