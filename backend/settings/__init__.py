"""
Django settings package for vibera project.

This package contains environment-specific settings modules:
- base.py: Common settings shared across all environments
- stagging.py: Staging environment settings (inherits from base)
- production.py: Production environment settings (inherits from base)

Usage:
    Set DJANGO_SETTINGS_MODULE to one of:
    - settings.stagging (for staging)
    - settings.production (for production)
    
    Or import directly:
    from settings.base import *  # For base settings
"""
