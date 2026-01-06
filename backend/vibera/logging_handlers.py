"""
Custom logging handlers for file rotation.

This module provides:
- Date-based file rotation handler with custom naming
- Size-based file rotation handler
- Helper functions for log file path management

WHY: Provides flexible file rotation strategies (date-based and size-based)
     with configurable options via environment variables.
WHEN: Used by Django logging configuration to write logs to files.
"""

import logging
import os
from datetime import datetime
from logging.handlers import RotatingFileHandler, TimedRotatingFileHandler
from pathlib import Path


class DateRotatingFileHandler(TimedRotatingFileHandler):
    """
    Custom date-based rotating file handler with custom filename format.
    
    WHAT: Rotates log files daily with format like "6Dec2026.logs"
    WHY: Provides daily log files with human-readable date format
    WHEN: Used when LOG_ROTATION_TYPE is set to 'date'
    
    HOW: Extends TimedRotatingFileHandler and overrides filename generation
         to use custom date format (day + abbreviated month + year).
    """
    
    def __init__(self, log_dir: Path, *args, **kwargs):
        """
        Initialize date-based rotating file handler.
        
        Args:
            log_dir: Directory where log files will be stored
            *args, **kwargs: Additional arguments passed to parent class
        """
        # Ensure log directory exists
        log_dir.mkdir(parents=True, exist_ok=True)
        
        # Generate filename with current date
        filename = self._generate_filename(log_dir)
        
        # Initialize parent with daily rotation
        super().__init__(
            filename=filename,
            when='midnight',  # Rotate at midnight
            interval=1,  # Daily rotation
            backupCount=0,  # Keep all old files (can be configured)
            *args,
            **kwargs
        )
    
    def _generate_filename(self, log_dir: Path) -> str:
        """
        Generate filename with date format: day + abbreviated month + year + .logs
        
        WHAT: Creates filename like "6Dec2026.logs"
        WHY: Human-readable date format for easy identification
        WHEN: Called during initialization and when rotation occurs
        
        Args:
            log_dir: Directory for log files
            
        Returns:
            Full path to log file
        """
        now = datetime.now()
        # Format: day + abbreviated month + year (e.g., "6Dec2026")
        date_str = now.strftime('%d%b%Y')
        filename = f"{date_str}.logs"
        return str(log_dir / filename)
    
    def doRollover(self):
        """
        Perform log rotation - called when a new day starts.
        
        WHAT: Creates new log file with new date and closes old one
        WHY: Ensures each day gets its own log file
        WHEN: Automatically called at midnight or when file needs rotation
        """
        # Generate new filename for today
        new_filename = self._generate_filename(Path(self.baseFilename).parent)
        
        # If filename changed (new day), update it
        if new_filename != self.baseFilename:
            self.baseFilename = new_filename
        
        # Call parent's rollover logic
        super().doRollover()


class SizeRotatingFileHandler(RotatingFileHandler):
    """
    Custom size-based rotating file handler.
    
    WHAT: Rotates log files when they reach a specified size
    WHY: Prevents log files from growing too large
    WHEN: Used when LOG_ROTATION_TYPE is set to 'size'
    
    HOW: Extends RotatingFileHandler with configurable size limits.
    """
    
    def __init__(self, log_dir: Path, max_bytes: int = 5 * 1024 * 1024, backup_count: int = 10, *args, **kwargs):
        """
        Initialize size-based rotating file handler.
        
        Args:
            log_dir: Directory where log files will be stored
            max_bytes: Maximum file size before rotation (default: 5MB)
            backup_count: Number of backup files to keep (default: 10)
            *args, **kwargs: Additional arguments passed to parent class
        """
        # Ensure log directory exists
        log_dir.mkdir(parents=True, exist_ok=True)
        
        # Use a single log file name for size-based rotation
        filename = str(log_dir / 'vibera.log')
        
        # Initialize parent with size-based rotation
        super().__init__(
            filename=filename,
            maxBytes=max_bytes,
            backupCount=backup_count,
            *args,
            **kwargs
        )


def get_log_directory() -> Path:
    """
    Get the log directory path.
    
    WHAT: Returns path to logs directory (backend/logs/)
    WHY: Centralizes log directory location
    WHEN: Called when setting up file handlers
    
    Returns:
        Path object pointing to logs directory
    """
    # Get BASE_DIR from settings (two levels up from this file)
    # backend/vibera/logging_handlers.py -> backend/logs/
    base_dir = Path(__file__).resolve().parent.parent
    log_dir = base_dir / 'logs'
    return log_dir
