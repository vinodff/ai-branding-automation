
import logging
import time
import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from routes import context, branding
from core.exceptions import setup_exception_handlers, BrandCraftException
from core.config import settings

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("brandcraft")

app = FastAPI(
    title="BrandCraft AI - Generative Branding API",
    description="Production-grade API for automated branding synthesis",
    version="1.0.0",
    docs_url="/api/docs",
    openapi_url="/api/v1/openapi.json"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files for generated assets
if not os.path.exists(settings.STATIC_DIR):
    os.makedirs(settings.STATIC_DIR)
app.mount("/static", StaticFiles(directory=settings.STATIC_DIR), name="static")

@app.on_event("startup")
async def validate_environment():
    required_keys = ["API_KEY", "HF_API_KEY", "SD_API_KEY", "IBM_API_KEY", "IBM_PROJECT_ID"]
    missing = [key for key in required_keys if not getattr(settings, key, None)]
    if missing:
        error_msg = f"Startup Failed: Missing required API keys in environment: {', '.join(missing)}"
        logger.error(error_msg)
        raise RuntimeError(error_msg)
    logger.info("Environment validation successful. All AI providers configured.")

# Custom Logging Middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    duration = time.time() - start_time
    logger.info(f"Method: {request.method} Path: {request.url.path} Duration: {duration:.2f}s Status: {response.status_code}")
    return response

# Register Exception Handlers
setup_exception_handlers(app)

# Health Check
@app.get("/health", tags=["System"])
async def health_check():
    return {"status": "operational", "timestamp": time.time()}

# Versioned API Routes
app.include_router(context.router, prefix="/api/v1/context", tags=["Brand Context"])
app.include_router(branding.router, prefix="/api/v1/branding", tags=["Intelligence"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
