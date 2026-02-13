
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
import logging

logger = logging.getLogger("brandcraft.errors")

class BrandCraftException(Exception):
    def __init__(self, message: str, status_code: int = 500, details: any = None):
        self.message = message
        self.status_code = status_code
        self.details = details

def setup_exception_handlers(app: FastAPI):
    @app.exception_handler(BrandCraftException)
    async def brandcraft_exception_handler(request: Request, exc: BrandCraftException):
        request_id = getattr(request.state, "request_id", "unknown")
        logger.error(f"[{request_id}] Application Error: {exc.message} ({exc.status_code})")
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "error": True, 
                "message": exc.message, 
                "code": "BRAND_ERROR",
                "details": exc.details,
                "trace_id": request_id
            },
        )

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={
                "error": True, 
                "message": "Invalid request parameters", 
                "details": exc.errors()
            },
        )

    @app.exception_handler(Exception)
    async def general_exception_handler(request: Request, exc: Exception):
        request_id = getattr(request.state, "request_id", "unknown")
        logger.critical(f"[{request_id}] Critical System Failure: {str(exc)}", exc_info=True)
        return JSONResponse(
            status_code=500,
            content={
                "error": True,
                "message": "A critical system error occurred.",
                "trace_id": request_id
            }
        )
