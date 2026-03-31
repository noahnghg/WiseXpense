from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from wisexpense.core.config import get_data_dir


def get_database_url() -> str:
    """Construct SQLite database URL."""
    data_dir = get_data_dir()
    db_path = data_dir / "wisexpense.db"
    return f"sqlite:///{db_path}"


# Create the SQLAlchemy engine
engine = create_engine(
    get_database_url(),
    connect_args={"check_same_thread": False},  # Required for SQLite + FastAPI
    echo=False,
)

# Session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
