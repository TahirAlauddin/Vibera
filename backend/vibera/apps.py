"""
Django app configuration for vibera.
"""

from django.apps import AppConfig


class ViberaConfig(AppConfig):
    """App configuration for vibera project."""

    default_auto_field = "django.db.models.BigAutoField"
    name = "vibera"

    def ready(self):
        """Initialize app when Django starts."""
        # Import database logging to register signal handlers
        import vibera.db_logging  # noqa: F401
