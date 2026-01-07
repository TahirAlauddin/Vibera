"""
Django management command to test and validate logging to stdout.

This command tests that logs are properly written to stdout and can be
accessed via docker logs.

Usage:
    python manage.py test_logging
"""

from django.core.management.base import BaseCommand
from vibera.logging_config import get_logger

logger = get_logger(__name__)


class Command(BaseCommand):
    help = 'Test logging to stdout to validate docker logs access'

    def handle(self, *args, **options):
        """Test logging at different levels to validate stdout output."""
        
        self.stdout.write(self.style.SUCCESS('\n=== Testing Logging to stdout ===\n'))
        
        # Test different log levels
        logger.debug("DEBUG: This is a debug message")
        logger.info("INFO: This is an info message")
        logger.warning("WARNING: This is a warning message")
        logger.error("ERROR: This is an error message")
        logger.critical("CRITICAL: This is a critical message")
        
        # Test logger from different modules
        from vibera.middleware import logger as middleware_logger
        middleware_logger.info("INFO from vibera.middleware: Middleware logger test")
        
        # Test with extra context
        logger.info(
            "INFO with context: Testing logging with extra data",
            extra={'test_id': '12345', 'test_type': 'stdout_validation'}
        )
        
        # Test exception logging
        try:
            raise ValueError("Test exception for logging validation")
        except ValueError as e:
            logger.error(
                "ERROR with exception: Caught test exception",
                exc_info=True
            )
        
        self.stdout.write(self.style.SUCCESS('\n=== Logging Test Complete ===\n'))
        self.stdout.write(
            self.style.WARNING(
                'If running in Docker, check logs with: docker logs <container_name>'
            )
        )
        self.stdout.write(
            'All log messages above should appear in both stdout and log files.\n'
        )
