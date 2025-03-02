from pydantic_settings import BaseSettings
from pydantic import ConfigDict
from typing import List
import os
from datetime import timedelta

class Settings(BaseSettings):
    model_config = ConfigDict(
        env_file=".env",
        case_sensitive=True,
        extra="allow"  # Allow extra fields from env file
    )

    # Project Info
    PROJECT_NAME: str = "AI Assistant API"
    API_V1_STR: str = "/api/v1"
    VERSION: str = "1.0.0"

    # MongoDB settings
    MONGODB_URL: str = "mongodb://localhost:27017"
    MONGODB_DB_NAME: str = "ai_assistant"

    # JWT Settings
    JWT_SECRET: str = "your-secret-key-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    JWT_SECRET_KEY: str = "ai_assistance_secret_key_2024_extended"

    # AI settings
    HUGGINGFACE_API_KEY: str = ""
    AI_MODEL_NAME: str = "google/flan-t5-base"
    EMBEDDING_MODEL_NAME: str = "sentence-transformers/all-MiniLM-L6-v2"
    
    # ML Model Paths
    ROOT_CAUSE_MODEL_PATH: str = os.path.join("models", "root_cause_model")
    PREDICTIVE_MODEL_PATH: str = os.path.join("models", "predictive_model")
    MODELS_DIR: str = "models"

    # Redis settings
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_DB: int = 0
    REDIS_PASSWORD: str = ""

    # Security settings
    CORS_ORIGINS: List[str] = ["*"]
    RATE_LIMIT: int = 100
    RATE_LIMIT_PERIOD: int = 60
    ENCRYPTION_KEY: str = "ai_assistance_encryption_key_2024"
    RATE_LIMIT_REQUESTS: int = 100

    # Performance settings
    REQUEST_TIMEOUT: int = 30
    CACHE_TTL: int = 3600
    MAX_CONNECTIONS: int = 10
    MAX_CONCURRENT_REQUESTS: int = 1000
    SESSION_TTL: int = 86400

    # Frontend settings
    VITE_MONGODB_URI: str = "mongodb://localhost:27017"
    VITE_DB_NAME: str = "ai_assistance"
    VITE_JWT_SECRET: str = "ai_assistance_secret_key_2024"
    VITE_API_URL: str = "http://localhost:8000"
    VITE_HUGGINGFACE_API_KEY: str = ""
    VITE_HUGGINGFACE_MODEL: str = "google/flan-t5-large"

    # Computed properties
    @property
    def JWT_EXPIRES(self) -> timedelta:
        return timedelta(minutes=self.ACCESS_TOKEN_EXPIRE_MINUTES)

    @property
    def REFRESH_TOKEN_EXPIRES(self) -> timedelta:
        return timedelta(days=self.REFRESH_TOKEN_EXPIRE_DAYS)

settings = Settings() 