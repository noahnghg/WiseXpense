import duckdb
from fastapi import APIRouter, HTTPException

from wisexpense.core.duckdb_client import execute_analytical_query

router = APIRouter()

@router.get("/spending/monthly")
def get_monthly_spending():
    """
    Fetch the aggregated monthly spending from the Data Warehouse Gold tier.
    Provides significantly faster analytics for the React dashboard.
    """
    try:
        # Query the dbt-generated Gold view
        # We wrap in TRY/CATCH in case the Dagster/dbt pipeline hasn't run yet
        query = """
            SELECT 
                spend_month::VARCHAR as month,
                personal_finance_category as category,
                CAST(total_spend AS FLOAT) as total_amount,
                CAST(transaction_count AS INTEGER) as tx_count
            FROM gold_monthly_spend_by_category
            ORDER BY spend_month DESC, total_spend DESC
            LIMIT 100
        """
        results = execute_analytical_query(query)
        return {"data": results}
    except duckdb.CatalogException:
        # The table likely doesn't exist yet because pipeline hasn't run
        return {"data": [], "message": "Data pipeline has not compiled the Gold tier yet."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
