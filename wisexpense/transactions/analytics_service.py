from datetime import date
from typing import Optional


def get_analytical_summary(conn, start_date: Optional[date] = None, end_date: Optional[date] = None) -> dict:
    """
    Get spending summary with category breakdown directly from DuckDB Gold models.
    """
    # Assuming the models are populated, we'll gracefully handle if the table doesn't exist
    try:
        # Check if table exists
        conn.execute("SELECT 1 FROM monthly_spending_by_category LIMIT 1")
    except Exception:
        # Fallback if dbt hasn't run or table is missing
        return {
            "total_income": 0,
            "total_expenses": 0,
            "net_income": 0,
            "category_breakdown": [],
            "daily_spending": [],
            "message": "Analytical tables not built. Run dbt run"
        }

    where_clause = ""
    params = []
    if start_date and end_date:
        where_clause = "WHERE spend_month >= ? AND spend_month <= ?"
        params.extend([str(start_date), str(end_date)])

    # Get Category Breakdown
    query_categories = f"""
        SELECT category, SUM(total_amount) as amount
        FROM monthly_spending_by_category
        {where_clause}
        GROUP BY category
        ORDER BY amount DESC
    """
    result_categories = conn.execute(query_categories, params).fetchall()
    
    category_breakdown = [
        {"category": row[0], "amount": float(row[1])}
        for row in result_categories
    ]

    total_expenses = sum(c["amount"] for c in category_breakdown)
    
    # Get Daily Spending / Income from daily_metrics
    query_daily = f"""
        SELECT spend_date, total_expenses, total_income
        FROM daily_metrics
        ORDER BY spend_date ASC
        LIMIT 30
    """
    try:
        result_daily = conn.execute(query_daily).fetchall()
        daily_spending = [
            {
                "date": row[0].isoformat() if hasattr(row[0], 'isoformat') else str(row[0]),
                "expenses": float(row[1]),
                "income": float(row[2])
            }
            for row in result_daily
        ]
        total_income = sum(r["income"] for r in daily_spending)
    except Exception:
        daily_spending = []
        total_income = 0.0

    return {
        "total_income": total_income,
        "total_expenses": total_expenses,
        "net_income": total_income - total_expenses,
        "category_breakdown": category_breakdown,
        "daily_spending": daily_spending
    }
