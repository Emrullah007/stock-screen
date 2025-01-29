from pydantic_settings import BaseSettings
from typing import List
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Stock Screen"
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-here")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days
    
    # External APIs
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    AZURE_API_KEY: str = os.getenv("AZURE_API_KEY", "")
    AZURE_ENDPOINT: str = os.getenv("AZURE_ENDPOINT", "")
    AZURE_MODEL_NAME: str = os.getenv("AZURE_MODEL_NAME", "gpt-35-turbo")
    NEWS_API_KEY: str = os.getenv("NEWS_API_KEY", "")
    
    # AI Settings
    DEFAULT_GPT_TEMPERATURE: float = 0.7
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:5173",  # Vite default
        "http://localhost:3000",
        "http://localhost:8000",
        "http://localhost:8001",
        "http://localhost:8002",
        "http://localhost:8003",
        "http://127.0.0.1:8003",
    ]
    
    # Cache settings
    CACHE_TTL: int = 300  # 5 minutes
    
    model_config = {
        "case_sensitive": True
    }

# Create settings instance
settings = Settings() 