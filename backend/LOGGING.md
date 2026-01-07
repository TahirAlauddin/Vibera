# Logging Configuration Guide

## Overview

This Django application uses file-based logging with automatic rotation. Logs are stored in the `backend/logs/` directory and can be configured to rotate by size or date.

## Directory Structure

```
backend/
  ├── logs/              # Log files directory (created automatically)
  │   ├── 2026-Jan-06.logs  # Date-based log files (if LOG_ROTATION_TYPE=date)
  │   ├── 2026-jan-07.logs
  │   ├── vibera.log     # Size-based log file (if LOG_ROTATION_TYPE=size)
  │   └── errors.log     # Error-only log file (always present)
  └── vibera/
      ├── logging_config.py
      ├── logging_handlers.py
      └── settings.py
```

## Environment Variables

Configure logging behavior via environment variables:

### Rotation Type

- `LOG_ROTATION_TYPE`: `'date'` or `'size'` (default: `'date'`)
  - `'date'`: Creates new log file each day (format: `2026-Jan-07.logs`)
  - `'size'`: Rotates when file reaches specified size

### Formatter

- `LOG_FORMATTER`: `'verbose'`, `'detailed'`, or `'simple'` (default: `'verbose'`)
  - `'verbose'`: Most detailed - includes process, thread, logger name
  - `'detailed'`: Includes timestamp, level, logger name, message
  - `'simple'`: Minimal - only level and message

### Retention and Backup Settings

- `LOG_RETENTION_DAYS`: Number of days to keep date-based log files (default: `30`)

  - Set to `0` to keep all log files indefinitely
  - Old files are automatically deleted after this period
  - Only applies to date-based rotation

- `LOG_BACKUP_COUNT`: Number of backup files to keep for size-based rotation (default: `10`)
  - Set to `0` to disable backups (old files are overwritten)
  - Applies to size-based rotation and error log files
  - Example: With `LOG_BACKUP_COUNT=5`, you'll have `vibera.log`, `vibera.log.1`, ..., `vibera.log.5`

### Size-Based Rotation Settings

- `LOG_FILE_SIZE_MB`: Size in MB before rotation (default: `5`)
  - Common values: `5` or `10`

### Log Levels

- `ROOT_LOG_LEVEL`: Root logger level - catches all unhandled logs (default: `INFO`)
- `FRAMEWORK_LOG_LEVEL`: Django framework logger level - Django internals (default: `INFO`)
- `APPLICATION_LOG_LEVEL`: Application logger level - your custom code (default: `INFO`)
  - Controls: `vibera.middleware`, `users`, `moods`, `social`

## Logger Structure

The application uses a hierarchical logger structure organized by domain:

### Framework Loggers (Standard Django)

- **`django`**: Core Django framework operations
- **`django.request`**: HTTP request/response handling
- **`django.server`**: Development server lifecycle
- **`django.db.backends`**: Database queries and connections
- **`django.security`**: Security events and threats
- **`rest_framework`**: Django REST Framework API operations

### Application Loggers (Domain-Specific)

- **`vibera.middleware`**: Custom request/response logging middleware
- **`users`**: User management, authentication, profile operations
- **`moods`**: Mood tracking, mood creation, mood retrieval
- **`social`**: Social features, sharing, community interactions

### Root Logger

- **`''`** (empty string): Catches all unhandled logs from third-party libraries

## Configuration Examples

### Date-Based Rotation (Default)

```bash
export LOG_ROTATION_TYPE=date
export LOG_FORMATTER=verbose
export LOG_RETENTION_DAYS=30  # Keep last 30 days of logs
```

This creates daily log files like:

- `2026-Jan-06.logs`
- `2026-Jan-07.logs`
- `2026-Jan-08.logs`

**Automatic Cleanup**: Files older than `LOG_RETENTION_DAYS` are automatically deleted. Set to `0` to keep all files.

### Size-Based Rotation (5MB)

```bash
export LOG_ROTATION_TYPE=size
export LOG_FILE_SIZE_MB=5
export LOG_BACKUP_COUNT=10  # Keep last 10 rotated files
export LOG_FORMATTER=detailed
```

This creates:

