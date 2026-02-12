import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    PROJECT_NAME: str = "BrandCraft"
    API_V1_STR: str = "/api/v1"
    GEMINI_API_KEY: str = os.getenv("API_KEY", "")
    HF_API_TOKEN: str = os.getenv("HF_TOKEN", "")
    LOG_LEVEL: str = "INFO"

settings = Settings()