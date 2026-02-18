import plaid
from plaid.api import plaid_api
from core.config import get_settings

settings = get_settings()

def get_plaid_client():
    configuration = plaid.Configuration(
        host=plaid.Environment.Sandbox if settings.PLAID_ENV == "sandbox" else plaid.Environment.Production,
        api_key={
            'clientId': settings.PLAID_CLIENT_ID,
            'secret': settings.PLAID_SECRET,
        }
    )
    api_client = plaid.ApiClient(configuration)
    return plaid_api.PlaidApi(api_client)

client = get_plaid_client()
