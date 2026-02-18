from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings — non-DB config only (DB is handled in database.py)."""

    PLAID_CLIENT_ID: str
    PLAID_SECRET: str

    APP_NAME: str = "WiseXpense"
    DEBUG: bool = False

    # Security
    SECRET_KEY: str  # e.g. run "openssl rand -hex 32"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # Plaid
    PLAID_ENV: str = "sandbox"
    PLAID_CLIENT_ID: str
    PLAID_SECRET: str
    PLAID_VERSION: str = "2020-09-14"

    class Config:
        env_file = "../.env"
        env_file_encoding = "utf-8"
        extra = "ignore"


@lru_cache
def get_settings() -> Settings:
    """Cached settings instance — reads .env once, reuses thereafter."""
    return Settings()
