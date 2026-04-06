import duckdb
from functools import lru_cache

from wisexpense.core.config import get_data_dir

def get_duckdb_path() -> str:
    """Get the path to the DuckDB analytical database."""
    data_dir = get_data_dir()
    db_path = data_dir / "wisexpense_analytical.duckdb"
    return str(db_path)

@lru_cache
def get_duckdb_connection() -> duckdb.DuckDBPyConnection:
    """
    Get a singleton connection to the DuckDB database.
    Since DuckDB strictly limits concurrent writes, we use a single connection for the application.
    """
    path = get_duckdb_path()
    # Connect with read_only=False if we need to write, 
    # but typically the app is reading the DuckDB instance built by the pipeline
    conn = duckdb.connect(database=path, read_only=False)
    return conn

def execute_analytical_query(query: str, parameters: list = None):
    """Execute a query against DuckDB and return results as a list of dictionaries."""
    conn = get_duckdb_connection()
    if parameters:
        cursor = conn.execute(query, parameters)
    else:
        cursor = conn.execute(query)
    
    # Fetch results as list of dicts
    columns = [desc[0] for desc in cursor.description]
    results = [dict(zip(columns, row)) for row in cursor.fetchall()]
    return results
