from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from core.config import get_settings

settings = get_settings()

# Create the SQLAlchemy engine
# pool_pre_ping ensures stale connections to Supabase are recycled
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
    pool_size=5,
    max_overflow=10,
)

# Session factory — each call to SessionLocal() creates a new DB session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
