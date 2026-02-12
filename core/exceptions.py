from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

class BrandCraftException(Exception):
    def __init__(self, message: str, status_code: int = 500):
        self.message = message
        self.status_code = status_code

def setup_exception_handlers(app: FastAPI):
    @app.exception_handler(BrandCraftException)
    async def brandcraft_exception_handler(request: Request, exc: BrandCraftException):
        return JSONResponse(
            status_code=exc.status_code,
            content={"error": True, "message": exc.message, "code": "BRAND_ERROR"},
        )

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={"error": True, "message": "Invalid request parameters", "details": exc.errors()},
        )