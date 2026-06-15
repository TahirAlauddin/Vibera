"""
Django staging settings for vibera project.

Inherits from base settings and adds staging-specific configurations.
"""

from settings.base import *  # noqa: F401, F403

# =============================================================================
# STAGING-SPECIFIC SETTINGS
# =============================================================================

DEBUG = True

# Add any staging-specific settings below
# For example:
# - Different database credentials
# - Staging-specific ALLOWED_HOSTS
# - Different logging levels for debugging
