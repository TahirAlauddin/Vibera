"""Custom logging handlers for file rotation."""


from datetime import datetime, timedelta
from logging.handlers import RotatingFileHandler, TimedRotatingFileHandler
from pathlib import Path


class DateRotatingFileHandler(TimedRotatingFileHandler):
    """Custom date-based rotating file handler with custom filename format."""
    
    def __init__(self, log_dir: Path, retention_days: int = 30, *args, **kwargs):
        """Initialize date-based rotating file handler."""
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
        """Generate filename with date format: year-month-day + .logs"""
        now = datetime.now()
        date_str = now.strftime('%Y-%b-%d')
        filename = f"{date_str}.logs"
        return str(log_dir / filename)
    
    def _cleanup_old_files(self):
        """Remove log files older than retention_days."""
        if self.retention_days <= 0:
            return
        
        cutoff_date = datetime.now() - timedelta(days=self.retention_days)
        
        for log_file in self.log_dir.glob('*.logs'):
            try:
                filename = log_file.stem
                file_date = datetime.strptime(filename, '%Y-%b-%d')
                
                # Delete if older than retention period
                if file_date < cutoff_date:
                    log_file.unlink()
            except (ValueError, OSError):
                # Skip files that don't match the date format or can't be deleted
                pass
    
    def doRollover(self):
        """Perform log rotation - called when a new day starts."""
        new_filename = self._generate_filename(Path(self.baseFilename).parent)
        
        # If filename changed (new day), update it
        if new_filename != self.baseFilename:
            self.baseFilename = new_filename
        
        # Call parent's rollover logic
        super().doRollover()
        
        # Clean up old files after rotation
        self._cleanup_old_files()


class SizeRotatingFileHandler(RotatingFileHandler):
    """Custom size-based rotating file handler."""
    
    def __init__(self, log_dir: Path, max_bytes: int = 5 * 1024 * 1024, *args, **kwargs):
        """Initialize size-based rotating file handler."""
        log_dir.mkdir(parents=True, exist_ok=True)
        filename = str(log_dir / 'vibera.log')
        
        # Initialize parent with size-based rotation
        # backupCount=0 means no backup files - file will be overwritten when size limit is reached
        super().__init__(
            filename=filename,
            maxBytes=max_bytes,
            backupCount=0,
            *args,
            **kwargs
        )


def get_log_directory() -> Path:
    """Get the log directory path."""
    base_dir = Path(__file__).resolve().parent.parent
    log_dir = base_dir / 'logs'
    return log_dir
