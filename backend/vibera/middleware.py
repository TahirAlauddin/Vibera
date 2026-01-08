"""
Custom Django middleware for request/response logging.
Logs all HTTP requests, responses, and exceptions with timing information.
"""

import threading
import time
from typing import Callable

from django.http import HttpRequest, HttpResponse
from django.utils.deprecation import MiddlewareMixin

from vibera.logging_config import RequestResponseLogger, get_logger

logger = get_logger(__name__)


class RequestResponseLoggingMiddleware(MiddlewareMixin):
    """Middleware to log HTTP requests and responses."""
    
    @staticmethod
    def _log_async(log_func, message, exc_info=False):
        """Log in a background thread without blocking."""
        def _log():
            try:
                if exc_info:
                    log_func(message, exc_info=True)
                else:
                    log_func(message)
            except Exception:
                pass
        
        try:
            thread = threading.Thread(target=_log, daemon=True)
            thread.start()
        except Exception:
            try:
                if exc_info:
                    log_func(message, exc_info=True)
                else:
                    log_func(message)
            except Exception:
                pass
    
    def process_request(self, request: HttpRequest) -> None:
        """Log incoming request and store start time."""
        request._start_time = time.time()
        request_data = RequestResponseLogger.format_request(request)
        self._log_async(
            logger.info,
            f"Incoming request: {request.method} {request.path} | User: {request_data['user']} | IP: {request_data['ip_address']}"
        )
    
    def process_response(self, request: HttpRequest, response: HttpResponse) -> HttpResponse:
        """Calculate request duration and log response."""
        duration_ms = 0
        if hasattr(request, '_start_time'):
            duration = time.time() - request._start_time
            duration_ms = duration * 1000
        
        response_data = RequestResponseLogger.format_response(response, duration_ms)
        
        if response.status_code >= 500:
            log_level = logger.error
        elif response.status_code >= 400:
            log_level = logger.warning
        else:
            log_level = logger.info
        self._log_async(
            log_level,
            f"Outgoing response: {request.method} {request.path} | Status: {response.status_code} | Duration: {response_data['duration_ms']}ms"
        )
        
        return response
    
    def process_exception(self, request: HttpRequest, exception: Exception) -> None:
        """Log exceptions with full traceback."""
        duration_ms = 0
        if hasattr(request, '_start_time'):
            duration = time.time() - request._start_time
            duration_ms = duration * 1000
        self._log_async(
            logger.error,
            f"Unhandled exception: {type(exception).__name__} - {str(exception)} | Request: {request.method} {request.path} | Duration: {round(duration_ms, 2)}ms",
            exc_info=True
        )
