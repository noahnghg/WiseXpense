# WiseXpense

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

## Configuration

To connect your bank, you must create a free Plaid developer account.

1. Create an account at [dashboard.plaid.com](https://dashboard.plaid.com).
2. Retrieve your `client_id` and `secret` (Development environment) from the Keys section. 
3. Run the setup CLI tool to save these credentials locally:

```bash
wisexpense setup
```

## Usage

Start the local server and open the web interface:

```bash
wisexpense start
```

Other available commands:

- `wisexpense info`: Check configuration and bank connection status
- `wisexpense reset`: Delete all local transaction data and drop the database

## Architecture

- **Backend**: Python, FastAPI, SQLAlchemy
- **Database**: SQLite (stored at `~/.wisexpense/wisexpense.db`)
- **Frontend**: React, Vite (bundled as static files within the Python package)
- **Integration**: Plaid API

## Security Note

Bank credentials are never stored. The application only accesses read-only data through Plaid access tokens. Because there are no user accounts, you should only run this application locally on trusted machines.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
