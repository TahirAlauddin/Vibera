"""
Custom Django middleware for request/response logging and JWT authentication.
Logs all HTTP requests, responses, and exceptions with timing information.

This middleware is synchronous and non-blocking because:
- Logging calls use QueueHandler (configured in LOGGING settings)
- QueueHandler enqueues log records instantly without I/O
- QueueListener (started at app initialization) handles actual I/O in background
- Request/response cycle never waits for log writes
"""

import time
from typing import Callable

from django.conf import settings
from django.http import HttpRequest, HttpResponse, JsonResponse
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError, AuthenticationFailed

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
            if hasattr(request, "_start_time"):
                duration = time.time() - request._start_time
                duration_ms = duration * 1000

            logger.error(
                f"Unhandled exception: {type(exception).__name__} - {str(exception)} | "
                f"Request: {request.method} {request.path} | "
                f"Duration: {round(duration_ms, 2)}ms",
                exc_info=True,
            )
            raise

        # Calculate duration and log response
        duration_ms = 0
        if hasattr(request, "_start_time"):
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


class JWTAuthenticationMiddleware:
    """
    Middleware that validates JWT tokens for all API endpoints except public routes.
    
    This middleware:
    - Checks if the request path is a public endpoint (configurable)
    - For protected API routes, validates JWT tokens from the Authorization header
    - Sets the authenticated user on the request object for DRF compatibility
    - Returns appropriate error responses for authentication failures
    - Logs security events without exposing sensitive token data
    """

    def __init__(self, get_response: Callable):
        """
        Initialize middleware.

        Args:
            get_response: The next middleware or view in the chain
        """
        self.get_response = get_response
        self.jwt_authenticator = JWTAuthentication()
        
        # Get public paths from settings, with defaults
        self.public_paths = getattr(
            settings,
            'API_AUTH_MIDDLEWARE_PUBLIC_PATHS',
            [
                '/api/auth/',
                '/admin/',
                '/api/users/auth/2fa/',
            ]
        )

    def _is_public_path(self, path: str) -> bool:
        """
        Check if the request path is a public endpoint.

        Args:
            path: The request path

        Returns:
            True if the path is public, False otherwise
        """
        for public_path in self.public_paths:
            if path.startswith(public_path):
                return True
        return False

    def _extract_token(self, request: HttpRequest) -> str | None:
        """
        Extract JWT token from Authorization header.

        Args:
            request: The HTTP request

        Returns:
            The token string if found, None otherwise
        """
        auth_header = request.META.get('HTTP_AUTHORIZATION', '')
        if not auth_header:
            return None
        
        # Check for Bearer token format
        parts = auth_header.split()
        if len(parts) != 2 or parts[0].lower() != 'bearer':
            return None
        
        return parts[1]

    def _authenticate_token(self, request: HttpRequest, token: str) -> tuple | str | None:
        """
        Authenticate the JWT token and return user and token tuple.

        Args:
            request: The HTTP request
            token: The JWT token string

        Returns:
            Tuple of (user, validated_token) if successful,
            'INACTIVE_USER' if user is inactive,
            None otherwise
        """
        try:
            # Use DRF's JWT authentication to validate the token
            validated_token = self.jwt_authenticator.get_validated_token(token)
            user = self.jwt_authenticator.get_user(validated_token)
            return (user, validated_token)
        except (InvalidToken, TokenError) as e:
            # Log authentication failure without exposing token
            logger.warning(
                f"JWT authentication failed: {type(e).__name__} | "
                f"Request: {request.method} {request.path} | "
                f"IP: {request.META.get('REMOTE_ADDR', 'unknown')}"
            )
            return None
        except AuthenticationFailed as e:
            # Check if it's due to inactive user
            error_detail = str(e)
            if 'user_inactive' in error_detail or 'inactive' in error_detail.lower():
                # Return special marker for inactive user
                logger.warning(
                    f"Inactive user attempted access | "
                    f"Request: {request.method} {request.path} | "
                    f"IP: {request.META.get('REMOTE_ADDR', 'unknown')}"
                )
                return 'INACTIVE_USER'
            # Other authentication failures
            logger.warning(
                f"JWT authentication failed: {type(e).__name__} | "
                f"Request: {request.method} {request.path} | "
                f"IP: {request.META.get('REMOTE_ADDR', 'unknown')}"
            )
            return None
        except Exception as e:
            # Log unexpected errors
            logger.error(
                f"Unexpected error during JWT authentication: {type(e).__name__} - {str(e)} | "
                f"Request: {request.method} {request.path}",
                exc_info=True
            )
            return None

    def __call__(self, request: HttpRequest) -> HttpResponse:
        """
        Process request and validate JWT authentication for protected endpoints.

        Args:
            request: The HTTP request

        Returns:
            HTTP response (either error response or passes to next middleware)
        """
        # Only apply authentication to API routes
        # Non-API routes (like admin, static files) are handled by other middleware
        if not request.path.startswith('/api/'):
            return self.get_response(request)

        # Check if this is a public endpoint
        if self._is_public_path(request.path):
            return self.get_response(request)

        # For protected API endpoints, require JWT authentication
        token = self._extract_token(request)
        
        if not token:
            logger.warning(
                f"Missing JWT token | Request: {request.method} {request.path} | "
                f"IP: {request.META.get('REMOTE_ADDR', 'unknown')}"
            )
            return JsonResponse(
                {
                    "error": "Authentication required",
                    "detail": "Invalid or expired token"
                },
                status=401
            )

        # Authenticate the token
        auth_result = self._authenticate_token(request, token)
        
        if auth_result is None:
            return JsonResponse(
                {
                    "error": "Authentication required",
                    "detail": "Invalid or expired token"
                },
                status=401
            )

        # Check if user is inactive (handled during authentication)
        if auth_result == 'INACTIVE_USER':
            return JsonResponse(
                {
                    "error": "Authentication required",
                    "detail": "Invalid or expired token"
                },
                status=403
            )

        user, validated_token = auth_result

        # Additional check if user is active (defensive programming)
        if not user.is_active:
            logger.warning(
                f"Inactive user attempted access | User: {user.username} | "
                f"Request: {request.method} {request.path} | "
                f"IP: {request.META.get('REMOTE_ADDR', 'unknown')}"
            )
            return JsonResponse(
                {
                    "error": "Authentication required",
                    "detail": "Invalid or expired token"
                },
                status=403
            )

        # Set user and auth on request for DRF compatibility
        request.user = user
        request.auth = validated_token

        # Continue with the request
        return self.get_response(request)
