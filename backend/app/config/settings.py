import os
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    # App Settings
    PROJECT_NAME: str = "VELORA Backend"
    API_V1_STR: str = "/api"
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # CORS Settings
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ]
    
    # Database Settings
    MONGODB_URI: str = os.getenv("MONGODB_URI", "")
    DATABASE_NAME: str = os.getenv("DATABASE_NAME", "velora_db")
    
    # JWT Settings
    JWT_SECRET: str = os.getenv("JWT_SECRET", "velora-super-secret-key-cinema-documentary-story-engine")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 Days for comfortable reader sessions

    # Fallback storage path (for offline database connection simulation)
    LOCAL_DB_DIR: str = os.getenv("LOCAL_DB_DIR", "backend_data")

    # Gemini API Settings
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")


    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
