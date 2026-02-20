from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel


class TransactionResponse(BaseModel):
    id: int
    plaid_transaction_id: str
    name: str
    merchant_name: Optional[str] = None
    amount: float
    date: date
    authorized_date: Optional[date] = None
    category_primary: Optional[str] = None
    category_detailed: Optional[str] = None
    payment_channel: Optional[str] = None
    iso_currency_code: Optional[str] = None
    pending: bool = False
    logo_url: Optional[str] = None
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
    category_breakdown: list[CategoryBreakdown]
    start_date: Optional[date] = None
    end_date: Optional[date] = None
