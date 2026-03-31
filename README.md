# WiseXpense

WiseXpense is a self-hosted, personal financial manager. It allows you to automatically track your spending, categorize transactions, and view beautiful charts of your financial behavior. 

No cloud subscriptions required—you host it yourself, and your financial data stays on your machine. We use Plaid's Development environment to let you connect real, live bank accounts (including US and Canadian institutions) completely for free.

---

## 🚀 Quick Start

WiseXpense is a Python package that bundles both the backend API and the frontend UI into a single seamless installation.

### 1. Install
```bash
# Clone the repository
git clone https://github.com/noahnghg/WiseXpense.git
cd WiseXpense

# Create a virtual environment and install the package
python3 -m venv .venv
source .venv/bin/activate
pip install -e .
```

### 2. Configure Plaid API Keys
You will need your own free Plaid API keys to connect your bank.
1. Sign up for a free developer account at [dashboard.plaid.com](https://dashboard.plaid.com).
2. Go to the **Keys** section to get your `client_id` and `secret` (use the **Development** secret).
3. Run the interactive setup wizard:
```bash
wisexpense setup
```

### 3. Start the App
Start the local server and automatically open the UI in your browser:
```bash
wisexpense start
```

## 🧠 Architecture

WiseXpense was designed to be as simple as possible to self-host for single users:
- **No Docker needed**: Uses an embedded **SQLite** database stored locally at `~/.wisexpense/wisexpense.db`.
- **Everything in one package**: The **React** frontend is pre-built and embedded inside the Python package, served by the **FastAPI** backend natively.
- **Agentic**: Will automatically categorize and manage your tracking using smart, localized logic.

## 🛠️ CLI Commands
The `wisexpense` CLI provides all the tools you need to manage your app:
- `wisexpense setup` — Configure your app and add Plaid API keys
- `wisexpense start` — Start the local server
- `wisexpense info` — Check your setup and bank connection status
- `wisexpense reset` — Wipe the database and start fresh

## ⚠️ Data & Security
WiseXpense is **single-user by design**. There is no login screen or user authentication. Since it runs locally on your machine on `localhost`, security is entirely reliant on your machine's safety. Plaid handles bank credentials—WiseXpense only receives an access token to sync your data.
