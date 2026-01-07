"""
Custom logging handlers for file rotation.

This module provides:
- Date-based file rotation handler with custom naming
- Size-based file rotation handler
- Automatic cleanup of old log files
- Helper functions for log file path management

WHY: Provides flexible file rotation strategies (date-based and size-based)
     with configurable options via environment variables.
WHEN: Used by Django logging configuration to write logs to files.
"""

import logging
import os
from datetime import datetime, timedelta
from logging.handlers import RotatingFileHandler, TimedRotatingFileHandler
from pathlib import Path


class DateRotatingFileHandler(TimedRotatingFileHandler):
    """
    Custom date-based rotating file handler with custom filename format.
    
    WHAT: Rotates log files daily with format like "2026-Jan-07.logs"
    WHY: Provides daily log files with human-readable date format
    WHEN: Used when LOG_ROTATION_TYPE is set to 'date'
    
    HOW: Extends TimedRotatingFileHandler and overrides filename generation
         to use custom date format (year-month-day). Automatically cleans up
         old log files based on retention days.
    """
    
    def __init__(self, log_dir: Path, retention_days: int = 30, *args, **kwargs):
        """
        Initialize date-based rotating file handler.
        
        Args:
            log_dir: Directory where log files will be stored
            retention_days: Number of days to keep log files (default: 30)
            *args, **kwargs: Additional arguments passed to parent class
        """
        # Ensure log directory exists
        log_dir.mkdir(parents=True, exist_ok=True)
        
        # Store log directory and retention for cleanup
        self.log_dir = log_dir
        self.retention_days = retention_days
        
        # Generate filename with current date
        filename = self._generate_filename(log_dir)
        
        # Initialize parent with daily rotation
        # backupCount=0 means keep all files, but we'll clean up manually
        super().__init__(
            filename=filename,
            when='midnight',  # Rotate at midnight
            interval=1,  # Daily rotation
            backupCount=0,  # Keep all files, cleanup handled manually
            *args,
            **kwargs
        )
        
        # Clean up old files on initialization
        self._cleanup_old_files()
    
    def _generate_filename(self, log_dir: Path) -> str:
        """
        Generate filename with date format: year-month-day + .logs
        
        WHAT: Creates filename like "2026-Jan-07.logs"
        WHY: Human-readable date format for easy identification
        WHEN: Called during initialization and when rotation occurs
        
        Args:
            log_dir: Directory for log files
            
        Returns:
            Full path to log file
        """
        now = datetime.now()
        # Format: year-month-day (e.g., "2026-Jan-07")
        date_str = now.strftime('%Y-%b-%d')
        filename = f"{date_str}.logs"
        return str(log_dir / filename)
    
    def _cleanup_old_files(self):
        """
        Remove log files older than retention_days.
        
        WHAT: Deletes log files that are older than the retention period
        WHY: Prevents disk space issues while keeping recent logs
        WHEN: Called during initialization and after rotation
        """
        if self.retention_days <= 0:
            return  # Disabled
        
        cutoff_date = datetime.now() - timedelta(days=self.retention_days)
        
        # Find all .logs files in the log directory
        for log_file in self.log_dir.glob('*.logs'):
            try:
                # Extract date from filename (format: "2026-Jan-07.logs")
                filename = log_file.stem  # "2026-Jan-07"
                file_date = datetime.strptime(filename, '%Y-%b-%d')
                
                # Delete if older than retention period
                if file_date < cutoff_date:
                    log_file.unlink()
            except (ValueError, OSError):
                # Skip files that don't match the date format or can't be deleted
                pass
    
    def doRollover(self):
        """
        Perform log rotation - called when a new day starts.
        
        WHAT: Creates new log file with new date, closes old one, and cleans up old files
        WHY: Ensures each day gets its own log file and prevents disk space issues
        WHEN: Automatically called at midnight or when file needs rotation
        """
        # Generate new filename for today
        new_filename = self._generate_filename(Path(self.baseFilename).parent)
        
        # If filename changed (new day), update it
        if new_filename != self.baseFilename:
            self.baseFilename = new_filename
        
        # Call parent's rollover logic
        super().doRollover()
        
        # Clean up old files after rotation
        self._cleanup_old_files()


class SizeRotatingFileHandler(RotatingFileHandler):
    """
    Custom size-based rotating file handler.
    
    WHAT: Rotates log files when they reach a specified size
    WHY: Prevents log files from growing too large
    WHEN: Used when LOG_ROTATION_TYPE is set to 'size'
    
    HOW: Extends RotatingFileHandler with configurable size limits and backup retention.
    """
    
    def __init__(self, log_dir: Path, max_bytes: int = 5 * 1024 * 1024, backup_count: int = 10, *args, **kwargs):
        """
        Initialize size-based rotating file handler.
        
        Args:
            log_dir: Directory where log files will be stored
            max_bytes: Maximum file size before rotation (default: 5MB)
            backup_count: Number of backup files to keep (default: 10, set to 0 to disable backups)
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
            backupCount=backup_count,  # Keep specified number of backups
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
