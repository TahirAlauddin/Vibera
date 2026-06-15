"""
Django production settings for vibera project.

Inherits from base settings and adds production-specific configurations.
"""

from settings.base import *  # noqa: F401, F403

# =============================================================================
# PRODUCTION-SPECIFIC SETTINGS
# =============================================================================

DEBUG = False

# Security settings for production
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = "DENY"

# HTTPS settings (uncomment when using HTTPS)
# SECURE_SSL_REDIRECT = True
# SESSION_COOKIE_SECURE = True
# CSRF_COOKIE_SECURE = True
# SECURE_HSTS_SECONDS = 31536000  # 1 year
# SECURE_HSTS_INCLUDE_SUBDOMAINS = True
# SECURE_HSTS_PRELOAD = True

# Add any production-specific settings below
