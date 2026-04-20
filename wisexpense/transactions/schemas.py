from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel


class TransactionResponse(BaseModel):
    id: int
    provider_transaction_id: str
    account_id: str
    description: str
    payee: Optional[str] = None
    amount: float
    date: date
    currency: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class TransactionListResponse(BaseModel):
    transactions: list[TransactionResponse]
    total: int
    page: int
    page_size: int


class CategoryBreakdown(BaseModel):
    category: str
    total: float
    count: int


class TransactionSummaryResponse(BaseModel):
    total_spending: float
    total_income: float
    net: float
    transaction_count: int
    category_breakdown: Optional[list[CategoryBreakdown]] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
