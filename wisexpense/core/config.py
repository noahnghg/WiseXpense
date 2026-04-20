import os
from pathlib import Path
from functools import lru_cache

from pydantic_settings import BaseSettings


# Default data directory: ~/.wisexpense/
DEFAULT_DATA_DIR = Path.home() / ".wisexpense"


class Settings(BaseSettings):
    """Application settings — loaded from ~/.wisexpense/config.env."""

    APP_NAME: str = "WiseXpense"
    DEBUG: bool = False

    # Data directory
    DATA_DIR: str = str(DEFAULT_DATA_DIR)

    # SimpleFIN
    SIMPLEFIN_SETUP_TOKEN: str = ""
    SIMPLEFIN_ACCESS_URL: str = ""
    
    # AI Agent
    AI_PROVIDER: str = "gemini" # gemini | claude | openai | ollama
    AI_API_KEY: str = ""

    # Server
    HOST: str = "127.0.0.1"
    PORT: int = 8000

    class Config:
        env_file = str(DEFAULT_DATA_DIR / "config.env")
        env_file_encoding = "utf-8"
        extra = "ignore"


@lru_cache
def get_settings() -> Settings:
    """Cached settings instance — reads config.env once, reuses thereafter."""
    config_path = DEFAULT_DATA_DIR / "config.env"
    if config_path.exists():
        return Settings(_env_file=str(config_path))
    return Settings()


def get_data_dir() -> Path:
    """Get the data directory, creating it if necessary."""
    data_dir = Path(get_settings().DATA_DIR)
    data_dir.mkdir(parents=True, exist_ok=True)
    return data_dir


def save_config(**kwargs: str) -> None:
    """Write or update key-value pairs in ~/.wisexpense/config.env."""
    config_path = Path(get_settings().DATA_DIR) / "config.env"
    config_path.parent.mkdir(parents=True, exist_ok=True)

    # Read existing config
    existing = {}
    if config_path.exists():
        for line in config_path.read_text().splitlines():
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                key, _, value = line.partition("=")
                existing[key.strip()] = value.strip()

    # Update with new values
    existing.update(kwargs)

    # Write back
    lines = [f"{key}={value}" for key, value in existing.items()]
    config_path.write_text("\n".join(lines) + "\n")
