import os
import secrets
import webbrowser
import time
from pathlib import Path

import typer
from rich.console import Console
from rich.panel import Panel
from rich.prompt import Prompt
from rich.progress import Progress, SpinnerColumn, TextColumn

from wisexpense import __version__
from wisexpense.core.config import DEFAULT_DATA_DIR, save_config, get_settings
from wisexpense.simplefin_integration.client import claim_setup_token

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
        if not settings.SIMPLEFIN_ACCESS_URL and not settings.SIMPLEFIN_SETUP_TOKEN:
            raise ValueError("Keys missing")
    except Exception:
        console.print(
            "\n[yellow]⚠️  WiseXpense is missing SimpleFIN or AI keys.[/yellow]"
            "\n   Run [bold]wisexpense setup[/bold] first to configure the app.\n"
        )
        raise typer.Exit(1)

    url = f"http://{host}:{port}"
    
    # Simulate Brain startup sequence
    with Progress(
        SpinnerColumn(),
        TextColumn("[progress.description]{task.description}"),
        transient=True,
    ) as progress:
        task1 = progress.add_task("[cyan]Initializing Agentic Brain...", total=None)
        time.sleep(1)
        progress.update(task1, description="[green]Connecting to SimpleFIN Bridge...")
        time.sleep(1.5)
        progress.update(task1, description="[yellow]Pulling your real-time financial data...")
        time.sleep(2)
        progress.update(task1, description="[magenta]Analyzing spending patterns...")
        time.sleep(1.5)

    console.print(
        Panel(
            f"[bold green]WiseXpense v{__version__}[/bold green]\n\n"
            f"🤖 Agentic Base: {settings.AI_PROVIDER.title()}\n"
            f"🌐 Running at [link={url}]{url}[/link]\n"
            f"📁 Data directory: {DEFAULT_DATA_DIR}\n\n"
            f"[dim]Press Ctrl+C to stop[/dim]",
            title="🏦 WiseXpense initialized",
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
    """⚙️  Configure WiseXpense (SimpleFIN + Agent LLM)."""
    console.print(
        Panel(
            "[bold]Welcome to WiseXpense Setup[/bold]\n\n"
            "Because WiseXpense is 100% private and runs locally on your machine,\n"
            "you must use your own SimpleFIN token to connect to banks securely.\n\n"
            "[bold cyan]How to get your free SimpleFIN token:[/bold cyan]\n"
            "1. Visit [link=https://bridge.simplefin.org/]bridge.simplefin.org[/link]\n"
            "2. Connect your bank and copy your [bold green]Setup Token[/bold green].\n",
            title="⚙️  Setup",
            border_style="cyan",
        )
    )

    try:
        existing = get_settings()
    except Exception:
        existing = None

    default_token = getattr(existing, "SIMPLEFIN_SETUP_TOKEN", "") if existing else ""
    simplefin_token = Prompt.ask(
        "\n🔑 SimpleFIN Setup Token",
        default=default_token if default_token else None,
    )

    # Claim the access URL from the setup token right away
    access_url = getattr(existing, "SIMPLEFIN_ACCESS_URL", "") if existing else ""
    if simplefin_token and simplefin_token != default_token:
        try:
            with console.status("[bold green]Claiming Access URL from Setup Token..."):
                access_url = claim_setup_token(simplefin_token)
            console.print("[green]✅ SimpleFIN Access URL claimed successfully![/green]\n")
        except Exception as e:
            console.print(f"[red]❌ Failed to exchange Setup Token: {e}[/red]\n")
            raise typer.Exit(1)

    console.print(
        Panel(
            "[bold magenta]🤖 Configure AI Agent[/bold magenta]\n\n"
            "WiseXpense uses LLMs to intelligently analyze your spending and answer questions.\n"
            "We recommend Google Gemini, but you can use Claude, OpenAI, or a local Ollama instance.",
            border_style="magenta",
        )
    )
    default_provider = getattr(existing, "AI_PROVIDER", "gemini") if existing else "gemini"
    ai_provider = Prompt.ask(
        "🧠 Choose AI Provider",
        choices=["gemini", "claude", "openai", "ollama"],
        default=default_provider,
    )
    
    default_key = getattr(existing, "AI_API_KEY", "") if existing else ""
    if ai_provider != "ollama":
        ai_key = Prompt.ask(
            f"🔑 {ai_provider.title()} API Key",
            default=default_key if default_key else None,
            password=True
        )
    else:
        ai_key = "ollama"

    DEFAULT_DATA_DIR.mkdir(parents=True, exist_ok=True)

    save_config(
        SIMPLEFIN_SETUP_TOKEN=simplefin_token,
        SIMPLEFIN_ACCESS_URL=access_url,
        AI_PROVIDER=ai_provider,
        AI_API_KEY=ai_key,
    )

    console.print(
        Panel(
            f"[bold green]✅ Configuration saved![/bold green]\n\n"
            f"📁 Config file: {DEFAULT_DATA_DIR / 'config.env'}\n"
            f"🧠 Agent: {ai_provider.title()}\n\n"
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

    db_paths = [
        DEFAULT_DATA_DIR / "wisexpense.db",
        DEFAULT_DATA_DIR / "wisexpense_analytical.duckdb"
    ]
    
    for p in db_paths:
        if p.exists():
            p.unlink()
            
    console.print("[green]✅ Databases reset successfully.[/green]")


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
                f"🏦 SimpleFIN configured: {'✅' if settings.SIMPLEFIN_SETUP_TOKEN else '❌'}\n"
                f"🔗 SimpleFIN Access: {'✅' if settings.SIMPLEFIN_ACCESS_URL else '❌'}\n"
                f"🧠 AI Agent: {settings.AI_PROVIDER.title()}",
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
