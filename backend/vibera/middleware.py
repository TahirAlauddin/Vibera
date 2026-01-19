"""
Custom Django middleware for request/response logging.
Logs all HTTP requests, responses, and exceptions with timing information.

This middleware is synchronous and non-blocking because:
- Logging calls use QueueHandler (configured in LOGGING settings)
- QueueHandler enqueues log records instantly without I/O
- QueueListener (started at app initialization) handles actual I/O in background
- Request/response cycle never waits for log writes
"""

import time
from typing import Callable

from django.http import HttpRequest, HttpResponse

from vibera.logging_config import RequestResponseLogger, get_logger

logger = get_logger(__name__)


class RequestResponseLoggingMiddleware:
    """
    Synchronous middleware for request/response logging.
    
    Uses Python's QueueHandler for non-blocking behavior:
    - Logging calls return immediately (enqueue to queue)
    - QueueListener handles I/O in background thread
    - Compatible with both sync and async Django views via __call__
    """
    
    def __init__(self, get_response: Callable):
        """
        Initialize middleware.
        
        Args:
            get_response: The next middleware or view in the chain
        """
        self.get_response = get_response
    
    def __call__(self, request: HttpRequest) -> HttpResponse:
        """
        Process request and response.
        
        This method works for both sync and async views:
        - Django automatically handles async views
        - Logging is synchronous but non-blocking (QueueHandler)
        """
        # Store start time for duration calculation
        request._start_time = time.time()
        
        # Process request through the middleware chain
        try:
            response = self.get_response(request)
        except Exception as exception:
            # Log exception with duration
            duration_ms = 0
            if hasattr(request, '_start_time'):
                duration = time.time() - request._start_time
                duration_ms = duration * 1000
            
            logger.error(
                f"Unhandled exception: {type(exception).__name__} - {str(exception)} | "
                f"Request: {request.method} {request.path} | "
                f"Duration: {round(duration_ms, 2)}ms",
                exc_info=True
            )
            raise
        
        # Calculate duration and log response
        duration_ms = 0
        if hasattr(request, '_start_time'):
            duration = time.time() - request._start_time
            duration_ms = duration * 1000
        
        response_data = RequestResponseLogger.format_response(response, duration_ms)
        
        # Choose log level based on status code
        if response.status_code >= 500:
            logger.error(
                f"Outgoing response: {request.method} {request.path} | "
                f"Status: {response.status_code} | Duration: {response_data['duration_ms']}ms"
            )
        elif response.status_code >= 400:
            logger.warning(
                f"Outgoing response: {request.method} {request.path} | "
                f"Status: {response.status_code} | Duration: {response_data['duration_ms']}ms"
            )
        
        return response