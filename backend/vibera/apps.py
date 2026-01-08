"""
Django app configuration for vibera.
Initializes QueueListener for non-blocking logging.
"""

import logging
from logging.handlers import QueueListener

from django.apps import AppConfig


class ViberaConfig(AppConfig):
    """App configuration for vibera project."""
    
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'vibera'
    
    def ready(self):
        """
        Initialize QueueListener when Django starts.
        
        QueueListener runs in a background thread (managed by Python's logging
        infrastructure) and handles actual I/O (stdout writes). This is the
        only place where threading is used, and it's part of Python's standard
        logging infrastructure, not application code.
        
        This makes logging non-blocking:
        - Application code calls logger.info() -> QueueHandler enqueues instantly
        - QueueListener (background thread) dequeues and writes to stdout
        - Request/response cycle never waits for I/O
        """
        # Import here to avoid circular imports
        import sys
        from django.conf import settings
        
        # Get the queue from settings
        log_queue = settings.LOG_QUEUE
        
        # Get formatter name from settings
        formatter_name = settings.LOG_FORMATTER
        
        # Create stdout handler with formatter from LOGGING config
        formatter_config = settings.LOGGING['formatters'].get(
            formatter_name,
            settings.LOGGING['formatters']['verbose']
        )
        formatter = logging.Formatter(
            formatter_config['format'],
            style=formatter_config.get('style', '{'),
            datefmt=formatter_config.get('datefmt', '%Y-%m-%d %H:%M:%S')
        )
        stdout_handler = logging.StreamHandler(sys.stdout)
        stdout_handler.setFormatter(formatter)
        stdout_handler.setLevel(logging.DEBUG)
        
        # Start QueueListener
        # This runs in a background daemon thread managed by Python's logging
        # It dequeues log records and writes them to stdout
        # The thread is a daemon thread, so it will stop when the main process exits
        queue_listener = QueueListener(log_queue, stdout_handler, respect_handler_level=True)
        queue_listener.start()
        
        # Store reference to prevent garbage collection
        # QueueListener will stop automatically when the process exits
        self._queue_listener = queue_listener
