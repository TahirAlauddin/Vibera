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
    def format_response(response, duration_ms: float) -> Dict[str, Any]:
        """Format response data for logging."""
        return {
            "status_code": response.status_code,
            "duration_ms": round(duration_ms, 2),
            "content_type": response.get("Content-Type", ""),
        }
