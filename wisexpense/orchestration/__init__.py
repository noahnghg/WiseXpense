from dagster import Definitions, load_assets_from_modules

from .assets import plaid_assets

all_assets = load_assets_from_modules([plaid_assets])

defs = Definitions(
    assets=all_assets,
    jobs=[],
    schedules=[],
)
