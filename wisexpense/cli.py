import os
import secrets
import webbrowser
from pathlib import Path

import typer
from rich.console import Console
from rich.panel import Panel
from rich.prompt import Prompt

from wisexpense import __version__
from wisexpense.core.config import DEFAULT_DATA_DIR, save_config, get_settings

app = typer.Typer(
    name="wisexpense",
    help="🏦 WiseXpense — Self-hosted, agentic financial manager.",
    add_completion=False,
)
console = Console()


@app.command()
def start(
    port: int = typer.Option(8000, "--port", "-p", help="Port to run on"),
    host: str = typer.Option("127.0.0.1", "--host", "-h", help="Host to bind to"),
    no_browser: bool = typer.Option(False, "--no-browser", help="Don't open browser automatically"),
):
    """🚀 Start WiseXpense on localhost."""
    import uvicorn

    try:
        settings = get_settings()
        if not settings.PLAID_CLIENT_ID or not settings.PLAID_SECRET:
            raise ValueError("Keys missing")
    except Exception:
        console.print(
            "\n[yellow]⚠️  WiseXpense is missing Plaid API keys.[/yellow]"
            "\n   Run [bold]wisexpense setup[/bold] first to enter your Plaid Client ID and Secret.\n"
        )
        raise typer.Exit(1)

    url = f"http://{host}:{port}"
    console.print(
        Panel(
            f"[bold green]WiseXpense v{__version__}[/bold green]\n\n"
            f"🌐 Running at [link={url}]{url}[/link]\n"
            f"📁 Data directory: {DEFAULT_DATA_DIR}\n\n"
            f"[dim]Press Ctrl+C to stop[/dim]",
            title="🏦 WiseXpense",
            border_style="green",
        )
    )

    if not no_browser:
        webbrowser.open(url)

    uvicorn.run(
        "wisexpense.app:app",
        host=host,
        port=port,
        reload=False,
        log_level="info",
    )


@app.command()
def setup():
    """⚙️  Configure WiseXpense (Plaid API keys, etc.)."""
    console.print(
        Panel(
            "[bold]Welcome to WiseXpense Setup[/bold]\n\n"
            "Because WiseXpense is 100% private and runs locally on your machine,\n"
            "you must use your own free Plaid developer keys to connect to real banks.\n\n"
            "[bold cyan]How to get your free Plaid keys:[/bold cyan]\n"
            "1. Create a free account at [link=https://dashboard.plaid.com/signup]dashboard.plaid.com[/link]\n"
            "   (You do not need to enter a credit card or company info)\n"
            "2. Navigate to [bold]Team Settings → Keys[/bold] in the sidebar.\n"
            "3. Copy your [bold green]client_id[/bold green].\n"
            "4. Reveal and copy your [bold yellow]Development secret[/bold yellow] (for real banks) or Sandbox secret (for testing).",
            title="⚙️  Setup",
            border_style="cyan",
        )
    )

    # Get existing settings for defaults
    try:
        existing = get_settings()
    except Exception:
        existing = None

    # Plaid Client ID
    default_id = getattr(existing, "PLAID_CLIENT_ID", "") if existing else ""
    plaid_client_id = Prompt.ask(
        "\n🔑 Plaid Client ID",
        default=default_id if default_id else None,
    )

    # Plaid Secret
    default_secret = getattr(existing, "PLAID_SECRET", "") if existing else ""
    plaid_secret = Prompt.ask(
        "🔐 Plaid Secret (Paste your Development secret to connect real banks)",
        default=default_secret if default_secret else None,
    )

    # Plaid Environment
    default_env = getattr(existing, "PLAID_ENV", "development") if existing else "development"
    plaid_env = Prompt.ask(
        "🌍 Plaid Environment",
        choices=["sandbox", "development", "production"],
        default=default_env,
    )

    # Country codes
    default_countries = getattr(existing, "PLAID_COUNTRY_CODES", "US,CA") if existing else "US,CA"
    country_codes = Prompt.ask(
        "🏳️  Country codes (comma-separated)",
        default=default_countries,
    )

    # Create data directory
    DEFAULT_DATA_DIR.mkdir(parents=True, exist_ok=True)

    # Save config
    save_config(
        PLAID_CLIENT_ID=plaid_client_id,
        PLAID_SECRET=plaid_secret,
        PLAID_ENV=plaid_env,
        PLAID_COUNTRY_CODES=country_codes,
        PLAID_PRODUCTS="transactions",
    )

    console.print(
        Panel(
            f"[bold green]✅ Configuration saved![/bold green]\n\n"
            f"📁 Config file: {DEFAULT_DATA_DIR / 'config.env'}\n"
            f"🏦 Environment: {plaid_env}\n"
            f"🌍 Countries: {country_codes}\n\n"
            f"Run [bold]wisexpense start[/bold] to launch the app!",
            title="✅ Done",
            border_style="green",
        )
    )


@app.command()
def reset(
    yes: bool = typer.Option(False, "--yes", "-y", help="Skip confirmation"),
):
    """🗑️  Reset WiseXpense database (keeps config)."""
    if not yes:
        confirm = Prompt.ask(
            "\n⚠️  This will delete all your transaction data. Continue?",
            choices=["y", "n"],
            default="n",
        )
        if confirm != "y":
            console.print("[dim]Cancelled.[/dim]")
            raise typer.Exit(0)

    db_path = DEFAULT_DATA_DIR / "wisexpense.db"
    if db_path.exists():
        db_path.unlink()
        console.print("[green]✅ Database reset successfully.[/green]")
    else:
        console.print("[dim]No database found — nothing to reset.[/dim]")


@app.command()
def info():
    """ℹ️  Show WiseXpense configuration and status."""
    try:
        settings = get_settings()
        db_path = DEFAULT_DATA_DIR / "wisexpense.db"

        console.print(
            Panel(
                f"[bold]WiseXpense v{__version__}[/bold]\n\n"
                f"📁 Data directory: {DEFAULT_DATA_DIR}\n"
                f"🗄️  Database: {'exists' if db_path.exists() else 'not created yet'}\n"
                f"🏦 Plaid environment: {settings.PLAID_ENV}\n"
                f"🔑 Plaid configured: {'✅' if settings.PLAID_CLIENT_ID else '❌'}\n"
                f"🔗 Bank connected: {'✅' if settings.PLAID_ACCESS_TOKEN else '❌'}\n"
                f"🌍 Country codes: {settings.PLAID_COUNTRY_CODES}",
                title="ℹ️  Info",
                border_style="blue",
            )
        )
    except Exception:
        console.print(
            "[yellow]WiseXpense is not configured yet. "
            "Run [bold]wisexpense setup[/bold] first.[/yellow]"
        )


@app.callback(invoke_without_command=True)
def main(
    ctx: typer.Context,
    version: bool = typer.Option(False, "--version", "-v", help="Show version"),
):
    """🏦 WiseXpense — Self-hosted, agentic financial manager."""
    if version:
        console.print(f"WiseXpense v{__version__}")
        raise typer.Exit(0)
    if ctx.invoked_subcommand is None:
        console.print(ctx.get_help())
