from datetime import date, datetime, timezone
from sqlalchemy import Column, Integer, String, Float, Boolean, Date, DateTime
from wisexpense.models.base import Base

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    provider_transaction_id = Column(String, unique=True, index=True, nullable=False)
    account_id = Column(String, nullable=False, default="default")

    # Core transaction data
    description = Column(String, nullable=False)
    payee = Column(String, nullable=True)
    amount = Column(Float, nullable=False)
    date = Column(Date, nullable=False)

    currency = Column(String, nullable=True)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )
