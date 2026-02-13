
from fastapi import APIRouter, Response, Depends
from sqlalchemy.orm import Session
from database.connection import get_db
import time
import psutil
import os
from core.config import settings
import google.generativeai as genai

router = APIRouter()
start_time = time.time()

@router.get("/health", tags=["System"])
async def health(db: Session = Depends(get_db)):
    db_status = "connected"
    try:
        # Simple query to verify DB connection
        db.execute("SELECT 1")
    except Exception:
        db_status = "disconnected"

    return {
        "status": "healthy" if db_status == "connected" else "degraded",
        "database": db_status,
        "uptime": f"{time.time() - start_time:.2f}s",
        "timestamp": time.time(),
        "version": "2.0.0-neural"
    }

@router.get("/status", tags=["System"])
async def status():
    # Check Gemini Connection
    gemini_status = "unknown"
    try:
        genai.configure(api_key=settings.API_KEY)
        gemini_status = "connected"
    except Exception:
        gemini_status = "error"

    return {
        "uptime": f"{time.time() - start_time:.2f}s",
        "memory_usage": f"{psutil.Process(os.getpid()).memory_info().rss / 1024 / 1024:.2f}MB",
        "cpu_usage": f"{psutil.cpu_percent()}%",
        "services": {
            "gemini": gemini_status,
            "static_dir": os.path.exists(settings.STATIC_DIR)
        },
        "version": "2.0.0-prod"
    }

@router.get("/metrics", tags=["System"])
async def metrics():
    uptime = time.time() - start_time
    return Response(
        content=f"brandcraft_uptime_seconds {uptime}\nbrandcraft_memory_bytes {psutil.Process(os.getpid()).memory_info().rss}",
        media_type="text/plain"
    )
