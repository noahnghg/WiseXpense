import os
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from wisexpense.core.config import get_settings
from wisexpense.core.database import engine
from wisexpense.models.base import Base
from wisexpense.transactions.model import Transaction  # noqa: F401 — register model
from wisexpense.transactions.router import router as transactions_router
from wisexpense.plaid_integration.router import router as plaid_router
from wisexpense.analytics.router import router as analytics_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events."""
    try:
        Base.metadata.create_all(bind=engine)
        print("✅ Database ready.")
    except Exception as e:
        print(f"⚠️  Database error: {e}")
    yield
    engine.dispose()


def create_app() -> FastAPI:
    """Create and configure the FastAPI application."""
    settings = get_settings()

    app = FastAPI(
        title=settings.APP_NAME,
        version="0.1.0",
        lifespan=lifespan,
    )

    # --- API routers ---
    app.include_router(plaid_router, prefix="/api/plaid", tags=["Plaid"])
    app.include_router(transactions_router, prefix="/api/transactions", tags=["Transactions"])
    app.include_router(analytics_router, prefix="/api/analytics", tags=["Analytics"])

    @app.get("/api/health")
    def health_check():
        return {"status": "healthy"}

    # --- Serve React frontend ---
    static_dir = Path(__file__).parent / "static"
    if static_dir.exists() and (static_dir / "index.html").exists():
        # Serve static assets (JS, CSS, images)
        assets_dir = static_dir / "assets"
        if assets_dir.exists():
            app.mount("/assets", StaticFiles(directory=str(assets_dir)), name="assets")

        # Serve index.html for all non-API routes (SPA routing)
        @app.get("/{full_path:path}")
        async def serve_spa(full_path: str):
            # Try to serve the exact file first
            file_path = static_dir / full_path
            if full_path and file_path.exists() and file_path.is_file():
                return FileResponse(str(file_path))
            # Otherwise serve index.html (SPA client-side routing)
            return FileResponse(str(static_dir / "index.html"))

    return app


# Module-level app instance for uvicorn
app = create_app()
