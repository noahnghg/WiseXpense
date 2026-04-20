from datetime import date
from typing import Optional

from sqlalchemy import func
from sqlalchemy.orm import Session

from wisexpense.transactions.model import Transaction


def get_by_id(db: Session, transaction_id: int) -> Optional[Transaction]:
    """Fetch a single transaction by ID."""
    return db.query(Transaction).filter(Transaction.id == transaction_id).first()


def get_by_provider_id(db: Session, provider_transaction_id: str) -> Optional[Transaction]:
    """Fetch a transaction by its provider transaction ID."""
    return (
        db.query(Transaction)
        .filter(Transaction.provider_transaction_id == provider_transaction_id)
        .first()
    )


def get_all(
    db: Session,
    page: int = 1,
    page_size: int = 50,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    search: Optional[str] = None,
) -> tuple[list[Transaction], int]:
    """Fetch filtered & paginated transactions. Returns (transactions, total_count)."""
    query = db.query(Transaction)

    if start_date:
        query = query.filter(Transaction.date >= start_date)
    if end_date:
        query = query.filter(Transaction.date <= end_date)
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (Transaction.description.ilike(search_term))
            | (Transaction.payee.ilike(search_term))
        )

    total = query.count()

    transactions = (
        query.order_by(Transaction.date.desc(), Transaction.id.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )

    return transactions, total


def upsert_from_provider(db: Session, transactions: list[dict]) -> int:
    """Insert new or update existing transactions from sync data. Returns count processed."""
    count = 0
    for txn_data in transactions:
        provider_id = txn_data.get("provider_transaction_id")
        existing = get_by_provider_id(db, provider_id)

        if existing:
            for key, value in txn_data.items():
                setattr(existing, key, value)
        else:
            db.add(Transaction(**txn_data))

        count += 1

    return count


def delete_by_id(db: Session, transaction_id: int) -> bool:
    """Delete a single transaction. Returns True if deleted."""
    txn = get_by_id(db, transaction_id)
    if not txn:
        return False
    db.delete(txn)
    return True


def get_spending_summary(
    db: Session,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
) -> dict:
    """Get aggregated spending/income summary."""
    query = db.query(Transaction)

    if start_date:
        query = query.filter(Transaction.date >= start_date)
    if end_date:
        query = query.filter(Transaction.date <= end_date)

    transactions = query.all()

    # In SimpleFIN: negative is expense
    total_spending = sum(abs(t.amount) for t in transactions if t.amount < 0)
    total_income = sum(t.amount for t in transactions if t.amount > 0)

    return {
        "total_spending": round(total_spending, 2),
        "total_income": round(total_income, 2),
        "net": round(total_income - total_spending, 2),
        "transaction_count": len(transactions),
        "start_date": start_date,
        "end_date": end_date,
    }