- `vibera.log` (current log file)
- `vibera.log.1` (first backup)
- `vibera.log.2` (second backup)
- ... up to `vibera.log.10`

**Backup Control**: Set `LOG_BACKUP_COUNT=0` to disable backups (old files overwritten). Default is `10`.

### Size-Based Rotation (10MB)

```bash
export LOG_ROTATION_TYPE=size
export LOG_FILE_SIZE_MB=10
export LOG_FORMATTER=simple
```

## Log Files

### Main Log Files

- **Date-based**: `{year}-{month}-{day}.logs` (e.g., `2026-Jan-07.logs`)
  - Automatically cleaned up after `LOG_RETENTION_DAYS` (default: 30 days)
  - Set `LOG_RETENTION_DAYS=0` to keep all files indefinitely
- **Size-based**: `vibera.log` with backups (`vibera.log.1`, `vibera.log.2`, etc.)
  - Number of backups controlled by `LOG_BACKUP_COUNT` (default: 10)
  - Set `LOG_BACKUP_COUNT=0` to disable backups

### Error Log File

- **Always present**: `errors.log`
- Contains only ERROR and CRITICAL level messages
- Rotates at 10MB
- Number of backups controlled by `LOG_BACKUP_COUNT` (default: 10)

## Log Formats

### Verbose Format (Default)

```
[INFO    ] 2026-12-06 10:30:45 | vibera.middleware | Process:12345 | Thread:MainThread | Incoming request: GET /api/moods/ | User: user123 | IP: 192.168.1.1
```

### Detailed Format

```
[INFO    ] 2026-12-06 10:30:45 | vibera.middleware | Incoming request: GET /api/moods/ | User: user123 | IP: 192.168.1.1
```

### Simple Format

```
[INFO    ] Incoming request: GET /api/moods/ | User: user123 | IP: 192.168.1.1
```

## Using Logging in Your Code

### Basic Usage

```python
from vibera.logging_config import get_logger

# Get logger for your module - creates hierarchical logger name
# Example: In moods/views.py, this creates 'moods.views' logger
# which automatically inherits from 'moods' logger configuration
logger = get_logger(__name__)

# Log at different levels
logger.debug("Detailed diagnostic information")
logger.info("General information")
logger.warning("Something unexpected happened")
logger.error("An error occurred")
logger.critical("Critical error - app may stop")
```

**How Logger Hierarchy Works:**

- In `moods/views.py`: `get_logger(__name__)` creates `'moods.views'` logger → inherits from `'moods'` logger
- In `moods/models.py`: `get_logger(__name__)` creates `'moods.models'` logger → inherits from `'moods'` logger
- In `users/views.py`: `get_logger(__name__)` creates `'users.views'` logger → inherits from `'users'` logger
- In `vibera/middleware.py`: `get_logger(__name__)` creates `'vibera.middleware'` logger → uses `'vibera.middleware'` config

This is the **standard Python logging pattern** recommended by Python's official documentation.

### Logging with Context

```python
logger.info(f"User {user.id} created mood {mood.id}")
logger.warning(f"Validation failed for user {user.id}: {errors}")
logger.error(f"Failed to process payment for order {order.id}: {str(e)}")
```

### Logging Exceptions

```python
try:
    result = risky_operation()
except Exception as e:
    logger.error(
        f"Operation failed: {str(e)}",
        exc_info=True,  # Includes full traceback
    )
```

## What Gets Logged

### Automatic Logging (via Middleware)

- All HTTP requests (method, path, user, IP, user agent)
- All HTTP responses (status code, duration)
- All exceptions (full traceback, request context)

### Framework Logging

- Django server startup/shutdown
- Database queries (only in DEBUG mode)
- Security events (failed logins, etc.)
- REST Framework events (authentication, permissions)

### Application Logging

- Custom log messages from your code
- Business logic events
- Error conditions

## Viewing Logs

### Docker Logs (stdout/stderr)

All logs are written to **stdout** and can be accessed via Docker logs:

```bash
# View all logs from a running container
docker logs <container_name>

# Follow logs in real-time
docker logs -f <container_name>

# View last 100 lines
docker logs --tail 100 <container_name>

# View logs with timestamps
docker logs -t <container_name>
```

**Note:** All loggers are configured to write to both stdout (for Docker) and log files (for persistence).

