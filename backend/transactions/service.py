from datetime import date
from typing import Optional

from sqlalchemy.orm import Session
from plaid.model.transactions_sync_request import TransactionsSyncRequest

from plaid_integration.client import client
from transactions import repository
from users.model import User


def sync_and_persist(db: Session, user: User) -> dict:
    """
    Call Plaid /transactions/sync with cursor pagination,
    then persist all added/modified/removed transactions to the DB.
    Returns counts of added, modified, and removed transactions.
    """
    cursor = user.plaid_cursor or ""

    all_added = []
    all_modified = []
    all_removed = []

    has_more = True
    while has_more:
        request = TransactionsSyncRequest(
            access_token=user.plaid_access_token,
            cursor=cursor,
            count=100,
        )
        response = client.transactions_sync(request)

        all_added.extend(_plaid_txns_to_dicts(response["added"]))
        all_modified.extend(_plaid_txns_to_dicts(response["modified"]))
        all_removed.extend(response["removed"])

        has_more = response["has_more"]
        cursor = response["next_cursor"]

    # Persist to database
    added_count = repository.upsert_from_plaid(db, user.id, all_added)
    modified_count = repository.upsert_from_plaid(db, user.id, all_modified)

    removed_ids = [r.get("transaction_id", r) if isinstance(r, dict) else str(r) for r in all_removed]
    removed_count = repository.remove_by_plaid_ids(db, user.id, removed_ids)

    # Update cursor on user
    user.plaid_cursor = cursor
    db.commit()

    return {
        "added_count": added_count,
        "modified_count": modified_count,
        "removed_count": removed_count,
        "next_cursor": cursor,
    }


def _plaid_txns_to_dicts(plaid_txns: list) -> list[dict]:
    """Convert Plaid transaction objects to plain dicts for repository consumption."""
    result = []
    for txn in plaid_txns:
        # Plaid SDK returns model objects; convert to dict-like access
        if hasattr(txn, "to_dict"):
            result.append(txn.to_dict())
        elif isinstance(txn, dict):
            result.append(txn)
        else:
            # Fallback: access attributes directly
            pfc = getattr(txn, "personal_finance_category", None)
            result.append({
                "transaction_id": getattr(txn, "transaction_id", None),
                "name": getattr(txn, "name", "Unknown"),
                "merchant_name": getattr(txn, "merchant_name", None),
                "amount": getattr(txn, "amount", 0),
                "date": getattr(txn, "date", None),
                "authorized_date": getattr(txn, "authorized_date", None),
                "personal_finance_category": {
                    "primary": getattr(pfc, "primary", None),
                    "detailed": getattr(pfc, "detailed", None),
                } if pfc else None,
                "payment_channel": getattr(txn, "payment_channel", None),
                "iso_currency_code": getattr(txn, "iso_currency_code", None),
                "pending": getattr(txn, "pending", False),
                "logo_url": getattr(txn, "logo_url", None),
            })
    return result


def list_transactions(
    db: Session,
    user_id: int,
    page: int = 1,
    page_size: int = 50,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    category: Optional[str] = None,
    min_amount: Optional[float] = None,
    max_amount: Optional[float] = None,
    search: Optional[str] = None,
) -> tuple[list, int]:
    """List transactions with filters and pagination."""
    return repository.get_all(
        db, user_id, page, page_size,
        start_date, end_date, category,
        min_amount, max_amount, search,
    )


def get_transaction(db: Session, transaction_id: int, user_id: int):
    """Get a single transaction by ID."""
    return repository.get_by_id(db, transaction_id, user_id)


def delete_transaction(db: Session, transaction_id: int, user_id: int) -> bool:
    """Delete a transaction. Returns True if deleted."""
    deleted = repository.delete_by_id(db, transaction_id, user_id)
    if deleted:
        db.commit()
    return deleted


def get_summary(
    db: Session,
    user_id: int,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
) -> dict:
    """Get spending summary with category breakdown."""
    return repository.get_spending_summary(db, user_id, start_date, end_date)
