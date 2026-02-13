
import os
from pydantic_settings import BaseSettings
from pydantic import field_validator
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    PROJECT_NAME: str = "BrandCraft"
    API_V1_STR: str = "/api/v1"
    DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"
    
    # AI Provider Keys
    API_KEY: str = os.getenv("API_KEY", "")
    HF_API_KEY: str = os.getenv("HF_API_KEY", "")
    SD_API_KEY: str = os.getenv("SD_API_KEY", "")
    IBM_API_KEY: str = os.getenv("IBM_API_KEY", "")
    IBM_URL: str = os.getenv("IBM_URL", "https://us-south.ml.cloud.ibm.com")
    IBM_PROJECT_ID: str = os.getenv("IBM_PROJECT_ID", "")
    
    # Paths
    STATIC_DIR: str = "static"
    LOG_DIR: str = "logs"
    
    # Security
    ALLOWED_HOSTS: str = os.getenv("ALLOWED_HOSTS", "*")
    CORS_ORIGINS: str = os.getenv("CORS_ORIGINS", "*")
    RATE_LIMIT: str = "100/minute"

    @field_validator("API_KEY", "HF_API_KEY")
    @classmethod
    def check_required_keys(cls, v: str) -> str:
        if not v and not os.getenv("CI"):
            raise ValueError("Required API key is missing from environment")
        return v

    class Config:
        env_file = ".env"

settings = Settings()
