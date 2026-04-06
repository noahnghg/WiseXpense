from dagster import asset, get_dagster_logger
from plaid.model.transactions_sync_request import TransactionsSyncRequest
import pandas as pd

from wisexpense.plaid_integration.client import get_plaid_client
from wisexpense.core.config import get_settings
from wisexpense.core.duckdb_client import get_duckdb_connection
from wisexpense.transactions.service import _plaid_txns_to_dicts

@asset
def raw_plaid_transactions() -> list:
    """Fetch raw transaction data from Plaid API and load into DuckDB Bronze layer."""
    logger = get_dagster_logger()
    settings = get_settings()
    access_token = settings.PLAID_ACCESS_TOKEN
    
    if not access_token:
        logger.warning("No Plaid Access Token configured. Skipping sync.")
        return []
        
    client = get_plaid_client()
    
    cursor = "" 
    all_added = []
    
    has_more = True
    while has_more:
        request = TransactionsSyncRequest(
            access_token=access_token,
            cursor=cursor,
            count=500,
        )
        response = client.transactions_sync(request)
        all_added.extend(_plaid_txns_to_dicts(response["added"]))
        
        has_more = response["has_more"]
        cursor = response["next_cursor"]
        if len(all_added) > 10000: # safety limit
            break
            
    logger.info(f"Fetched {len(all_added)} transactions from Plaid.")
    
    if not all_added:
        return []
        
    # Load into Bronze Layer
    df = pd.DataFrame(all_added)
    
    # Store complex types as string to prevent duckdb casting errors on structs
    for col in df.columns:
        if df[col].apply(lambda x: isinstance(x, (dict, list))).any():
            df[col] = df[col].astype(str)
            
    conn = get_duckdb_connection()
    conn.execute("CREATE SCHEMA IF NOT EXISTS bronze_layer")
    conn.execute("CREATE OR REPLACE TABLE bronze_layer.raw_transactions AS SELECT * FROM df")
    
    logger.info("Successfully loaded data into DuckDB: bronze_layer.raw_transactions")
    
    return all_added
