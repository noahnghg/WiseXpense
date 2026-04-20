import base64
import requests
import json

from wisexpense.core.config import get_settings

def claim_setup_token(setup_token: str) -> str:
    """Exchange SimpleFIN setup token for an Access URL."""
    try:
        claim_url = base64.b64decode(setup_token).decode('utf-8')
    except Exception as e:
        raise ValueError("Invalid setup token format (must be base64)") from e

    response = requests.post(claim_url, headers={'Content-Length': '0'})
    
    if response.status_code == 200:
        return response.text.strip()
    else:
        raise Exception(f"Error claiming token: {response.status_code} - {response.text}")


def fetch_accounts_and_transactions(start_date=None, end_date=None):
    """Fetch data from SimpleFIN Access URL."""
    settings = get_settings()
    access_url = settings.SIMPLEFIN_ACCESS_URL
    if not access_url:
        raise ValueError("SimpleFIN Access URL is not configured.")
        
    url = f"{access_url}/accounts?version=2"
    params = []
    if start_date:
        params.append(f"start-date={start_date}")
    if end_date:
        params.append(f"end-date={end_date}")
    
    if params:
        url += "&" + "&".join(params)
    
    response = requests.get(url)
    
    if response.status_code != 200:
        raise Exception(f"Failed to fetch data: {response.status_code} - {response.text}")
        
    return response.json()
