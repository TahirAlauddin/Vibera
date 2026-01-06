"""
Custom Django middleware for request/response logging.

This module provides middleware to:
- Log all incoming HTTP requests
- Log all outgoing HTTP responses
- Log request processing duration
- Capture exceptions and log them with context

WHY: Middleware runs on every request, making it the perfect place to capture
     request/response data without modifying individual views.
WHEN: Executes automatically for every HTTP request/response cycle.
"""

import time
import traceback
from typing import Callable

from django.http import HttpRequest, HttpResponse
from django.utils.deprecation import MiddlewareMixin

from vibera.logging_config import RequestResponseLogger, get_logger

# Get logger instance for this module
logger = get_logger(__name__)


class RequestResponseLoggingMiddleware(MiddlewareMixin):
    """
    Middleware to log HTTP requests and responses.
    
    WHAT: Intercepts requests and responses to log them with metadata.
    WHY: Provides visibility into API usage, performance, and errors.
    WHEN: Runs automatically for every request (before view) and response (after view).
    
    HOW: Uses Django's MiddlewareMixin which provides compatibility with both
         old and new middleware styles. Captures timing information and logs
         both request and response data.
    """
    
    def process_request(self, request: HttpRequest) -> None:
        """
        Process incoming request - called before view execution.
        
        WHAT: Logs request details and stores start time for duration calculation.
        WHY: Captures request metadata before any processing happens.
        WHEN: Automatically called by Django for each request.
        
        Args:
            request: Django HttpRequest object
        """
        # Store start time on request object for duration calculation
        # Using request object as storage is safe - it's request-scoped
        request._start_time = time.time()
        
        # Log incoming request
        request_data = RequestResponseLogger.format_request(request)
        logger.info(
            f"Incoming request: {request.method} {request.path} | User: {request_data['user']} | IP: {request_data['ip_address']}"
        )
    
    def process_response(self, request: HttpRequest, response: HttpResponse) -> HttpResponse:
        """
        Process outgoing response - called after view execution.
        
        WHAT: Calculates request duration and logs response details.
        WHY: Captures response metadata and performance metrics.
        WHEN: Automatically called by Django after view returns response.
        
        Args:
            request: Django HttpRequest object
            response: Django HttpResponse object
            
        Returns:
            HttpResponse (unchanged, just logged)
        """
        # Calculate request processing duration
        duration_ms = 0
        if hasattr(request, '_start_time'):
            duration = time.time() - request._start_time
            duration_ms = duration * 1000  # Convert to milliseconds
        
        # Format and log response
        response_data = RequestResponseLogger.format_response(response, duration_ms)
        request_data = RequestResponseLogger.format_request(request)
        
        # Log at appropriate level based on status code
        if response.status_code >= 500:
            # Server errors - log as error
            log_level = logger.error
        elif response.status_code >= 400:
            # Client errors - log as warning
            log_level = logger.warning
        else:
            # Success - log as info
            log_level = logger.info
        
        log_level(
            f"Outgoing response: {request.method} {request.path} | Status: {response.status_code} | Duration: {response_data['duration_ms']}ms"
        )
        
        return response
    
    def process_exception(self, request: HttpRequest, exception: Exception) -> None:
        """
        Process exceptions raised during request handling.
        
        WHAT: Logs exceptions with full traceback and request context.
        WHY: Critical for debugging - captures what went wrong and where.
        WHEN: Automatically called by Django when an exception is raised in a view.
        
        Args:
            request: Django HttpRequest object
            exception: The exception that was raised
        """
        # Calculate duration even for failed requests
        duration_ms = 0
        if hasattr(request, '_start_time'):
            duration = time.time() - request._start_time
            duration_ms = duration * 1000
        
        # Format request data
        request_data = RequestResponseLogger.format_request(request)
        
        # Get full exception traceback
        exc_traceback = traceback.format_exc()
        
        # Log exception with full context
        logger.error(
            f"Unhandled exception: {type(exception).__name__} - {str(exception)} | Request: {request.method} {request.path} | Duration: {round(duration_ms, 2)}ms",
            exc_info=True,  # Includes exception info in log
        )
