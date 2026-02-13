
import time
import logging
import uuid
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse
from core.security import SecurityEngine

# Structured logging for production
logger = logging.getLogger("brandcraft.middleware")

class ProductionSecurityMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # 1. Request Identity for Tracing
        request_id = str(uuid.uuid4())
        request.state.request_id = request_id

        # 2. Input Security
        if request.method in ["POST", "PUT"]:
            try:
                # Basic validation for early exit on malicious patterns
                # Be careful with large bodies - here we just check for basic injection
                body = await request.body()
                content = body.decode("utf-8", errors="ignore")
                if not SecurityEngine.validate_prompt(content):
                    logger.warning(f"[{request_id}] Security Alert: Malicious payload blocked from {request.client.host}")
                    return JSONResponse(
                        status_code=403, 
                        content={"error": "Security validation failed: Prohibited patterns detected."}
                    )
            except Exception as e:
                logger.error(f"[{request_id}] Content processing error: {e}")

        # 3. Execution & Latency Tracking
        start_time = time.time()
        try:
            response = await call_next(request)
        except Exception as e:
            logger.error(f"[{request_id}] Unhandled Error: {str(e)}")
            return JSONResponse(
                status_code=500,
                content={"error": "Internal server error", "trace_id": request_id}
            )
            
        process_time = time.time() - start_time
        
        # 4. Production Security Headers
        response.headers["X-Request-ID"] = request_id
        response.headers["X-Process-Time"] = f"{process_time:.4f}s"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        
        logger.info(f"[{request_id}] {request.method} {request.url.path} - {response.status_code} ({process_time:.2f}s)")
        
        return response

class RateLimitGuard(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Integration point for Redis-based rate limiting
        # Currently a pass-through until Redis connection is provided
        return await call_next(request)