### View Current Log File

```bash
# Date-based
tail -f logs/2026-Jan-07.logs

# Size-based
tail -f logs/vibera.log
```

### View Error Logs

```bash
tail -f logs/errors.log
```

### Search Logs

```bash
# Search for errors
grep "ERROR" logs/*.logs

# Search for specific user
grep "user123" logs/*.logs

# Search for specific date
grep "2026-12-06" logs/*.logs
```

### View Last N Lines

```bash
tail -n 100 logs/vibera.log
```

### Validate Logging to stdout

Test that logs are properly written to stdout:

```bash
# Run the test command
python manage.py test_logging

# In Docker, verify logs appear
docker logs <container_name> | grep "Testing Logging"
```

## Best Practices

1. **Use appropriate log levels**

   - DEBUG: Development only
   - INFO: Normal operations
   - WARNING: Unexpected but handled
   - ERROR: Failures that need attention
   - CRITICAL: System-threatening issues

2. **Include context in log messages**

   - Add user IDs, request IDs, object IDs
   - Include relevant operation details
   - Format messages clearly

3. **Don't log sensitive data**

   - Never log passwords, tokens, or secrets
   - Be careful with PII (personally identifiable information)
   - Consider masking sensitive fields

4. **Monitor log file sizes**
   - Use appropriate rotation settings
   - Clean up old log files periodically
   - Monitor disk space

## Troubleshooting

### No logs appearing

1. Check log directory exists: `ls -la backend/logs/`
2. Check log level configuration
3. Verify middleware is in `MIDDLEWARE` list
4. Check file permissions

### Log files not rotating

1. Check `LOG_ROTATION_TYPE` environment variable
2. For size-based: Verify `LOG_FILE_SIZE_MB` is set correctly
3. Check file permissions on log directory

### Too many logs

1. Increase log level (e.g., `INFO` to `WARNING`)
2. Disable database query logging in production
3. Reduce verbosity of specific loggers

### Disk space issues

1. Reduce `LOG_RETENTION_DAYS` for date-based rotation (e.g., `7` for last week only)
2. Reduce `LOG_BACKUP_COUNT` for size-based rotation (e.g., `5` instead of `10`)
3. Use smaller `LOG_FILE_SIZE_MB` for size-based rotation
4. Set `LOG_RETENTION_DAYS=7` and `LOG_BACKUP_COUNT=5` for minimal disk usage

## Log Rotation Details

### Date-Based Rotation

- **When**: Rotates at midnight each day
- **Format**: `{year}-{month}-{day}.logs` (e.g., `2026-Jan-07.logs`)
- **Retention**: Automatically deletes files older than `LOG_RETENTION_DAYS` (default: 30 days)
- **Configuration**: Set `LOG_RETENTION_DAYS=0` to keep all files indefinitely
- **Best for**: Daily log analysis, easy date-based searching, automatic cleanup

### Size-Based Rotation

- **When**: Rotates when file reaches specified size
- **Format**: `vibera.log` with numbered backups (`vibera.log.1`, `vibera.log.2`, etc.)
- **Backup**: Keeps last `LOG_BACKUP_COUNT` files (default: 10)
- **Configuration**: Set `LOG_BACKUP_COUNT=0` to disable backups (overwrites old files)
- **Best for**: Preventing large files, production environments, controlled backup retention

## Example Log Output

### Request Log

```
[INFO    ] 2026-12-06 10:30:45 | vibera.middleware | Process:12345 | Thread:MainThread | Incoming request: GET /api/moods/ | User: user123 | IP: 192.168.1.1
```

### Response Log

```
[INFO    ] 2026-12-06 10:30:45 | vibera.middleware | Process:12345 | Thread:MainThread | Outgoing response: GET /api/moods/ | Status: 200 | Duration: 45.23ms
```

### Error Log

```
[ERROR   ] 2026-12-06 10:30:45 | vibera.middleware | Process:12345 | Thread:MainThread | Unhandled exception: ValueError - Invalid input | Request: POST /api/moods/ | Duration: 12.34ms
Traceback (most recent call last):
  File "/path/to/view.py", line 42, in post
    result = process_data()
  ...
ValueError: Invalid input
```
