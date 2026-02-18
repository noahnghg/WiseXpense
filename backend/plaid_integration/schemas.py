from pydantic import BaseModel

class PublicTokenExchangeRequest(BaseModel):
    public_token: str

class LinkTokenResponse(BaseModel):
    link_token: str

class TransactionSyncResponse(BaseModel):
    added: list
    modified: list
    removed: list
    has_more: bool
    next_cursor: str
