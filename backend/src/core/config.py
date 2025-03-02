from pydantic_settings import BaseSettings
from pydantic import Field, field_validator
from typing import Optional, List
import logging
import json
import os
from pathlib import Path

# Configure logging
logger = logging.getLogger(__name__)

class Settings(BaseSettings):
    # API Configuration
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "AI Assistant API"

    # MongoDB settings
    MONGODB_URL: str = "mongodb+srv://palvaiajay4730:Ajay18239@cluster1.xt0ps.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1"
    MONGODB_DB_NAME: str = "ai_assistance"

    # JWT settings
    SECRET_KEY: str = "ai_assistance_secret_key_2024"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # Ollama Configuration
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    OLLAMA_MODEL: str = "mistral"
    OLLAMA_TIMEOUT: int = 60

    # Security settings
    ENCRYPTION_KEY: str = "ai_assistance_encryption_key_2024"
    CORS_ORIGINS: str = Field('["http://localhost:3000"]', description="JSON array of allowed origins")
    RATE_LIMIT_REQUESTS: int = 100
    RATE_LIMIT_PERIOD: int = 60
    MAX_CONCURRENT_REQUESTS: int = 1000

    # Performance settings
    REQUEST_TIMEOUT: int = 30
    CACHE_TTL: int = 3600
    SESSION_TTL: int = 86400

    # Frontend settings (VITE)
    VITE_MONGODB_URI: str = "mongodb+srv://palvaiajay4730:Ajay18239@cluster1.xt0ps.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1"
    VITE_DB_NAME: str = "ai_assistance"
    VITE_JWT_SECRET: str = "ai_assistance_secret_key_2024"
    VITE_API_URL: str = "http://localhost:8000"
    VITE_AI_MODEL: str = "mistral"

    # Redis settings (optional)
    REDIS_HOST: Optional[str] = "localhost"
    REDIS_PORT: Optional[int] = 6379

    model_config = {
        "case_sensitive": True,
        "env_file": ".env",
        "extra": "allow"
    }

    @field_validator("CORS_ORIGINS")
    @classmethod
    def validate_cors_origins(cls, v: str) -> str:
        """Validate and parse CORS origins."""
        try:
            if not v or v.strip() == "":
                logger.warning("No CORS origins specified, defaulting to localhost")
                return '["http://localhost:3000"]'

            # Try to parse as JSON
            origins = json.loads(v)
            if not isinstance(origins, list):
                logger.warning("CORS_ORIGINS must be a JSON array, defaulting to localhost")
                return '["http://localhost:3000"]'

            # Validate each origin
            valid_origins = [
                origin for origin in origins
                if isinstance(origin, str) and (
                    origin.startswith('http://') or 
                    origin.startswith('https://') or 
                    origin == '*'
                )
            ]

            if not valid_origins:
                logger.warning("No valid origins found, defaulting to localhost")
                return '["http://localhost:3000"]'

            return json.dumps(valid_origins)

        except json.JSONDecodeError:
            logger.warning(f"Invalid CORS_ORIGINS format: {v}, defaulting to localhost")
            return '["http://localhost:3000"]'
        except Exception as e:
            logger.error(f"Error processing CORS_ORIGINS: {str(e)}")
            return '["http://localhost:3000"]'

    def get_cors_origins(self) -> List[str]:
        """Get the list of CORS origins."""
        try:
            origins = json.loads(self.CORS_ORIGINS)
            return origins if isinstance(origins, list) else ["http://localhost:3000"]
        except Exception:
            return ["http://localhost:3000"]

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        
        # Log important settings (excluding sensitive data)
        logger.info("Loading application settings:")
        logger.info(f"- Project Name: {self.PROJECT_NAME}")
        logger.info(f"- API Version: {self.API_V1_STR}")
        logger.info(f"- MongoDB URL: {self.MONGODB_URL}")
        logger.info(f"- Ollama Model: {self.OLLAMA_MODEL}")
        logger.info(f"- Ollama URL: {self.OLLAMA_BASE_URL}")
        logger.info(f"- CORS Origins: {self.get_cors_origins()}")

# Initialize settings
settings = Settings()