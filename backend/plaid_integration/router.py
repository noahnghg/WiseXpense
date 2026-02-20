from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from plaid.model.link_token_create_request import LinkTokenCreateRequest
from plaid.model.link_token_create_request_user import LinkTokenCreateRequestUser
from plaid.model.item_public_token_exchange_request import ItemPublicTokenExchangeRequest
from plaid.model.products import Products
from plaid.model.country_code import CountryCode

from core.dependencies import get_current_user, get_db
from core.config import get_settings
from users.model import User
from transactions import service as txn_service
from .client import client
from . import schemas

router = APIRouter()
settings = get_settings()


@router.post("/create_link_token", response_model=schemas.LinkTokenResponse)
def create_link_token(
    current_user: User = Depends(get_current_user)
):
    try:
        request = LinkTokenCreateRequest(
            products=[Products('transactions')],
            client_name=settings.APP_NAME,
            country_codes=[CountryCode('US')],
            language='en',
            user=LinkTokenCreateRequestUser(
                client_user_id=str(current_user.id)
            )
        )
        response = client.link_token_create(request)
        return {"link_token": response['link_token']}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/exchange_public_token")
def exchange_public_token(
    payload: schemas.PublicTokenExchangeRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        request = ItemPublicTokenExchangeRequest(
            public_token=payload.public_token
        )
        response = client.item_public_token_exchange(request)
        access_token = response['access_token']

        # Store access_token in User model
        current_user.plaid_access_token = access_token
        db.commit()
        
        return {"message": "Public token exchanged successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/transactions/sync", response_model=schemas.TransactionSyncResponse)
def sync_transactions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Sync transactions from Plaid and persist them to the database.
    Uses cursor-based pagination to fetch all pages.
    """
    if not current_user.plaid_access_token:
        raise HTTPException(status_code=400, detail="User has no Plaid access token. Connect a bank first.")

    try:
        result = txn_service.sync_and_persist(db, current_user)
        return result
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
