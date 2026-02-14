from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings — non-DB config only (DB is handled in database.py)."""

    PLAID_CLIENT_ID: str
    PLAID_SECRET: str

    APP_NAME: str = "WiseXpense"
    DEBUG: bool = False

    class Config:
        env_file = "../.env"
        env_file_encoding = "utf-8"
        extra = "ignore"


@lru_cache
def get_settings() -> Settings:
    """Cached settings instance — reads .env once, reuses thereafter."""
    return Settings()
