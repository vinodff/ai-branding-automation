
import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    PROJECT_NAME: str = "BrandCraft"
    API_V1_STR: str = "/api/v1"
    
    # AI Provider Keys
    API_KEY: str = os.getenv("API_KEY", "")  # Gemini API Key
    HF_API_KEY: str = os.getenv("HF_API_KEY", "")
    SD_API_KEY: str = os.getenv("SD_API_KEY", "")
    IBM_API_KEY: str = os.getenv("IBM_API_KEY", "")
    IBM_URL: str = os.getenv("IBM_URL", "https://us-south.ml.cloud.ibm.com")
    IBM_PROJECT_ID: str = os.getenv("IBM_PROJECT_ID", "")
    
    # Paths
    STATIC_DIR: str = "static"
    LOG_LEVEL: str = "INFO"

    class Config:
        env_file = ".env"

settings = Settings()
