from collections.abc import Generator

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from wisexpense.core.config import get_settings
from wisexpense.core.database import SessionLocal
from wisexpense.transactions import service as txn_service

router = APIRouter()


def get_db() -> Generator[Session, None, None]:
    """Provide a database session per request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/status")
def simplefin_status():
    """Check if SimpleFIN is configured."""
    settings = get_settings()
    return {
        "configured": bool(settings.SIMPLEFIN_SETUP_TOKEN),
        "connected": bool(settings.SIMPLEFIN_ACCESS_URL),
    }


@router.post("/transactions/sync")
def sync_transactions(db: Session = Depends(get_db)):
    """Sync transactions from SimpleFIN and persist them to the database."""
    settings = get_settings()

    if not settings.SIMPLEFIN_ACCESS_URL:
        raise HTTPException(
            status_code=400,
            detail="No bank connected. Run 'wisexpense setup'.",
        )

    try:
        result = txn_service.sync_and_persist(db)
        return result
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
