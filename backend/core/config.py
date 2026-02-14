from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    DATABASE_URL: str
    PLAID_CLIENT_ID: str
    PLAID_SECRET: str

    # Add more settings as needed
    APP_NAME: str = "WiseXpense"
    DEBUG: bool = False

    class Config:
        env_file = "../.env"
        env_file_encoding = "utf-8"


@lru_cache
def get_settings() -> Settings:
    """Cached settings instance — reads .env once, reuses thereafter."""
    return Settings()
