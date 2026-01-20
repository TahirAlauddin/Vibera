"""
Logging configuration for Vibera Django application.

This module provides:
- Logging utilities and helpers
- Request/response formatting utilities
- Helper functions for log file management

"""

import logging
from typing import Any, Dict


def get_logger(name: str) -> logging.Logger:
    """Get a configured logger instance."""
    return logging.getLogger(name)


class RequestResponseLogger:
    """Utility class for logging HTTP requests and responses."""

    @staticmethod
    def format_request(request) -> Dict[str, Any]:
        """Format request data for logging."""
        return {
            "method": request.method,
            "path": request.path,
            "query_params": dict(request.GET),
            "user": (
                str(request.user)
                if hasattr(request, "user") and request.user.is_authenticated
                else "anonymous"
            ),
            "ip_address": RequestResponseLogger._get_client_ip(request),
            "user_agent": request.META.get("HTTP_USER_AGENT", ""),
        }

    @staticmethod
    def format_response(response, duration_ms: float) -> Dict[str, Any]:
        """Format response data for logging."""
        return {
            "status_code": response.status_code,
            "duration_ms": round(duration_ms, 2),
            "content_type": response.get("Content-Type", ""),
        }

    @staticmethod
    def _get_client_ip(request) -> str:
        """Extract client IP address from request."""
        x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
        if x_forwarded_for:
            # Take the first IP in the chain (original client)
            ip = x_forwarded_for.split(",")[0].strip()
        else:
            ip = request.META.get("REMOTE_ADDR", "unknown")
        return ip
