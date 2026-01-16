"""
Database logging for PostgreSQL connections, slow queries, and errors.

This module provides:
- Connection logging (open/close events)
- Slow query detection and logging
- Database error logging

Uses Django's database signals and wraps the database cursor to intercept queries.
"""

import logging
import os
import time
from typing import Any, Dict

from django.db import connection
from django.db.backends.signals import connection_created
from django.dispatch import receiver

from vibera.logging_config import get_logger

logger = get_logger('django.db.backends.postgresql')

# Slow query threshold in milliseconds (default: 1000ms)
SLOW_QUERY_THRESHOLD_MS = float(os.getenv('DB_SLOW_QUERY_THRESHOLD_MS', '1000.0'))


class LoggingCursorWrapper:
    """Wrapper for database cursor to log queries and errors."""
    
    def __init__(self, cursor, connection):
        """
        Initialize cursor wrapper.
        
        Args:
            cursor: The database cursor to wrap
            connection: The database connection
        """
        self.cursor = cursor
        self.connection = connection
    
    def __getattr__(self, attr):
        """Delegate attribute access to the underlying cursor."""
        return getattr(self.cursor, attr)
    
    def __enter__(self):
        """Support context manager protocol."""
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        """Support context manager protocol."""
        return False
    
    def execute(self, sql, params=None):
        """
        Execute SQL query with logging.
        """
        start_time = time.time()
        error_occurred = False
        error_message = None
        
        try:
            result = self.cursor.execute(sql, params)
            return result
        except Exception as e:
            error_occurred = True
            error_message = str(e)
            error_type = type(e).__name__
            
            # Log database errors
            logger.error(
                f"Database error: {error_type} - {error_message} | "f"SQL: {self._format_sql(sql)} | " f"Params: {self._format_params(params)}",
                exc_info=True
            )
            raise
        finally:
            execution_time = (time.time() - start_time) * 1000  # Convert to milliseconds
            
            # Log slow queries
            if execution_time >= SLOW_QUERY_THRESHOLD_MS:
                logger.warning(
                    f"Slow query detected: {execution_time:.2f}ms | " f"SQL: {self._format_sql(sql)} | "f"Params: {self._format_params(params)}"
                )
    
    def executemany(self, sql, param_list):
        """
        Execute SQL query multiple times with logging.
        
        Args:
            sql: SQL query string
            param_list: List of parameter tuples
        """
        start_time = time.time()
        error_occurred = False
        error_message = None
        
        try:
            result = self.cursor.executemany(sql, param_list)
            return result
        except Exception as e:
            error_occurred = True
            error_message = str(e)
            error_type = type(e).__name__
            
            # Log database errors
            logger.error(
                f"Database error (executemany): {error_type} - {error_message} | "f"SQL: {self._format_sql(sql)} | "f"Param count: {len(param_list) if param_list else 0}",
                exc_info=True
            )
            raise
        finally:
            execution_time = (time.time() - start_time) * 1000
            
            # Log slow queries
            if execution_time >= SLOW_QUERY_THRESHOLD_MS:
                logger.warning(
                    f"Slow query detected (executemany): {execution_time:.2f}ms | "f"SQL: {self._format_sql(sql)} | " f"Param count: {len(param_list) if param_list else 0}"
                )
    
    def _format_sql(self, sql: str) -> str:
        """Format SQL query for logging (truncate if too long)."""
        max_length = 500
        sql_str = str(sql)
        if len(sql_str) > max_length:
            return sql_str[:max_length] + "..."
        return sql_str
    
    def _format_params(self, params) -> str:
        """Format query parameters for logging."""
        if params is None:
            return "None"
        if isinstance(params, (list, tuple)):
            if len(params) > 10:
                return f"{len(params)} params (truncated)"
            return str(params)
        return str(params)


@receiver(connection_created)
def log_connection_created(sender, connection, **kwargs):
    """
    Log when a database connection is created.
    
    """
    db_name = connection.settings_dict.get('NAME', 'unknown')
    db_host = connection.settings_dict.get('HOST', 'localhost')
    db_port = connection.settings_dict.get('PORT', '5432')
    db_user = connection.settings_dict.get('USER', 'unknown')
    
    logger.info(
        f"Database connection created | "f"Database: {db_name} | "f"Host: {db_host}:{db_port} | "f"User: {db_user}"
    )
    
    # Wrap the cursor method to intercept queries
    if not hasattr(connection, '_original_cursor'):
        connection._original_cursor = connection.cursor
        
        def wrapped_cursor(*args, **kwargs):
            """Return wrapped cursor for query logging."""
            cursor_obj = connection._original_cursor(*args, **kwargs)
            return LoggingCursorWrapper(cursor_obj, connection)
        
        connection.cursor = wrapped_cursor
    
    # Wrap the close method to log connection closure
    if not hasattr(connection, '_original_close'):
        connection._original_close = connection.close
        
        def wrapped_close():
            """Log connection closure before closing."""
            db_name = connection.settings_dict.get('NAME', 'unknown')
            db_host = connection.settings_dict.get('HOST', 'localhost')
            logger.info(
                f"Database connection closed | "f"Database: {db_name} | "f"Host: {db_host}"
            )
            return connection._original_close()
        
        connection.close = wrapped_close


