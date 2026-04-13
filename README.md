# WiseXpense (in progress)

WiseXpense is a self-hosted personal finance manager. It tracks spending, categorizes transactions, and provides financial insights. Your data stays local on your machine using an embedded SQLite database.

It uses Plaid's Development environment to connect real bank accounts (US and Canada supported) for free. Because it is self-hosted and single-user, there are no cloud subscriptions or required logins.

## Installation

Clone the repository and install the Python package. We recommend using a virtual environment.

```bash
git clone https://github.com/noahnghg/WiseXpense.git
cd WiseXpense

python3 -m venv .venv
source .venv/bin/activate
pip install -e .
```

## Configuration (One-Time Setup)

Because WiseXpense is 100% private and runs locally on your machine, you must use your own free Plaid developer keys to connect to real banks.

1. Create a free account at [dashboard.plaid.com/signup](https://dashboard.plaid.com/signup) (no credit card required).
2. Navigate to **Team Settings -> Keys** in your Plaid dashboard.
3. Run the interactive setup wizard in your terminal:
   ```bash
   wisexpense setup
   ```
4. Paste your `client_id` and your **Development** `secret` when prompted by the wizard.

*Note: The "Development" secret allows you to connect up to 100 real bank accounts for free. If you just want to test the UI with fake data, use the "Sandbox" secret.*

## Usage

Start the local server and open the web interface:

```bash
wisexpense start
```

Other available commands:

- `wisexpense info`: Check configuration and bank connection status
- `wisexpense reset`: Delete all local transaction data and drop the database
- `dbt run`: Run the analytical data pipeline (make sure your virtual environment is active)

## Architecture

- **Backend**: Python, FastAPI, SQLAlchemy
- **Data Engineering**: dbt (Data Build Tool) for transformations
- **Database (Transactional)**: SQLite (stored at `~/.wisexpense/wisexpense.db`)
- **Database (Analytical)**: DuckDB (stored at `~/.wisexpense/wisexpense_analytical.duckdb`)
- **Frontend**: React, Vite (bundled as static files within the Python package)
- **Integration**: Plaid API

## Security Note

Bank credentials are never stored. The application only accesses read-only data through Plaid access tokens. Because there are no user accounts, you should only run this application locally on trusted machines.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
