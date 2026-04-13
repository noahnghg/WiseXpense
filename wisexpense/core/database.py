from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import duckdb

from wisexpense.core.config import get_data_dir


def get_database_url() -> str:
    """Construct SQLite database URL."""
    data_dir = get_data_dir()
    db_path = data_dir / "wisexpense.db"
    return f"sqlite:///{db_path}"


# Create the SQLAlchemy engine for OLTP
engine = create_engine(
    get_database_url(),
    connect_args={"check_same_thread": False},  # Required for SQLite + FastAPI
    echo=False,
)

# Session factory for OLTP
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# DuckDB connection manager for Analytics (OLAP)
def get_duckdb_conn():
    """Returns a DuckDB connection mapped to the analytical database."""
    # Profiles.yml points to ~/.wisexpense/wisexpense_analytical.duckdb
    # We resolve ~/.wisexpense directly or use the one created by dbt
    from pathlib import Path
    db_path = Path.home() / ".wisexpense" / "wisexpense_analytical.duckdb"
    
    # We open in read_only mode for the frontend or write if needed. Let's use read_only=True so multiple workers can query it
    # We will use read_only=False if no database exists just to avoid crash, but read_only=True is strictly better if dbt populates it.
    conn = duckdb.connect(str(db_path), read_only=False)
    return conn

