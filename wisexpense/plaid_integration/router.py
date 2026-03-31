from collections.abc import Generator

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from plaid.model.link_token_create_request import LinkTokenCreateRequest
from plaid.model.link_token_create_request_user import LinkTokenCreateRequestUser
from plaid.model.item_public_token_exchange_request import ItemPublicTokenExchangeRequest
from plaid.model.products import Products
from plaid.model.country_code import CountryCode

from wisexpense.core.config import get_settings, save_config
from wisexpense.core.database import SessionLocal
from wisexpense.transactions import service as txn_service
from wisexpense.plaid_integration.client import get_plaid_client
from wisexpense.plaid_integration import schemas

router = APIRouter()


def get_db() -> Generator[Session, None, None]:
    """Provide a database session per request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/status")
def plaid_status():
    """Check if Plaid is configured and a bank is connected."""
    settings = get_settings()
    return {
        "configured": bool(settings.PLAID_CLIENT_ID and settings.PLAID_SECRET),
        "connected": bool(settings.PLAID_ACCESS_TOKEN),
        "environment": settings.PLAID_ENV,
    }


@router.post("/create_link_token", response_model=schemas.LinkTokenResponse)
def create_link_token():
    """Create a Plaid Link token for connecting a bank account."""
    settings = get_settings()

    if not settings.PLAID_CLIENT_ID or not settings.PLAID_SECRET:
        raise HTTPException(
            status_code=400,
            detail="Plaid is not configured. Run 'wisexpense setup' first.",
        )

    # Parse country codes from config (e.g. "US,CA")
    country_codes = [
        CountryCode(code.strip())
        for code in settings.PLAID_COUNTRY_CODES.split(",")
    ]

    # Parse products from config (e.g. "transactions")
    products = [
        Products(product.strip())
        for product in settings.PLAID_PRODUCTS.split(",")
    ]

    try:
        client = get_plaid_client()
        request = LinkTokenCreateRequest(
            products=products,
            client_name=settings.APP_NAME,
            country_codes=country_codes,
            language="en",
            user=LinkTokenCreateRequestUser(
                client_user_id="wisexpense-user"
            ),
        )
        response = client.link_token_create(request)
        return {"link_token": response["link_token"]}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/exchange_public_token")
def exchange_public_token(payload: schemas.PublicTokenExchangeRequest):
    """Exchange a public token for an access token and store it."""
    try:
        client = get_plaid_client()
        request = ItemPublicTokenExchangeRequest(
            public_token=payload.public_token
        )
        response = client.item_public_token_exchange(request)
        access_token = response["access_token"]
        item_id = response["item_id"]

        # Save access token to config
        save_config(
            PLAID_ACCESS_TOKEN=access_token,
            PLAID_ITEM_ID=item_id,
        )

        return {"message": "Bank connected successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/transactions/sync", response_model=schemas.TransactionSyncResponse)
def sync_transactions(db: Session = Depends(get_db)):
    """Sync transactions from Plaid and persist them to the database."""
    settings = get_settings()

    if not settings.PLAID_ACCESS_TOKEN:
        raise HTTPException(
            status_code=400,
            detail="No bank connected. Connect a bank first.",
        )

    try:
        result = txn_service.sync_and_persist(db)
        return result
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
