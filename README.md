# WiseXpense (in progress)

WiseXpense is a self-hosted, agentic personal finance manager. It tracks spending, categorizes transactions, and provides financial insights via a conversational AI interface. Your data stays local on your machine using an embedded SQLite database.

It uses SimpleFIN Bridge to securely connect read-only bank accounts. Because it is self-hosted and single-user, there are no cloud subscriptions or required logins.

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

Because WiseXpense is 100% private and runs locally on your machine, you must use your own SimpleFIN token to connect to banks securely. The conversational agent requires configuring your preferred LLM provider.

1. Visit [bridge.simplefin.org](https://bridge.simplefin.org/) to connect your bank and copy your Setup Token.
2. Run the interactive setup wizard in your terminal:
   ```bash
   wisexpense setup
   ```
3. Paste your SimpleFIN token when prompted.
4. Select your preferred AI Provider (Gemini is recommended, but Claude, OpenAI, and local Ollama are supported) and provide the respective API key.

## Usage

Start the local server and open the web interface:

```bash
wisexpense start
```

Upon starting, the application will initialize the agentic brain, connect to the SimpleFIN bridge, and fetch real-time financial data before displaying the interactive dashboard.

Other available commands:

- `wisexpense info`: Check configuration and bank connection status
- `wisexpense reset`: Delete all local transaction data and drop the database
- `dbt run`: Run the analytical data pipeline (make sure your virtual environment is active)

## Architecture

- **Backend**: Python, FastAPI, SQLAlchemy
- **AI Agent**: LangGraph, LangChain
- **Data Engineering**: dbt (Data Build Tool) for transformations
- **Database (Transactional)**: SQLite (stored at `~/.wisexpense/wisexpense.db`)
- **Database (Analytical)**: DuckDB (stored at `~/.wisexpense/wisexpense_analytical.duckdb`)
- **Frontend**: React, Vite (bundled as static files within the Python package)
- **Integration**: SimpleFIN API

## Security Note

Bank credentials are never structurally accessed or stored. The application only accesses read-only data through SimpleFIN Access URLs. Because there are no user accounts, you should only run this application locally on trusted machines.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
