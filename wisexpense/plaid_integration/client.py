import plaid
from plaid.api import plaid_api

from wisexpense.core.config import get_settings


def get_plaid_client() -> plaid_api.PlaidApi:
    """Create a Plaid API client based on current settings."""
    settings = get_settings()

    env_map = {
        "sandbox": plaid.Environment.Sandbox,
        "development": plaid.Environment.Development,
        "production": plaid.Environment.Production,
    }

    host = env_map.get(settings.PLAID_ENV.lower(), plaid.Environment.Development)

    configuration = plaid.Configuration(
        host=host,
        api_key={
            "clientId": settings.PLAID_CLIENT_ID,
            "secret": settings.PLAID_SECRET,
        },
    )
    api_client = plaid.ApiClient(configuration)
    return plaid_api.PlaidApi(api_client)
