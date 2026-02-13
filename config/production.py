
"""
Production Specific Configuration Constants
"""

GUNICORN_WORKER_CLASS = "uvicorn.workers.UvicornWorker"
GUNICORN_TIMEOUT = 120
GUNICORN_GRACEFUL_TIMEOUT = 30
GUNICORN_KEEP_ALIVE = 5

# Security
MAX_CONTENT_LENGTH = 10 * 1024 * 1024  # 10MB limit for payloads

# AI Tuning
GEMINI_DEFAULT_TEMPERATURE = 0.7
STABILITY_STEPS = 50
