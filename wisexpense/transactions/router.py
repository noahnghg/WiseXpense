from datetime import date
from typing import Optional
from collections.abc import Generator

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from wisexpense.core.database import SessionLocal, get_duckdb_conn
from wisexpense.transactions import service, schemas, analytics_service

router = APIRouter()


def get_db() -> Generator[Session, None, None]:
    """Provide a database session per request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_olap_db():
    conn = get_duckdb_conn()
    try:
        yield conn
    finally:
        conn.close()


@router.get("/", response_model=schemas.TransactionListResponse)
def list_transactions(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(50, ge=1, le=100, description="Items per page"),
    start_date: Optional[date] = Query(None, description="Filter from date (YYYY-MM-DD)"),
    end_date: Optional[date] = Query(None, description="Filter to date (YYYY-MM-DD)"),
    category: Optional[str] = Query(None, description="Filter by category (e.g. FOOD_AND_DRINK)"),
    min_amount: Optional[float] = Query(None, description="Minimum amount"),
    max_amount: Optional[float] = Query(None, description="Maximum amount"),
    search: Optional[str] = Query(None, description="Search by name or merchant"),
    db: Session = Depends(get_db),
):
    """List transactions with filtering and pagination."""
    transactions, total = service.list_transactions(
        db,
        page=page, page_size=page_size,
        start_date=start_date, end_date=end_date,
        category=category,
        min_amount=min_amount, max_amount=max_amount,
        search=search,
    )
    return {
        "transactions": transactions,
        "total": total,
        "page": page,
        "page_size": page_size,
    }


@router.get("/summary")
def get_summary(
    start_date: Optional[date] = Query(None, description="Summary from date"),
    end_date: Optional[date] = Query(None, description="Summary to date"),
    conn = Depends(get_olap_db), # Analytical connection via DuckDB
):
    """Get spending/income summary with category breakdown directly from OLAP."""
    return analytics_service.get_analytical_summary(conn, start_date, end_date)



@router.get("/{transaction_id}", response_model=schemas.TransactionResponse)
def get_transaction(
    transaction_id: int,
    db: Session = Depends(get_db),
):
    """Get a single transaction by ID."""
    txn = service.get_transaction(db, transaction_id)
    if not txn:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return txn


@router.delete("/{transaction_id}")
def delete_transaction(
    transaction_id: int,
    db: Session = Depends(get_db),
):
    """Delete a transaction."""
    deleted = service.delete_transaction(db, transaction_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return {"message": "Transaction deleted successfully"}
