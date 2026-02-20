from datetime import date
from typing import Optional

from sqlalchemy import func
from sqlalchemy.orm import Session

from transactions.model import Transaction


def get_by_id(db: Session, transaction_id: int, user_id: int) -> Optional[Transaction]:
    """Fetch a single transaction by ID, scoped to a user."""
    return (
        db.query(Transaction)
        .filter(Transaction.id == transaction_id, Transaction.user_id == user_id)
        .first()
    )


def get_by_plaid_id(db: Session, plaid_transaction_id: str) -> Optional[Transaction]:
    """Fetch a transaction by its Plaid transaction ID."""
    return (
        db.query(Transaction)
        .filter(Transaction.plaid_transaction_id == plaid_transaction_id)
        .first()
    )


def get_all(
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
) -> tuple[list[Transaction], int]:
    """Fetch filtered & paginated transactions for a user. Returns (transactions, total_count)."""
    query = db.query(Transaction).filter(Transaction.user_id == user_id)

    if start_date:
        query = query.filter(Transaction.date >= start_date)
    if end_date:
        query = query.filter(Transaction.date <= end_date)
    if category:
        query = query.filter(Transaction.category_primary == category)
    if min_amount is not None:
        query = query.filter(Transaction.amount >= min_amount)
    if max_amount is not None:
        query = query.filter(Transaction.amount <= max_amount)
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (Transaction.name.ilike(search_term))
            | (Transaction.merchant_name.ilike(search_term))
        )

    total = query.count()

    transactions = (
        query.order_by(Transaction.date.desc(), Transaction.id.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )

    return transactions, total


def upsert_from_plaid(db: Session, user_id: int, plaid_transactions: list[dict]) -> int:
    """Insert new or update existing transactions from Plaid sync data. Returns count processed."""
    count = 0
    for txn in plaid_transactions:
        plaid_id = txn.get("transaction_id")
        existing = get_by_plaid_id(db, plaid_id)

        # Extract personal_finance_category safely
        pfc = txn.get("personal_finance_category") or {}
        category_primary = pfc.get("primary") if isinstance(pfc, dict) else None
        category_detailed = pfc.get("detailed") if isinstance(pfc, dict) else None

        txn_data = {
            "user_id": user_id,
            "plaid_transaction_id": plaid_id,
            "name": txn.get("name", "Unknown"),
            "merchant_name": txn.get("merchant_name"),
            "amount": txn.get("amount", 0),
            "date": txn.get("date"),
            "authorized_date": txn.get("authorized_date"),
            "category_primary": category_primary,
            "category_detailed": category_detailed,
            "payment_channel": txn.get("payment_channel"),
            "iso_currency_code": txn.get("iso_currency_code"),
            "pending": txn.get("pending", False),
            "logo_url": txn.get("logo_url"),
        }

        if existing:
            # Update existing transaction
            for key, value in txn_data.items():
                setattr(existing, key, value)
        else:
            # Insert new transaction
            db.add(Transaction(**txn_data))

        count += 1

    return count


def remove_by_plaid_ids(db: Session, user_id: int, plaid_ids: list[str]) -> int:
    """Delete transactions by their Plaid IDs. Returns count removed."""
    if not plaid_ids:
        return 0

    count = (
        db.query(Transaction)
        .filter(
            Transaction.user_id == user_id,
            Transaction.plaid_transaction_id.in_(plaid_ids),
        )
        .delete(synchronize_session=False)
    )
    return count


def delete_by_id(db: Session, transaction_id: int, user_id: int) -> bool:
    """Delete a single transaction. Returns True if deleted."""
    txn = get_by_id(db, transaction_id, user_id)
    if not txn:
        return False
    db.delete(txn)
    return True


def get_spending_summary(
    db: Session,
    user_id: int,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
) -> dict:
    """Get aggregated spending/income summary with category breakdown."""
    query = db.query(Transaction).filter(Transaction.user_id == user_id)

    if start_date:
        query = query.filter(Transaction.date >= start_date)
    if end_date:
        query = query.filter(Transaction.date <= end_date)

    transactions = query.all()

    total_spending = sum(t.amount for t in transactions if t.amount > 0)
    total_income = sum(abs(t.amount) for t in transactions if t.amount < 0)

    # Category breakdown (spending only)
    category_map: dict[str, dict] = {}
    for t in transactions:
        if t.amount > 0 and t.category_primary:
            cat = t.category_primary
            if cat not in category_map:
                category_map[cat] = {"category": cat, "total": 0.0, "count": 0}
            category_map[cat]["total"] += t.amount
            category_map[cat]["count"] += 1

    category_breakdown = sorted(
        category_map.values(), key=lambda x: x["total"], reverse=True
    )

    return {
        "total_spending": round(total_spending, 2),
        "total_income": round(total_income, 2),
        "net": round(total_income - total_spending, 2),
        "transaction_count": len(transactions),
        "category_breakdown": category_breakdown,
        "start_date": start_date,
        "end_date": end_date,
    }
