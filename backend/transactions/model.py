from datetime import date, datetime, timezone
from sqlalchemy import Column, Integer, String, Float, Boolean, Date, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from models.base import Base


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    plaid_transaction_id = Column(String, unique=True, index=True, nullable=False)

    # Core transaction data
    name = Column(String, nullable=False)
    merchant_name = Column(String, nullable=True)
    amount = Column(Float, nullable=False)  # Plaid: positive = expense, negative = income
    date = Column(Date, nullable=False)
    authorized_date = Column(Date, nullable=True)

    # Categorization
    category_primary = Column(String, nullable=True)    # e.g. "FOOD_AND_DRINK"
    category_detailed = Column(String, nullable=True)   # e.g. "FOOD_AND_DRINK_GROCERIES"

    # Payment info
    payment_channel = Column(String, nullable=True)     # "online", "in store", "other"
    iso_currency_code = Column(String, nullable=True, default="USD")
    pending = Column(Boolean, default=False)

    # Branding
    logo_url = Column(String, nullable=True)

    # Timestamps
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationship
    user = relationship("User", back_populates="transactions")
