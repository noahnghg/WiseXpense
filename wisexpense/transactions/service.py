from datetime import date, datetime, timezone
from typing import Optional

from sqlalchemy.orm import Session

from wisexpense.simplefin_integration.client import fetch_accounts_and_transactions
from wisexpense.transactions import repository


def sync_and_persist(db: Session) -> dict:
    """
    Call SimpleFIN to fetch accounts and transactions,
    then persist all transactions to the DB.
    """
    try:
        data = fetch_accounts_and_transactions()
    except Exception as e:
        raise Exception(f"SimpleFIN bridge error: {e}")
    
    all_txns = []
    for account in data.get("accounts", []):
        account_id = account.get("id")
        currency = account.get("currency", "USD")
        
        for txn in account.get("transactions", []):
            try:
                txn_date = datetime.fromtimestamp(int(txn.get("posted", 0)), tz=timezone.utc).date()
            except:
                txn_date = date.today()
                
            amount_str = txn.get("amount", "0")
            try:
                amount = float(amount_str)
            except:
                amount = 0.0
                
            all_txns.append({
                "provider_transaction_id": txn.get("id"),
                "account_id": account_id,
                "description": txn.get("description", "Unknown"),
                "payee": txn.get("payee", None),
                "amount": amount,
                "date": txn_date,
                "currency": currency,
            })
            
    upserted_count = repository.upsert_from_provider(db, all_txns)
    db.commit()

    return {
        "sync_count": len(all_txns),
        "upserted_count": upserted_count,
    }


def list_transactions(
    db: Session,
    page: int = 1,
    page_size: int = 50,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    search: Optional[str] = None,
) -> tuple[list, int]:
    """List transactions with filters and pagination."""
    return repository.get_all(
        db, page, page_size,
        start_date, end_date, search
    )


def get_transaction(db: Session, transaction_id: int):
    """Get a single transaction by ID."""
    return repository.get_by_id(db, transaction_id)


def delete_transaction(db: Session, transaction_id: int) -> bool:
    """Delete a transaction. Returns True if deleted."""
    deleted = repository.delete_by_id(db, transaction_id)
    if deleted:
        db.commit()
    return deleted


def get_summary(
    db: Session,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
) -> dict:
    """Get basic spending summary."""
    return repository.get_spending_summary(db, start_date, end_date)
