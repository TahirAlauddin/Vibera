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
    """
    Get a configured logger instance.
    
    WHAT: Factory function that returns a properly configured logger.
    WHY: Ensures all loggers use consistent configuration and formatting.
    WHEN: Use this instead of logging.getLogger() to ensure proper setup.
    
    Args:
        name: Logger name (typically __name__ of the calling module)
        
    Returns:
        Configured Logger instance
    """
    return logging.getLogger(name)


class RequestResponseLogger:
    """
    Utility class for logging HTTP requests and responses.
    
    WHAT: Provides methods to format and log request/response data consistently.
    WHY: Centralizes request/response logging logic for consistency and maintainability.
    WHEN: Used by middleware to log incoming requests and outgoing responses.
    """
    
    @staticmethod
    def format_request(request) -> Dict[str, Any]:
        """
        Format request data for logging.
        
        WHAT: Extracts and formats relevant request information.
        WHY: Standardizes request logging format across the application.
        WHEN: Called when a request is received.
        
        Args:
            request: Django HttpRequest object
            
        Returns:
            Dictionary with formatted request data
        """
        return {
            'method': request.method,
            'path': request.path,
            'query_params': dict(request.GET),
            'user': str(request.user) if hasattr(request, 'user') and request.user.is_authenticated else 'anonymous',
            'ip_address': RequestResponseLogger._get_client_ip(request),
            'user_agent': request.META.get('HTTP_USER_AGENT', ''),
        }
    
    @staticmethod
    def format_response(response, duration_ms: float) -> Dict[str, Any]:
        """
        Format response data for logging.
        
        WHAT: Extracts and formats relevant response information.
        WHY: Standardizes response logging format across the application.
        WHEN: Called when a response is sent.
        
        Args:
            response: Django HttpResponse object
            duration_ms: Request processing duration in milliseconds
            
        Returns:
            Dictionary with formatted response data
        """
        return {
            'status_code': response.status_code,
            'duration_ms': round(duration_ms, 2),
            'content_type': response.get('Content-Type', ''),
        }
    
    @staticmethod
    def _get_client_ip(request) -> str:
        """
        Extract client IP address from request.
        
        WHAT: Gets the real client IP, handling proxy headers.
        WHY: Important for security logging and rate limiting.
        WHEN: Called when logging request information.
        
        Args:
            request: Django HttpRequest object
            
        Returns:
            Client IP address as string
        """
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            # Take the first IP in the chain (original client)
            ip = x_forwarded_for.split(',')[0].strip()
        else:
            ip = request.META.get('REMOTE_ADDR', 'unknown')
        return ip
