
#!/bin/bash
set -e

echo "[START] Starting Nginx..."
nginx -g "daemon on;"

echo "[START] Starting Gunicorn with Uvicorn workers..."
# Calculate workers based on CPU cores (2 * cores + 1)
WORKERS=${WORKERS:-$((2 * $(nproc) + 1))}

exec gunicorn main:app \
    --workers $WORKERS \
    --worker-class uvicorn.workers.UvicornWorker \
    --bind 0.0.0.0:8000 \
    --access-logfile /app/logs/gunicorn_access.log \
    --error-logfile /app/logs/gunicorn_error.log \
    --timeout 120 \
    --keep-alive 5 \
    --log-level info
