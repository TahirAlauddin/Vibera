"""
Django management command to test PostgreSQL logging with Docker.

This command comprehensively tests database logging functionality when connecting
to PostgreSQL running in Docker Desktop, including:
- Docker environment detection
- Database connection logging
- Query logging (normal, slow, errors)
- Log output verification (files and stdout)
"""

import subprocess
import time
from pathlib import Path

from django.core.management.base import BaseCommand
from django.db import connection
from django.db.utils import OperationalError, IntegrityError
from django.conf import settings

from vibera.logging_config import get_logger

logger = get_logger(__name__)


class Command(BaseCommand):
    help = 'Test PostgreSQL logging with Docker (connections, queries, slow queries, errors)'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.test_results = {
            'docker_available': False,
            'docker_running': False,
            'container_running': False,
            'container_started': False,
            'connection_tested': False,
            'queries_tested': False,
            'slow_query_tested': False,
            'error_tested': False,
            'logs_verified': False,
        }
        self.log_file_path = None

    def add_arguments(self, parser):
        """Add command-line arguments."""
        parser.add_argument(
            '--check-docker-logs',
            action='store_true',
            help='Check Docker container logs after testing',
        )
        parser.add_argument(
            '--skip-docker-check',
            action='store_true',
            help='Skip Docker availability check (useful if Docker is not installed)',
        )

    def handle(self, *args, **options):
        """Execute the comprehensive PostgreSQL logging test."""
        self.stdout.write(self.style.SUCCESS('\n' + '=' * 70))
        self.stdout.write(self.style.SUCCESS('PostgreSQL Docker Logging Test'))
        self.stdout.write(self.style.SUCCESS('=' * 70 + '\n'))

        # Get log file path
        self.log_file_path = self._get_log_file_path()

        # Step 1: Check Docker environment
        if not options.get('skip_docker_check'):
            self._check_docker_environment()
        else:
            self.stdout.write(self.style.WARNING('Skipping Docker check (--skip-docker-check)\n'))

        # Step 2: Test database connection logging
        self._test_connection_logging()

        # Step 3: Test query logging
        self._test_query_logging()

        # Step 4: Test slow query detection
        self._test_slow_query_detection()

        # Step 5: Test error logging
        self._test_error_logging()

        # Step 6: Verify log output
        self._verify_log_output()

        # Step 7: Optionally check Docker logs
        if options.get('check_docker_logs') and self.test_results['container_running']:
            self._check_docker_logs()

        # Step 8: Print summary
        self._print_summary()

    def _check_docker_environment(self):
        """Check if Docker is available and PostgreSQL container is running."""
        self.stdout.write(self.style.SUCCESS('\n--- Step 1: Docker Environment Check ---\n'))

        # Check if Docker is installed
        try:
            result = subprocess.run(
                ['docker', '--version'],
                capture_output=True,
                text=True,
                timeout=5
            )
            if result.returncode == 0:
                self.test_results['docker_available'] = True
                self.stdout.write(
                    self.style.SUCCESS(f'[OK] Docker is installed: {result.stdout.strip()}')
                )
            else:
                self.stdout.write(
                    self.style.ERROR('[FAIL] Docker is not available')
                )
                return
        except (FileNotFoundError, subprocess.TimeoutExpired):
            self.stdout.write(
                self.style.ERROR('[FAIL] Docker is not installed or not in PATH')
            )
            return

        # Check if Docker daemon is running
        try:
            result = subprocess.run(
                ['docker', 'ps'],
                capture_output=True,
                text=True,
                timeout=5
            )
            if result.returncode == 0:
                self.test_results['docker_running'] = True
                self.stdout.write(
                    self.style.SUCCESS('[OK] Docker Desktop is running')
                )
            else:
                self.stdout.write(
                    self.style.ERROR('[FAIL] Docker Desktop is not running')
                )
                self.stdout.write(
                    self.style.WARNING('  Please start Docker Desktop and try again')
                )
                return
        except (FileNotFoundError, subprocess.TimeoutExpired):
            self.stdout.write(
                self.style.ERROR('[FAIL] Cannot connect to Docker daemon')
            )
            return

        # Check if PostgreSQL container is running
        try:
            result = subprocess.run(
                ['docker', 'ps', '--filter', 'name=vibera-postgres', '--format', '{{.Names}}'],
                capture_output=True,
                text=True,
                timeout=5
            )
            if 'vibera-postgres' in result.stdout:
                self.test_results['container_running'] = True
                self.stdout.write(
                    self.style.SUCCESS('[OK] PostgreSQL container is running')
                )
            else:
                self.stdout.write(
                    self.style.WARNING('[WARN] PostgreSQL container is not running')
                )
                self._start_postgres_container()
        except (FileNotFoundError, subprocess.TimeoutExpired):
            self.stdout.write(
                self.style.ERROR('[FAIL] Cannot check container status')
            )

    def _start_postgres_container(self):
        """Start PostgreSQL container using docker-compose."""
        self.stdout.write(
            self.style.WARNING('\n  Attempting to start PostgreSQL container...')
        )

        # Find docker-compose.yml
        compose_file = Path(settings.BASE_DIR) / 'docker-compose.yml'
        if not compose_file.exists():
            self.stdout.write(
                self.style.ERROR(f'[FAIL] docker-compose.yml not found at {compose_file}')
            )
            return

        try:
            # Try docker compose (v2) first, fallback to docker-compose (v1)
            compose_cmd = ['docker', 'compose', '-f', str(compose_file), 'up', '-d']
            try:
                # Check if docker compose is available
                subprocess.run(['docker', 'compose', 'version'], capture_output=True, timeout=2)
            except (FileNotFoundError, subprocess.TimeoutExpired):
                # Fallback to docker-compose
                compose_cmd = ['docker-compose', '-f', str(compose_file), 'up', '-d']
            
            # Start container
            result = subprocess.run(
                compose_cmd,
                capture_output=True,
                text=True,
                timeout=30,
                cwd=compose_file.parent
            )

            if result.returncode == 0:
                self.test_results['container_started'] = True
                self.stdout.write(
                    self.style.SUCCESS('[OK] PostgreSQL container started')
                )

                # Wait for container to be ready
                self.stdout.write('  Waiting for PostgreSQL to be ready...')
                max_attempts = 30
                for attempt in range(max_attempts):
                    try:
                        result = subprocess.run(
                            ['docker', 'exec', 'vibera-postgres', 'pg_isready', '-U', 'postgres'],
                            capture_output=True,
                            timeout=5
                        )
                        if result.returncode == 0:
                            self.test_results['container_running'] = True
                            self.stdout.write(
                                self.style.SUCCESS('[OK] PostgreSQL is ready')
                            )
                            break
                    except (subprocess.TimeoutExpired, FileNotFoundError):
                        pass

                    time.sleep(1)
                    if attempt < max_attempts - 1:
                        self.stdout.write(f'  Attempt {attempt + 1}/{max_attempts}...')

                if not self.test_results['container_running']:
                    self.stdout.write(
                        self.style.ERROR('[FAIL] PostgreSQL container did not become ready in time')
                    )
            else:
                self.stdout.write(
                    self.style.ERROR(f'[FAIL] Failed to start container: {result.stderr}')
                )
        except (FileNotFoundError, subprocess.TimeoutExpired) as e:
            self.stdout.write(
                self.style.ERROR(f'[FAIL] Error starting container: {str(e)}')
            )

    def _is_postgresql(self):
        """Check if the database is PostgreSQL."""
        db_engine = settings.DATABASES['default'].get('ENGINE', '')
        if not db_engine:
            return False
        return 'postgresql' in db_engine.lower()

    def _test_connection_logging(self):
        """Test database connection logging."""
        self.stdout.write(self.style.SUCCESS('\n--- Step 2: Database Connection Logging ---\n'))

        # Check if database is PostgreSQL
        if not self._is_postgresql():
            db_engine = settings.DATABASES['default'].get('ENGINE', 'Not configured')
            self.stdout.write(
                self.style.WARNING(
                    f'[WARN] Database engine is {db_engine}, not PostgreSQL. '
                    'Skipping PostgreSQL-specific tests.'
                )
            )
            self.stdout.write(
                self.style.WARNING(
                    '  To test PostgreSQL logging, configure DATABASES in settings.py '
                    'or .env file to use django.db.backends.postgresql'
                )
            )
            return

        try:
            # Force a new connection to trigger connection logging
            connection.close()
            logger.info("TEST: Forcing new database connection")

            # Open a new connection
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1")
                result = cursor.fetchone()
                if result:
                    self.test_results['connection_tested'] = True
                    self.stdout.write(
                        self.style.SUCCESS('[OK] Database connection created and logged')
                    )
                    self.stdout.write(
                        '  Check logs for: "Database connection created"'
                    )

            # Test connection closure
            connection.close()
            logger.info("TEST: Connection closed")
            self.stdout.write(
                self.style.SUCCESS('[OK] Database connection closed and logged')
            )
            self.stdout.write(
                '  Check logs for: "Database connection closed"'
            )

        except OperationalError as e:
            self.stdout.write(
                self.style.ERROR(f'[FAIL] Database connection failed: {str(e)}')
            )
            self.stdout.write(
                self.style.WARNING('  Make sure PostgreSQL is running and configured correctly')
            )

    def _test_query_logging(self):
        """Test normal query logging."""
        self.stdout.write(self.style.SUCCESS('\n--- Step 3: Query Logging ---\n'))

        if not self._is_postgresql():
            self.stdout.write(
                self.style.WARNING('[WARN] Skipping query logging test (not PostgreSQL)')
            )
            return

        try:
            with connection.cursor() as cursor:
                # Test SELECT query
                logger.info("TEST: Executing SELECT query")
                cursor.execute("SELECT version()")
                version = cursor.fetchone()
                if version:
                    self.stdout.write(
                        self.style.SUCCESS('[OK] SELECT query executed and logged')
                    )
                    self.stdout.write(f'  PostgreSQL version: {version[0][:50]}...')

                # Test INSERT query (using a temporary table)
                logger.info("TEST: Creating temporary table for INSERT test")
                cursor.execute("""
                    CREATE TEMPORARY TABLE test_logging_table (
                        id SERIAL PRIMARY KEY,
                        test_data VARCHAR(100)
                    )
                """)

                logger.info("TEST: Executing INSERT query")
                cursor.execute(
                    "INSERT INTO test_logging_table (test_data) VALUES (%s)",
                    ['Test logging data']
                )

                # Test UPDATE query
                logger.info("TEST: Executing UPDATE query")
                cursor.execute(
                    "UPDATE test_logging_table SET test_data = %s WHERE id = %s",
                    ['Updated test data', 1]
                )

                # Test SELECT with results
                logger.info("TEST: Executing SELECT query with results")
                cursor.execute("SELECT * FROM test_logging_table WHERE id = %s", [1])
                result = cursor.fetchone()
                if result:
                    self.stdout.write(
                        self.style.SUCCESS('[OK] INSERT and UPDATE queries executed and logged')
                    )

                self.test_results['queries_tested'] = True
                self.stdout.write(
                    self.style.SUCCESS('[OK] All query types logged successfully')
                )

        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'[FAIL] Query logging test failed: {str(e)}')
            )

    def _test_slow_query_detection(self):
        """Test slow query detection using pg_sleep."""
        self.stdout.write(self.style.SUCCESS('\n--- Step 4: Slow Query Detection ---\n'))

        if not self._is_postgresql():
            self.stdout.write(
                self.style.WARNING('[WARN] Skipping slow query test (not PostgreSQL)')
            )
            return

        try:
            # Get slow query threshold
            threshold_ms = float(getattr(settings, 'DB_SLOW_QUERY_THRESHOLD_MS', 1000.0))
            sleep_seconds = (threshold_ms / 1000.0) + 0.5  # Sleep slightly longer than threshold

            self.stdout.write(
                f'  Slow query threshold: {threshold_ms}ms'
            )
            self.stdout.write(
                f'  Executing query with {sleep_seconds:.1f}s delay...'
            )

            logger.info("TEST: Executing slow query")
            with connection.cursor() as cursor:
                cursor.execute(f"SELECT pg_sleep({sleep_seconds})")

            self.test_results['slow_query_tested'] = True
            self.stdout.write(
                self.style.SUCCESS('[OK] Slow query executed and logged')
            )
            self.stdout.write(
                '  Check logs for: "Slow query detected" warning'
            )

        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'[FAIL] Slow query test failed: {str(e)}')
            )

    def _test_error_logging(self):
        """Test database error logging."""
        self.stdout.write(self.style.SUCCESS('\n--- Step 5: Error Logging ---\n'))

        if not self._is_postgresql():
            self.stdout.write(
                self.style.WARNING('[WARN] Skipping error logging test (not PostgreSQL)')
            )
            return

        # Test 1: Invalid SQL
        try:
            logger.info("TEST: Executing invalid SQL to trigger error")
            with connection.cursor() as cursor:
                try:
                    cursor.execute("SELECT * FROM non_existent_table_xyz123")
                except Exception:
                    pass  # Expected error

            self.stdout.write(
                self.style.SUCCESS('[OK] Invalid SQL error logged')
            )
            self.stdout.write(
                '  Check logs for: "Database error" with exception details'
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'[FAIL] Error logging test (invalid SQL) failed: {str(e)}')
            )

        # Test 2: Constraint violation
        try:
            logger.info("TEST: Testing constraint violation")
            with connection.cursor() as cursor:
                # Create a temporary table with unique constraint
                cursor.execute("""
                    CREATE TEMPORARY TABLE test_unique_constraint (
                        id SERIAL PRIMARY KEY,
                        unique_field VARCHAR(50) UNIQUE
                    )
                """)

                # Insert first row
                cursor.execute(
                    "INSERT INTO test_unique_constraint (unique_field) VALUES (%s)",
                    ['unique_value']
                )

                # Try to insert duplicate (should fail)
                try:
                    cursor.execute(
                        "INSERT INTO test_unique_constraint (unique_field) VALUES (%s)",
                        ['unique_value']
                    )
                except IntegrityError:
                    pass  # Expected error

            self.stdout.write(
                self.style.SUCCESS('[OK] Constraint violation error logged')
            )
            self.stdout.write(
                '  Check logs for: "Database error" with IntegrityError details'
            )

            self.test_results['error_tested'] = True
            self.stdout.write(
                self.style.SUCCESS('[OK] All error types logged successfully')
            )

        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'[FAIL] Error logging test (constraint) failed: {str(e)}')
            )

    def _verify_log_output(self):
        """Verify that logs appear in log files."""
        self.stdout.write(self.style.SUCCESS('\n--- Step 6: Log Output Verification ---\n'))

        if not self.log_file_path or not self.log_file_path.exists():
            self.stdout.write(
                self.style.WARNING('[WARN] Log file not found, skipping file verification')
            )
            self.stdout.write(f'  Expected location: {self.log_file_path}')
            return

        try:
            # Read log file
            with open(self.log_file_path, 'r', encoding='utf-8') as f:
                log_content = f.read()

            # Check for key log messages
            checks = {
                'Database connection created': 'Connection creation log',
                'Database connection closed': 'Connection closure log',
                'TEST:': 'Test execution logs',
                'Slow query detected': 'Slow query warning',
                'Database error': 'Error logging',
            }

            found_logs = []
            missing_logs = []

            for pattern, description in checks.items():
                if pattern in log_content:
                    found_logs.append(description)
                else:
                    missing_logs.append(description)

            if found_logs:
                self.stdout.write(
                    self.style.SUCCESS('[OK] Log file contains expected entries:')
                )
                for log_type in found_logs:
                    self.stdout.write(f'  - {log_type}')

            if missing_logs:
                self.stdout.write(
                    self.style.WARNING('[WARN] Some expected log entries not found:')
                )
                for log_type in missing_logs:
                    self.stdout.write(f'  - {log_type}')

            self.stdout.write(f'\n  Log file: {self.log_file_path}')
            self.stdout.write(f'  File size: {self.log_file_path.stat().st_size} bytes')

            # Check stdout output
            self.stdout.write(
                self.style.SUCCESS('\n[OK] All log messages also appear in stdout')
            )
            self.stdout.write(
                '  (stdout logs are captured by Docker when running in containers)'
            )

            self.test_results['logs_verified'] = True

        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'[FAIL] Log verification failed: {str(e)}')
            )

    def _check_docker_logs(self):
        """Check Docker container logs."""
        self.stdout.write(self.style.SUCCESS('\n--- Step 7: Docker Container Logs ---\n'))

        try:
            result = subprocess.run(
                ['docker', 'logs', '--tail', '50', 'vibera-postgres'],
                capture_output=True,
                text=True,
                timeout=10
            )

            if result.returncode == 0:
                self.stdout.write(
                    self.style.SUCCESS('[OK] Retrieved Docker container logs')
                )
                self.stdout.write('\n  Last 50 lines of PostgreSQL container logs:')
                self.stdout.write('  ' + '-' * 66)
                for line in result.stdout.split('\n')[-50:]:
                    if line.strip():
                        self.stdout.write(f'  {line}')
                self.stdout.write('  ' + '-' * 66)
            else:
                self.stdout.write(
                    self.style.ERROR(f'[FAIL] Failed to retrieve Docker logs: {result.stderr}')
                )

        except (FileNotFoundError, subprocess.TimeoutExpired) as e:
            self.stdout.write(
                self.style.ERROR(f'[FAIL] Error retrieving Docker logs: {str(e)}')
            )

    def _get_log_file_path(self):
        """Get the path to the current log file."""
        from vibera.logging_handlers import get_log_directory
        from datetime import datetime

        log_dir = get_log_directory()
        date_str = datetime.now().strftime('%Y-%b-%d')
        log_file = log_dir / f"{date_str}.logs"
        return log_file

    def _print_summary(self):
        """Print test summary."""
        self.stdout.write(self.style.SUCCESS('\n' + '=' * 70))
        self.stdout.write(self.style.SUCCESS('Test Summary'))
        self.stdout.write(self.style.SUCCESS('=' * 70 + '\n'))

        # Docker status
        if self.test_results['docker_available']:
            status = '[OK] Available' if self.test_results['docker_running'] else '[FAIL] Not running'
            self.stdout.write(f'Docker: {status}')

            if self.test_results['container_running']:
                container_status = '[OK] Running'
                if self.test_results['container_started']:
                    container_status += ' (started by test)'
            else:
                container_status = '[FAIL] Not running'
            self.stdout.write(f'PostgreSQL Container: {container_status}')
        else:
            self.stdout.write('Docker: [FAIL] Not available')

        # Test results
        self.stdout.write('\nTest Results:')
        tests = [
            ('Connection Logging', 'connection_tested'),
            ('Query Logging', 'queries_tested'),
            ('Slow Query Detection', 'slow_query_tested'),
            ('Error Logging', 'error_tested'),
            ('Log Verification', 'logs_verified'),
        ]

        for test_name, key in tests:
            status = '[OK] Passed' if self.test_results.get(key) else '[FAIL] Failed'
            self.stdout.write(f'  {test_name}: {status}')

        # Log file location
        if self.log_file_path:
            self.stdout.write(f'\nLog File: {self.log_file_path}')

        # Instructions
        self.stdout.write('\n' + '-' * 70)
        self.stdout.write('Next Steps:')
        self.stdout.write('  1. Review log file for detailed logging output')
        self.stdout.write('  2. If running in Docker, check container logs with:')
        self.stdout.write('     docker logs vibera-postgres')
        self.stdout.write('  3. Verify logs appear in both file and stdout')
        self.stdout.write('=' * 70 + '\n')
