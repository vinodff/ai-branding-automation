
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.staticfiles import StaticFiles
from routes import context, branding, system, auth, admin, analytics
from core.exceptions import setup_exception_handlers
from core.config import settings
from core.middleware import ProductionSecurityMiddleware, RateLimitGuard
from core.logger import setup_logging
from database.connection import Base, engine

# Init DB
Base.metadata.create_all(bind=engine)

# Setup Logs
logger = setup_logging()

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Investor-Ready SaaS Brand Identity Platform",
    version="2.0.0",
    docs_url=settings.API_V1_STR + "/docs" if settings.DEBUG else None
)

# Global CORS Policy
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# SaaS Middleware
app.add_middleware(ProductionSecurityMiddleware)
app.add_middleware(RateLimitGuard)
app.add_middleware(GZipMiddleware, minimum_size=1000)

# Asset Serving
app.mount("/static", StaticFiles(directory=settings.STATIC_DIR), name="static")

# SaaS API Routes
app.include_router(system.router)
from routes import auth
app.include_router(auth.router)
app.include_router(admin.router, prefix=settings.API_V1_STR + "/admin", tags=["Admin"])
app.include_router(analytics.router, prefix=settings.API_V1_STR + "/analytics", tags=["Analytics"])
app.include_router(context.router, prefix=settings.API_V1_STR + "/context", tags=["Context"])
app.include_router(branding.router, prefix=settings.API_V1_STR + "/branding", tags=["Branding"])

@app.get("/health")
def health():
    return {"status":"ok"}

setup_exception_handlers(app)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=settings.DEBUG)
