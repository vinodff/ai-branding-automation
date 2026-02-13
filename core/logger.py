
import logging
import sys
import os
from logging.handlers import RotatingFileHandler
from core.config import settings

def setup_logging():
    if not os.path.exists(settings.LOG_DIR):
        os.makedirs(settings.LOG_DIR)

    logger = logging.getLogger("brandcraft")
    logger.setLevel(logging.INFO)

    formatter = logging.Formatter(
        '%(asctime)s [%(levelname)s] %(name)s (%(filename)s:%(lineno)d): %(message)s'
    )

    # Console Handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(formatter)
    logger.addHandler(console_handler)

    # File Handler
    file_handler = RotatingFileHandler(
        os.path.join(settings.LOG_DIR, "brandcraft.log"),
        maxBytes=10*1024*1024, # 10MB
        backupCount=5
    )
    file_handler.setFormatter(formatter)
    logger.addHandler(file_handler)

    return logger
