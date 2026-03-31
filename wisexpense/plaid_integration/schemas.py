from pydantic import BaseModel


class PublicTokenExchangeRequest(BaseModel):
    public_token: str


class LinkTokenResponse(BaseModel):
    link_token: str


class TransactionSyncResponse(BaseModel):
    added_count: int
    modified_count: int
    removed_count: int
    next_cursor: str
